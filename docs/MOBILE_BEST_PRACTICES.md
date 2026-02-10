# Mobile App Best Practices

Design, performance, and UX best practices for building mobile apps with this template + Capacitor. Complements [MOBILE.md](MOBILE.md) (setup & integration guide).

---

## Cross-Device Consistency

### Universal Viewport Setup

Every phone has different dimensions, notches, and dynamic browser bars. Use modern CSS viewport units and `viewport-fit=cover` to handle them all:

```html
<!-- In your root HTML / __root.tsx -->
<meta
  name="viewport"
  content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover"
/>
```

> **Why `maximum-scale=1, user-scalable=no`?** Prevents double-tap zoom on form inputs, which causes jarring layout shifts on iOS. If your app needs pinch-to-zoom (e.g., maps, images), apply `touch-action: manipulation` on specific elements instead.

### Modern Viewport Height Units

`100vh` is broken on mobile — it ignores the dynamic address bar. Use the new viewport units:

```css
/* ❌ Broken on mobile — overflows behind address bar */
.full-screen { height: 100vh; }

/* ✅ Dynamic — adjusts as address bar appears/disappears */
.full-screen { height: 100dvh; }

/* ✅ Small viewport — always fits even with address bar visible */
.full-screen-safe { height: 100svh; }

/* ✅ Large viewport — full height when address bar is hidden */
.full-screen-max { height: 100lvh; }
```

| Unit | Behavior | Best For |
|------|----------|----------|
| `dvh` | Adjusts dynamically as browser UI shows/hides | Full-screen layouts, modals |
| `svh` | Smallest possible viewport (address bar visible) | Content that must never overflow |
| `lvh` | Largest possible viewport (address bar hidden) | Splash screens, immersive views |

### Safe Area Insets

Devices have status bars (20–54px), notches (iPhone 14–16), dynamic islands, and home indicators (34px). Use CSS environment variables:

```css
:root {
  /* Apply safe areas to the root layout */
  --sat: env(safe-area-inset-top);
  --sab: env(safe-area-inset-bottom);
  --sal: env(safe-area-inset-left);
  --sar: env(safe-area-inset-right);
}

.app-header {
  padding-top: calc(var(--sat) + 8px);
}

.bottom-nav {
  padding-bottom: calc(var(--sab) + 8px);
}
```

> **Tip**: On Capacitor iOS, `env(safe-area-inset-top)` is ~54px on iPhone with Dynamic Island, ~44px with notch, ~20px on SE. Test all three.

### Fluid Typography & Spacing

Avoid fixed `px` for text and spacing — use `clamp()` for a smooth scale across 320px (iPhone SE) to 430px (iPhone 16 Pro Max) to tablets:

```css
/* Fluid body text: 14px min → 16px preferred → 18px max */
body {
  font-size: clamp(0.875rem, 2.5vw + 0.5rem, 1.125rem);
}

/* Fluid heading */
h1 {
  font-size: clamp(1.5rem, 5vw + 0.5rem, 2.25rem);
}

/* Fluid padding */
.card {
  padding: clamp(12px, 3vw, 24px);
}
```

### Responsive Breakpoints

Don't target specific devices — target design breakpoints:

```css
/* Small phones (iPhone SE, Galaxy A series) */
@media (max-width: 374px) { /* ... compact layout */ }

/* Standard phones (iPhone 14–16, Pixel) */
@media (min-width: 375px) and (max-width: 767px) { /* ... default mobile */ }

/* Small tablets / large phones in landscape */
@media (min-width: 768px) { /* ... tablet layout */ }
```

Use **container queries** for component-level responsiveness:

```css
.product-card-container { container-type: inline-size; }

@container (min-width: 300px) {
  .product-card { flex-direction: row; }
}

@container (max-width: 299px) {
  .product-card { flex-direction: column; }
}
```

---

## Touch & Interaction Design

### Touch Target Sizes

