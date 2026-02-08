# Future Roadmap

Features and improvements planned for future releases. Items are organized by priority and effort.

## Phase 1: Polish (High Priority, Low Effort)

### Rename Repository

- [x] Rename from `convex-tanstack-cloudfare` → `convex-tanstack-cloudflare`
- [x] Update all internal references

### Dependency Updates

- [x] Updated all packages to latest stable versions
- [ ] Automate with Dependabot or Renovate

### Security Checklist Document

- [ ] Add `docs/SECURITY.md` with production hardening steps
- [ ] Document `setAdminByEmail` lockdown process
- [ ] CSRF/XSS mitigation notes for Cloudflare Workers
- [ ] Content Security Policy headers example

### Architecture Decision Records (ADRs)

- [ ] Better Auth vs Clerk (self-hosted, data ownership)
- [ ] Cloudflare Workers vs Vercel (edge, R2 integration)
- [ ] TanStack Start vs Next.js (SSR patterns, portability)

---

## Phase 2: Enhanced DX (High Priority, Medium Effort)

### shadcn/ui Integration

- [ ] Add `components.json` for shadcn/ui CLI
- [ ] Include basic components: Button, Card, Dialog, Input
- [ ] Update ExampleForm to use shadcn/ui components
- [ ] Document installation in OPTIONAL_FEATURES.md

### API Reference Documentation

- [ ] Auto-generate Convex function reference from JSDoc comments
- [ ] Document all query/mutation args, return types, and error cases
- [ ] Add request/response examples

### Improved Error Handling

- [ ] Add custom error classes (`AuthError`, `NotFoundError`, `ValidationError`)
- [ ] Frontend error handler hook with error-type-specific toast messages
- [ ] Error tracking setup guide (Sentry, LogRocket)

### Database Migrations Guide

- [ ] Document schema evolution patterns for Convex
- [ ] Example migration scripts for adding/removing fields

### SEO & Meta Tags Management

- [ ] Meta tag management hook for TanStack Start SSR
- [ ] Open Graph and Twitter Card examples
- [ ] Structured data (JSON-LD) for rich snippets
- [ ] Dynamic sitemap generation

### Data Tables with TanStack Table

- [ ] TanStack Table integration example (`@tanstack/react-table`)
- [ ] Sorting, filtering, and column visibility
- [ ] Server-side pagination with Convex
- [ ] Keyboard accessibility for tables

### Pagination & Infinite Scroll

- [ ] Cursor-based pagination pattern with Convex
- [ ] Infinite scroll hook (`use-infinite-scroll.ts`)
- [ ] Loading states and error boundaries
- [ ] Document pagination best practices

---

## Phase 3: Feature Examples (Medium Priority, Medium Effort)

### AI Image Analysis Pattern

- [ ] Add `convex/ai.ts` with Gemini action example
- [ ] Multi-step upload component (`image-upload-dialog.tsx`)
- [ ] Document in AI_INTEGRATION.md

### Atomic Create+Action Pattern

- [ ] Document mutation pattern for entity + related action in single transaction
- [ ] Examples: e-commerce (order + items), social (post + notification)
- [ ] Add to ARCHITECTURE.md

### Internationalization (i18n)

- [ ] Add `use-translation.ts` hook pattern
- [ ] Create `locales/` folder with `en.json` / `hu.json` examples
- [ ] Document integration with `react-i18next` in OPTIONAL_FEATURES.md

### Stripe Payments (Working Example)

- [ ] Add `convex/subscriptions.ts` with subscription CRUD
- [ ] Add pricing page route example
- [ ] Webhook handler for subscription events
- [ ] `RequireSubscription` route guard

### Email with Resend (Working Example)

- [ ] Add `@convex-dev/resend` component integration
- [ ] Welcome email on registration
- [ ] Password reset flow example

### Dark Mode Toggle

- [ ] Theme toggle component (system / light / dark)
- [ ] Persist preference in localStorage
- [ ] Update globals.css with proper theme switching

### Full-Text Search

- [ ] Convex full-text search integration example
- [ ] Search UI component with debouncing
- [ ] Highlighting matched results
- [ ] Performance optimization tips

### Cloudflare Images Integration

