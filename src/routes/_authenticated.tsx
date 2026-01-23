import { createFileRoute, redirect, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async () => {
    // Example: Check auth from localStorage, cookie, or async auth check
    // This is a placeholder - integrate with your actual auth system
    //
    // For Better Auth with Convex, you might:
    // 1. Check a cookie/session on the client
    // 2. Make a quick auth check API call
    //
    // Since we can't access Convex hooks in beforeLoad, you'd typically
    // check a session token here or redirect unconditionally and let
    // the component handle the auth check.
    //
    // For now, this just demonstrates the pattern:
    const isAuthenticated = typeof window !== 'undefined'
      && document.cookie.includes('better-auth')

    if (!isAuthenticated) {
      // Redirect to home page (update to your login route when created)
      throw redirect({ to: '/' })
    }
  },
  component: AuthenticatedLayout,
})

function AuthenticatedLayout() {
  return <Outlet />
}
