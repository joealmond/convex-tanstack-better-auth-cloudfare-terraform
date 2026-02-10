# Optional Features & Extensions

This document covers optional features you can add to the template.

## Already Included ✅

The template comes with these UI utilities pre-installed:

### Sonner (Toast Notifications)

Already installed! Use it like:

```tsx
import { toast } from 'sonner'

// Show a toast
toast.success('Message sent!')
toast.error('Something went wrong')
toast.info('FYI...')
```

The `<Toaster />` component is already in `__root.tsx`.

### Class Utilities (cn function)

The `cn()` utility for conditional class names is in `src/lib/cn.ts`:

```tsx
import { cn } from '@/lib/cn'

<div className={cn('base-class', isActive && 'active-class', 'always-class')}>
```

### Lucide React (Icons)

Already included! Import icons like:

```tsx
import { User, Settings, LogOut } from 'lucide-react'
```

### Radix UI Slot

Already installed for composable components:

```tsx
import { Slot } from '@radix-ui/react-slot'
```

---

## UI Extensions (Optional)

### Shadcn UI

Component library built on Radix UI primitives.

```bash
npx shadcn@latest init
npx shadcn@latest add button card input dialog
```

### Framer Motion (Animations)

```bash
npm install framer-motion
```

---

## Alternative Technologies

### Authentication: Clerk

If you prefer pre-built UI components and easier setup, see [CLERK_SETUP.md](CLERK_SETUP.md).

### Deploy Platforms

- [Vercel Setup](VERCEL_SETUP.md) - Easy deployment with great DX
- [Netlify Setup](NETLIFY_SETUP.md) - Simple deployment with built-in forms

---

## Forms ✅

### React Hook Form + Zod (Already Included)

The template includes react-hook-form with Zod validation. See `src/components/ExampleForm.tsx` for a complete example.

```tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

function LoginForm() {
  const { register, handleSubmit } = useForm({
    resolver: zodResolver(schema),
  })
  // ...
}
```

---

## Testing

### Vitest (Unit Testing)

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

Create `vitest.config.ts`:

```ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
  },
})
```

### Playwright (E2E Testing)

```bash
npm install -D @playwright/test
npx playwright install
```

---

## Observability

### Sentry (Error Tracking)

```bash
npm install @sentry/react
```

```tsx
import * as Sentry from '@sentry/react'

Sentry.init({
  dsn: 'YOUR_SENTRY_DSN',
  environment: import.meta.env.VITE_APP_ENV,
})
```

### PostHog (Analytics)

```bash
npm install posthog-js
```

---

## Convex Extensions

### Cron Jobs (Scheduled Tasks)

Convex supports cron jobs natively for recurring tasks like daily cleanup or weekly reports.

```typescript
// convex/crons.ts
import { cronJobs } from 'convex/server'
import { internal } from './_generated/api'

const crons = cronJobs()

// Run daily at midnight UTC
crons.daily('resetDailyLimits', { hourUTC: 0, minuteUTC: 0 }, internal.tasks.resetLimits)

// Run every hour
crons.interval('cleanupExpired', { hours: 1 }, internal.tasks.cleanupExpiredSessions)

// Run weekly on Monday at 9am UTC
crons.weekly('weeklyReport', { dayOfWeek: 'monday', hourUTC: 9 }, internal.tasks.generateReport)

export default crons
```