- [ ] Image upload to Cloudflare Images
- [ ] Responsive image serving with variants
- [ ] Image optimization and CDN caching
- [ ] Replace file storage example with R2/Images

### Multiplayer / Real-time Collaboration

- [ ] Real-time cursor tracking pattern
- [ ] Collaborative editing example (whiteboard/document)
- [ ] Conflict-free replicated data types (CRDT) exploration
- [ ] Document sync with Convex subscriptions

---

## Phase 4: Advanced Patterns (Lower Priority, Higher Effort)

### Gamification Schema Pattern

- [ ] Points / badges / streaks schema example
- [ ] Leaderboard query with pagination
- [ ] Achievement unlock mutation

### Mobile App (Capacitor)

- [x] Capacitor integration guide — see [MOBILE.md](MOBILE.md)
- [ ] Working Capacitor example branch
- [ ] Push notification integration with Convex

### Real-time Notifications

- [ ] In-app notification system with Convex subscriptions
- [ ] Notification bell component with unread count
- [ ] Mark as read / dismiss mutations

### Multi-tenancy Pattern

- [ ] Organization/workspace schema example
- [ ] Scoped queries by organization
- [ ] Invite/join flow

### Webhooks System

- [ ] Incoming webhook handler in `convex/http.ts`
- [ ] Outgoing webhook dispatch on events
- [ ] Webhook verification (HMAC signatures)

### Background Jobs & Cron

- [ ] Convex scheduled functions examples
- [ ] Job queue pattern for heavy processing
- [ ] Cron job examples (daily cleanup, weekly reports)

### ShardedCounter for High-Write Fields

- [ ] Integrate `@convex-dev/sharded-counter` example
- [ ] Use for vote/like counts exceeding ~100 writes/sec

### Analytics Dashboard

- [ ] Basic analytics queries (active users, message count)
- [ ] Recharts integration example
- [ ] Admin-only analytics route

### Accessibility (WCAG Compliance)

- [ ] Audit checklist for WCAG 2.1 AA compliance
- [ ] ARIA labels and semantic HTML guidelines
- [ ] Keyboard navigation (focus management, tabindex)
- [ ] Color contrast and screen reader testing
- [ ] Add accessibility testing with axe-core

### Web Performance Monitoring

- [ ] Core Web Vitals tracking (CLS, LCP, FID)
- [ ] Sentry or LogRocket integration for performance
- [ ] Client-side timing instrumentation
- [ ] Performance budget & optimization guide

### Database Backup & Export

- [ ] Convex snapshot/export patterns
- [ ] Scheduled backup strategies
- [ ] Data migration and recovery documentation
- [ ] Example backup automation script

### Progressive Web App (PWA)

- [ ] Service worker setup for offline support
- [ ] Web manifest configuration
- [ ] Install prompt UX
- [ ] Offline-first data sync patterns

---

## Phase 5: DevOps & Infrastructure (Lower Priority)

### CI/CD Enhancements

- [ ] GitHub Actions workflow for PR checks (lint, typecheck, test)
- [ ] Automated preview deployments on PR
- [ ] Production deploy on merge to main

### Monitoring & Observability

- [ ] Cloudflare Analytics integration
- [ ] Convex function performance monitoring
- [ ] Uptime monitoring setup guide

### Load Testing

- [ ] k6 or Artillery load test scripts
- [ ] Performance benchmarks documentation
- [ ] Rate limit tuning guide based on load tests

### Custom Domains & SSL

- [ ] Cloudflare custom domain setup guide
- [ ] SSL/TLS configuration
- [ ] DNS records (CNAME, MX) documentation
- [ ] Production deployment checklist

### Disaster Recovery & Failover

- [ ] Multi-region deployment strategies
- [ ] Failover routing with Cloudflare
- [ ] Uptime monitoring automation
- [ ] Incident response playbook template

---

## Community Contributions Welcome

If you'd like to tackle any of these items, please:

1. Open an issue to discuss your approach
2. Reference this roadmap in your PR
3. Follow the guidelines in [CONTRIBUTING.md](CONTRIBUTING.md)

Items marked with higher priority are more impactful for template users. Lower priority items are "nice-to-have" enhancements.