Apple requires **44×44pt** minimum, Google requires **48×48dp**. For accessibility (WCAG AAA), use **44×44 CSS px**:

```css
/* Ensure all interactive elements meet minimum size */
button, a, [role="button"], input, select, textarea {
  min-height: 44px;
  min-width: 44px;
}

/* Icon buttons need explicit sizing */
.icon-button {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

### Touch Target Spacing

Adjacent touch targets need **≥8px** gap to prevent mis-taps. Google recommends 32px between small targets:

```css
.button-group {
  display: flex;
  gap: 12px; /* Minimum 8px, 12px is comfortable */
}

.action-list > * + * {
  margin-top: 8px;
}
```

### Thumb Zone Layout

70%+ of users hold their phone one-handed. Place primary actions in the bottom 40% of the screen:

```
┌─────────────────────┐
│  Hard to reach       │ ← Status info, read-only content
│  (top 20%)           │
├─────────────────────┤
│  Stretch zone        │ ← Secondary actions, navigation
│  (middle 40%)        │
├─────────────────────┤
│  Natural thumb zone  │ ← Primary actions, FAB, bottom nav
│  (bottom 40%)        │
└─────────────────────┘
```

**Recommended layout pattern:**
- **Top bar**: App title + minimal icons (search, settings)
- **Content area**: Scrollable feed/list
- **Bottom navigation**: 3–5 tab icons (Home, Search, Add, Profile)
- **FAB (Floating Action Button)**: Bottom-right for primary action

### Prevent Ghost Clicks & Double Taps

```css
/* Eliminate 300ms tap delay on all mobile browsers */
html {
  touch-action: manipulation;
}

/* Prevent text selection during swipe gestures */
.swipeable {
  user-select: none;
  -webkit-user-select: none;
}

/* Smooth scrolling for content areas */
.scrollable {
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain; /* Prevents pull-to-refresh interference */
}
```

---

## Performance Optimization

### Image Optimization Pipeline

Images are the #1 performance bottleneck on mobile. Implement a client-side pipeline before upload:

```typescript
// src/lib/image-utils.ts
export async function optimizeImage(
  file: File,
  maxWidth = 1024,
  quality = 0.8
): Promise<Blob> {
  const img = await createImageBitmap(file)
  const scale = Math.min(1, maxWidth / img.width)
  const canvas = new OffscreenCanvas(
    Math.round(img.width * scale),
    Math.round(img.height * scale)
  )
  const ctx = canvas.getContext('2d')!
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
  return canvas.convertToBlob({ type: 'image/webp', quality })
}

// Usage in upload handler:
const optimized = await optimizeImage(rawFile) // ~70% smaller than raw JPEG
const storageId = await uploadToConvex(optimized)
```

**Impact**: A typical 4MB phone photo becomes ~200–400KB WebP. This reduces:
- Upload time: **10× faster** on 3G/4G
- Storage costs: **70–80% less** Convex storage
- Page load: images load **3–5× faster**

### Lazy Loading & Code Splitting

```tsx
// Lazy load heavy components
const MatrixChart = lazy(() => import('../components/dashboard/MatrixChart'))
const MapView = lazy(() => import('../components/MapView'))

// Use Suspense with skeleton fallbacks
<Suspense fallback={<ChartSkeleton />}>
  <MatrixChart data={products} />
