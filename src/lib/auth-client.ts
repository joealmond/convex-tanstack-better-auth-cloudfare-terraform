import { createAuthClient } from 'better-auth/react'
import { convexClient } from '@convex-dev/better-auth/client/plugins'

// The convexClient() plugin routes auth requests through the Convex
// infrastructure (WebSocket/HTTP), avoiding CORS issues entirely.
// No baseURL needed — the plugin handles routing internally.
export const authClient = createAuthClient({
  plugins: [convexClient()],
})

// Export commonly used hooks and utilities
export const { signIn, signOut, useSession } = authClient