See [Convex Cron Jobs docs](https://docs.convex.dev/scheduling/cron-jobs) for more options.

### ShardedCounter (High-Write Counters)

When a single document field receives more than ~100 writes/sec (e.g., vote counts, like counters), use sharded counters to avoid contention.

```bash
npm install @convex-dev/sharded-counter
```

```typescript
// convex/convex.config.ts
import { defineApp } from 'convex/server'
import shardedCounter from '@convex-dev/sharded-counter/convex.config'

const app = defineApp()
app.use(shardedCounter)
export default app
```

```typescript
// convex/votes.ts
import { ShardedCounter } from '@convex-dev/sharded-counter'
import { components } from './_generated/api'

const counter = new ShardedCounter(components.shardedCounter)

// Increment
await counter.add(ctx, 'product:123:votes', 1)

// Read count
const count = await counter.count(ctx, 'product:123:votes')
```

---

## Mobile

### Capacitor (Web → Native)

Convert the web app to native iOS/Android by wrapping with Capacitor. See [MOBILE.md](MOBILE.md) for the full guide.

---

## Internationalization

### react-i18next

```bash
npm install react-i18next i18next i18next-browser-languagedetector
```

See [react-i18next docs](https://react.i18next.com/) for setup.

---

## Performance Optimizations

### What's Already Implemented ✅

The template includes these optimizations out of the box:

| Optimization            | Location           | Description                                                                   |
| ----------------------- | ------------------ | ----------------------------------------------------------------------------- |
| **Vendor Chunking**     | `vite.config.ts`   | React, TanStack, and Convex are split into separate chunks for better caching |
| **Terser Minification** | `vite.config.ts`   | Production builds strip console logs and minimize code                        |
| **Edge SSR**            | Cloudflare Workers | HTML is rendered at the edge, reducing latency                                |

---

### Route Lazy Loading

**When to add:** Once your app has 5+ routes, consider lazy loading to reduce initial bundle size.

```tsx
// src/routes/dashboard.tsx
import { createFileRoute } from '@tanstack/react-router'
import { lazy, Suspense } from 'react'

const DashboardPage = lazy(() => import('../components/DashboardPage'))

export const Route = createFileRoute('/dashboard')({
  component: () => (
    <Suspense fallback={<div>Loading...</div>}>
      <DashboardPage />
    </Suspense>
  ),
})
```

---

### Link Prefetching

TanStack Router supports prefetching on hover/focus. Add `preload` to your Links:

```tsx
<Link to="/dashboard" preload="intent">
  Dashboard
</Link>
```

Options:

- `"intent"` - Prefetch when user hovers/focuses (recommended)
- `"viewport"` - Prefetch when link enters viewport
- `"render"` - Prefetch immediately on render

---

### Image Optimization

For production apps, consider:

**Option 1: Cloudflare Images** (if using Cloudflare)

```tsx
// Use Cloudflare's image CDN for automatic resizing/optimization
<img src="https://imagedelivery.net/YOUR_ACCOUNT/image-id/public" />
```

**Option 2: unpic (framework-agnostic)**

```bash
npm install @unpic/react
```

```tsx
import { Image } from '@unpic/react'
;<Image src="https://example.com/photo.jpg" width={800} height={600} alt="Description" />
```

---

### React Query Caching

Convex queries are real-time by default, but for non-reactive data you can tune caching:

```tsx
const { data } = useQuery({
  ...convexQuery(api.static.getConfig, {}),
  staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  gcTime: 1000 * 60 * 30, // Keep in memory for 30 minutes
})
```

---

### Bundle Analysis

To analyze your bundle size:

```bash
npm install -D rollup-plugin-visualizer
```

Add to `vite.config.ts`:

```ts
import { visualizer } from 'rollup-plugin-visualizer'

// In plugins array:
visualizer({ filename: 'stats.html', open: true })
```

Then run `npm run build` and open `stats.html` to see what's taking up space.

---

## SEO

### Dynamic OG Images

Use [Satori](https://github.com/vercel/satori) for generating Open Graph images at runtime.

### Sitemap Generation

Generate `sitemap.xml` during build or use a route handler.

---

## Data Governance & GDPR

For GDPR compliance and user data management, implement these patterns in your Convex functions.

### Export User Data

```ts
// convex/gdpr.ts
import { query } from './_generated/server'
import { requireAuth } from './lib/authHelpers'

export const exportMyData = query({
  args: {},
  handler: async (ctx) => {
    const user = await requireAuth(ctx)

    // Collect all user data
    const messages = await ctx.db
      .query('messages')
      .filter((q) => q.eq(q.field('authorId'), user._id))
      .collect()

    const files = await ctx.db
      .query('files')
      .filter((q) => q.eq(q.field('uploadedBy'), user._id))
      .collect()

    return {
      user: { id: user._id, name: user.name, email: user.email },
      messages,
      files,
      exportedAt: new Date().toISOString(),
    }
  },
})
```

### Delete User Data (Right to be Forgotten)

```ts
// convex/gdpr.ts
import { mutation } from './_generated/server'
import { requireAuth } from './lib/authHelpers'

export const deleteMyData = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await requireAuth(ctx)

    // Delete messages
    const messages = await ctx.db
      .query('messages')
      .filter((q) => q.eq(q.field('authorId'), user._id))
      .collect()
    for (const msg of messages) {
      await ctx.db.delete(msg._id)
    }

    // Delete files (also remove from storage)
    const files = await ctx.db
      .query('files')
      .filter((q) => q.eq(q.field('uploadedBy'), user._id))
      .collect()
    for (const file of files) {
      await ctx.storage.delete(file.storageId)
      await ctx.db.delete(file._id)
    }

    // Note: User account deletion should use Better Auth's deleteUser
    return { deletedMessages: messages.length, deletedFiles: files.length }
  },
})
```

---

## Error Handling Best Practices

### When to Use Each Pattern

| Pattern               | When to Use                           | Example                              |
| --------------------- | ------------------------------------- | ------------------------------------ |
| **Error Boundary**    | UI rendering errors                   | Component crashes, missing data      |
| **try/catch**         | Async operations you can recover from | Failed API calls, retryable errors   |
| **throw new Error()** | Unrecoverable errors in Convex        | Invalid permissions, missing records |

### Custom Convex Errors

```ts
// convex/lib/errors.ts
export class AuthError extends Error {
  constructor(message = 'Authentication required') {
    super(message)
    this.name = 'AuthError'
  }
}

export class ForbiddenError extends Error {
  constructor(message = 'Access denied') {
    super(message)
    this.name = 'ForbiddenError'
  }
}

export class NotFoundError extends Error {
  constructor(resource: string) {
    super(`${resource} not found`)
    this.name = 'NotFoundError'
  }
}
```

### Frontend Error Handling

```tsx
// Handle Convex mutation errors
const sendMessage = useConvexMutation(api.messages.send)

const handleSubmit = async () => {
  try {
    await sendMessage({ content: message })
  } catch (error) {
    if (error.message.includes('Authentication')) {
      toast.error('Please sign in to send messages')
    } else if (error.message.includes('Admin')) {
      toast.error('You need admin access for this action')
    } else {
      toast.error('Something went wrong')
      // Error will also be captured by Sentry if configured
    }
  }
}
```

---

## VS Code Extensions

These are recommended in `.vscode/extensions.json`:

| Extension                   | Purpose               |
| --------------------------- | --------------------- |
| `dbaeumer.vscode-eslint`    | Linting               |
| `esbenp.prettier-vscode`    | Formatting            |
| `bradlc.vscode-tailwindcss` | Tailwind autocomplete |
| `hashicorp.terraform`       | Terraform support     |
| `usernamehw.errorlens`      | Inline errors         |

---

## Template Feature Status

Features evaluated for this template. Items marked ✅ are included; others are optional additions.

| Feature | Status | Notes |
|---------|--------|-------|
| shadcn/ui components | ⚠️ Not included | Template has `cn()` utility but no pre-built components. Add with `npx shadcn@latest init` |
| Testing (Vitest) | ✅ Included | `vitest` + `happy-dom` + `@testing-library/react` |
| Toast notifications | ⚠️ Suggested | Add `sonner` — easy setup, commonly needed |
| Protected routes | ✅ Included | `_authenticated.tsx` layout pattern |
| Form handling | ⚠️ Suggested | `react-hook-form` + `@hookform/resolvers` + `zod` |
| 404/Error routes | ✅ Included | `NotFound` component + `defaultNotFoundComponent` |
| i18n | ⚠️ Suggested | Static JSON imports pattern (see Architecture doc) |
| Database seeding | ⚠️ Suggested | `npx convex run seed:seedData` |
| Rate limiting | ✅ Included | `@convex-dev/rate-limiter` with token bucket |
| Charts | ⚠️ Optional | `recharts` for data visualization |

---

## Security Checklist

Before deploying to production:

- [ ] Set strong `BETTER_AUTH_SECRET` (32+ random characters via `openssl rand -base64 32`)
- [ ] Configure CSP headers in Cloudflare (via `wrangler.jsonc` or Cloudflare dashboard)
- [ ] Enable rate limiting on auth endpoints
- [ ] Set up monitoring and alerting (Sentry, Cloudflare analytics)
- [ ] Review admin email whitelist in Convex config
- [ ] Enable Cloudflare security features (WAF, bot protection)
- [ ] Restrict OAuth redirect URIs to production domains only
- [ ] Audit all `import.meta.env` usage — no secrets in `VITE_` prefixed vars
- [ ] Test CORS configuration matches production origins

---

## Upgrade Guide

### Upgrading TanStack Packages

TanStack packages are versioned together. Update all at once:

```bash
npm update @tanstack/react-start @tanstack/react-router @tanstack/react-query @tanstack/react-router-ssr-query
```

### Upgrading Convex

```bash
npx convex update
npm update convex @convex-dev/better-auth @convex-dev/react-query
```

### Upgrading Cloudflare

```bash
npm update wrangler @cloudflare/vite-plugin
```

Check `compatibility_date` in `wrangler.jsonc` and update to a recent date.

### Known Breaking Changes

- **TanStack Start v1.154+**: `start.tsx` and `server.ts` entry points simplified (see Architecture doc)
- **Convex 1.30+**: New auth patterns — check `@convex-dev/better-auth` migration notes
- **Cloudflare Vite Plugin**: `nodejs_compat` auto-added — use `nodejs_compat_v2` to avoid duplicates