</Suspense>
```

### Loading Skeletons

Users perceive skeleton screens as 30% faster than spinners. Always show structure:

```tsx
function ProductCardSkeleton() {
  return (
    <div className="product-card-skeleton">
      <div className="skeleton-image" /> {/* aspect-ratio: 4/3 */}
      <div className="skeleton-text w-3/4" />
      <div className="skeleton-text w-1/2" />
    </div>
  )
}
```

```css
.skeleton-image, .skeleton-text {
  background: linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 8px;
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
```

### Bundle Size Budget

For Capacitor apps, the entire web bundle loads from disk — but smaller is still better for startup time:

| Budget | Target | Tool |
|--------|--------|------|
| Initial JS | < 200KB gzipped | Vite's `manualChunks` |
| Total JS | < 500KB gzipped | `rollup-plugin-visualizer` |
| Largest image | < 100KB | WebP + resize |
| First paint | < 1.5s | Lighthouse |

---

## Convex Real-Time on Mobile

### Handling Connection Changes

Convex's WebSocket connection handles brief network blips automatically. For longer offline periods:

```typescript
// src/hooks/use-connection-status.ts
import { useConvex } from 'convex/react'
import { useState, useEffect } from 'react'

export function useConnectionStatus() {
  const convex = useConvex()
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return { isOnline }
}
```

Show a non-intrusive banner when offline:

```tsx
function OfflineBanner() {
  const { isOnline } = useConnectionStatus()
  if (isOnline) return null

  return (
    <div className="offline-banner">
      📡 You're offline — changes will sync when you reconnect
    </div>
  )
}
```

### Optimistic Updates

Convex mutations are optimistic by default, but you can explicitly define optimistic behavior for instant feedback:

```typescript
// Example: optimistic vote — shows immediately, confirms via WebSocket
const castVote = useMutation(api.votes.cast).withOptimisticUpdate(
  (localStore, args) => {
    const existing = localStore.getQuery(api.products.get, { id: args.productId })
    if (existing) {
      localStore.setQuery(api.products.get, { id: args.productId }, {
        ...existing,
        voteCount: existing.voteCount + 1,
      })
    }
  }
)
```

### Query Caching for Non-Reactive Data

Some data rarely changes (config, categories). Reduce WebSocket traffic:

```tsx
const { data: config } = useQuery({
  ...convexQuery(api.config.get, {}),
  staleTime: 1000 * 60 * 30,  // Cache for 30 min
  gcTime: 1000 * 60 * 60,     // Keep in memory for 1 hour
})
```

---

## Push Notifications

### Setup with Firebase Cloud Messaging

```bash
npm install @capacitor/push-notifications
npx cap sync
```

**iOS**: Requires Apple Developer account + enable Push Notifications capability in Xcode.

**Android**: Add `google-services.json` from Firebase Console to `android/app/`.

```typescript
// src/lib/push-notifications.ts
import { PushNotifications } from '@capacitor/push-notifications'
import { isNative } from './platform'

export async function initPushNotifications() {
  if (!isNative()) return // Web uses browser Notification API instead

  const permission = await PushNotifications.requestPermissions()
  if (permission.receive !== 'granted') return

  await PushNotifications.register()

  PushNotifications.addListener('registration', (token) => {
    // Send token to your Convex backend
    // convexClient.mutation(api.notifications.registerDevice, { token: token.value })
  })

  PushNotifications.addListener('pushNotificationReceived', (notification) => {
    // Handle foreground notification (show in-app toast)
    console.log('Push received:', notification)
  })

  PushNotifications.addListener('pushNotificationActionPerformed', (action) => {
    // Handle notification tap — navigate to relevant screen
    const { data } = action.notification
    if (data.productId) {
      // router.navigate({ to: '/product/$name', params: { name: data.productName } })
    }
  })
}
```

---

## Deep Linking

Enable links like `https://yourapp.com/product/oat-milk` to open directly in the native app:

### iOS Universal Links

1. Create `apple-app-site-association` file on your web server:
```json
{
  "applinks": {
    "apps": [],
    "details": [{ "appID": "TEAMID.com.yourcompany.appname", "paths": ["/product/*", "/profile/*"] }]
  }
}
```

2. Enable "Associated Domains" in Xcode: `applinks:yourapp.com`

### Android App Links

1. Create `assetlinks.json` at `https://yourapp.com/.well-known/assetlinks.json`
2. Add intent filter in `AndroidManifest.xml`

### Handle Deep Links in App

```typescript
import { App } from '@capacitor/app'

App.addListener('appUrlOpen', ({ url }) => {
  const path = new URL(url).pathname
  // router.navigate({ to: path })
})
```

---

## Accessibility on Mobile

### Screen Readers

Test with VoiceOver (iOS) and TalkBack (Android):

```tsx
// Ensure all interactive elements have accessible labels
<button aria-label="Vote for this product">
  <HeartIcon />  {/* Icon-only buttons MUST have aria-label */}
</button>

// Use semantic HTML
<nav aria-label="Main navigation">
  <ul role="tablist">
    <li role="tab" aria-selected={isActive}>Home</li>
  </ul>
</nav>

// Announce dynamic content changes
<div aria-live="polite" aria-atomic="true">
  {voteCount} votes
</div>
```

### Reduced Motion

Respect users who prefer reduced motion:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Color Contrast

Maintain **4.5:1** minimum contrast ratio (WCAG AA). Test with Chrome DevTools → Rendering → Emulate vision deficiencies.

### Dynamic Type Support

Use `rem` units so text scales with system font size preferences:

```css
/* ❌ Fixed size — ignores user's accessibility settings */
.label { font-size: 14px; }

/* ✅ Scales with system font size */
.label { font-size: 0.875rem; }
```

---

## Dark Mode

Capacitor WebViews inherit the system dark mode preference. Support it:

```css
:root {
  --bg: #ffffff;
  --text: #1a1a1a;
  --card: #f5f5f5;
  --border: #e0e0e0;
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg: #0a0a0a;
    --text: #f0f0f0;
    --card: #1a1a1a;
    --border: #333333;
  }
}
```

**Capacitor-specific**: On iOS, the status bar text color adapts automatically. On Android, set status bar style:

```typescript
import { StatusBar, Style } from '@capacitor/status-bar'

// Match status bar to your app's theme
if (isDarkMode) {
  StatusBar.setStyle({ style: Style.Dark })
} else {
  StatusBar.setStyle({ style: Style.Light })
}
```

---

## Testing Matrix

Test on real devices whenever possible. Minimum coverage matrix:

| Category | Devices | Why |
|----------|---------|-----|
| **Small phone** | iPhone SE (375×667) | Smallest common viewport |
| **Standard phone** | iPhone 15 (393×852) | Most popular size class |
| **Large phone** | iPhone 16 Pro Max (430×932) | Largest common viewport |
| **Android mid-range** | Pixel 7a / Samsung A54 | Most common Android tier |
| **Android flagship** | Pixel 8 / Samsung S24 | High DPI, latest OS |
| **Older Android** | Android 10 device | WebView compatibility |

**Testing checklist:**
- [ ] Safe area insets render correctly (no content behind notch/status bar)
- [ ] Touch targets ≥44px on all interactive elements
- [ ] Text readable without pinch-zoom (≥16px body)
- [ ] Dark mode renders correctly
- [ ] Orientation lock works (stays portrait)
- [ ] Keyboard doesn't obscure input fields
- [ ] Back gesture works (Android hardware back, iOS swipe)
- [ ] Offline → online transition shows reconnection
- [ ] Images load within 2 seconds on 4G
- [ ] App startup < 3 seconds cold, < 1.5s warm

---

## Quick Reference

| Concern | Recommendation |
|---------|---------------|
| Full height | Use `100dvh`, not `100vh` |
| Safe areas | `env(safe-area-inset-*)` + `viewport-fit=cover` |
| Touch targets | ≥44×44px with ≥8px spacing |
| Body font | ≥16px (`1rem`) to avoid iOS auto-zoom |
| Image format | WebP, ≤100KB, lazy loaded |
| Animations | Honor `prefers-reduced-motion` |
| Dark mode | `prefers-color-scheme: dark` |
| Orientation | Lock to portrait |
| JS budget | <200KB initial, <500KB total (gzipped) |
| Offline | Show banner, Convex auto-reconnects |

---

*Last updated: February 2026*
