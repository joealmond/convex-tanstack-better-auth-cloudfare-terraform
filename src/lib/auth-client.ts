import { createAuthClient } from 'better-auth/react'
import { convexClient } from '@convex-dev/better-auth/client/plugins'
import { env } from './env'

// Compute the Convex site URL for auth endpoints
const convexSiteUrl = env.VITE_CONVEX_SITE_URL ?? env.VITE_CONVEX_URL.replace('.cloud', '.site')

export const authClient = createAuthClient({
  baseURL: convexSiteUrl,
  plugins: [convexClient()],
})

// Export commonly used hooks and utilities
export const {
  signIn,
  signOut,
  useSession,
} = authClient
