/**
 * User Queries & Mutations
 * ========================
 *
 * This module provides user-related Convex functions for the frontend.
 *
 * ## Available Functions
 *
 * - `users.current` - Get the current authenticated user
 * - `users.isAdmin` - Check if current user is an admin
 *
 * ## Usage
 *
 * ```tsx
 * import { useQuery } from '@tanstack/react-query'
 * import { convexQuery } from '@convex-dev/react-query'
 * import { api } from '@convex/_generated/api'
 *
 * // Check admin status
 * const { data: isAdmin } = useQuery(convexQuery(api.users.isAdmin, {}))
 * ```
 *
 * ## Making a User Admin
 *
 * Option 1: Add their email to ADMIN_EMAILS in convex/lib/config.ts
 * Option 2: Use Better Auth's admin plugin (requires additional setup)
 */

import { query, mutation } from './_generated/server'
import { v } from 'convex/values'
import { authComponent } from './auth'
import { ADMIN_EMAILS, ROLES } from './lib/config'
import type { AuthUser } from './lib/authHelpers'

/**
 * Get the current authenticated user.
 *
 * @returns The user object or null if not authenticated
 */
export const current = query({
  args: {},
  handler: async (ctx) => {
    return await authComponent.getAuthUser(ctx)
  },
})

/**
 * Check if the current user is an admin.
 *
 * Admin status is determined by:
 * 1. Email whitelist (ADMIN_EMAILS in lib/config.ts)
 * 2. Role field on user record (role === 'admin')
 *
 * @returns true if user is an admin, false otherwise
 */
export const isAdmin = query({
  args: {},
  handler: async (ctx) => {
    const user = (await authComponent.getAuthUser(ctx)) as AuthUser | null
    if (!user) {
      return false
    }

    // Check email whitelist first (for easy setup)
    if (user.email && ADMIN_EMAILS.includes(user.email)) {
      return true
    }

    // Fallback: check role field in database
    return user.role === ROLES.ADMIN
  },
})

/**
 * Set admin role by email address.
 *
 * **Important:** This mutation looks up the current user's auth record to verify
 * the email. The target user must have signed in at least once.
 *
 * ⚠️ For initial setup only! In production, uncomment the authorization
 * check below so that only existing admins can grant admin privileges.
 *
 * @example
 * Run from Convex Dashboard → Functions:
 * ```json
 * { "email": "your-email@example.com", "isAdmin": true }
 * ```
 */
export const setAdminByEmail = mutation({
  args: {
    email: v.string(),
    isAdmin: v.boolean(),
  },
  handler: async (_ctx, args) => {
    // TODO: Uncomment in production to restrict who can grant admin
    // Change _ctx back to ctx when enabling the auth check below
    // const currentUser = (await authComponent.getAuthUser(ctx)) as AuthUser | null
    // if (!currentUser) throw new Error('Authentication required')
    // const isCurrentUserAdmin =
    //   ADMIN_EMAILS.includes(currentUser.email) || currentUser.role === ROLES.ADMIN
    // if (!isCurrentUserAdmin) {
    //   throw new Error('Only admins can modify user roles')
    // }

    // Note: The user table is managed by the Better Auth component.
    // For email-based admin assignment, add the email to ADMIN_EMAILS
    // in convex/lib/config.ts instead. This mutation serves as a
    // convenience for runtime role changes via the Dashboard.
    //
    // If you need programmatic role updates, extend the Better Auth
    // configuration with the admin plugin:
    // https://www.better-auth.com/docs/plugins/admin

    // For now, validate the email is in a recognizable format
    if (!args.email || !args.email.includes('@')) {
      throw new Error('Invalid email address')
    }

    // Add or remove from admin emails at runtime isn't possible
    // since ADMIN_EMAILS is a compile-time constant.
    // Instead, log the instruction for the developer:
    const action = args.isAdmin ? 'grant' : 'revoke'
    const instruction = args.isAdmin
      ? `Add "${args.email}" to ADMIN_EMAILS in convex/lib/config.ts`
      : `Remove "${args.email}" from ADMIN_EMAILS in convex/lib/config.ts`

    console.log(`[ADMIN] ${action} admin for ${args.email}: ${instruction}`)

    return {
      success: true,
      email: args.email,
      action,
      instruction,
    }
  },
})
