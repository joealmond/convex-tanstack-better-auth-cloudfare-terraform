import { query, mutation, type MutationCtx } from './_generated/server'
import { v } from 'convex/values'
import { requireAuth, requireAdmin } from './lib/authHelpers'
import { authComponent } from './auth'
import { rateLimiter } from './lib/services/rateLimitService'

// List all messages (public)
export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('messages').order('desc').take(50)
  },
})

// Send a new message (anyone can send, rate limited)
export const send = mutation({
  args: {
    content: v.string(),
  },
  handler: async (ctx: MutationCtx, args) => {
    // Content validation
    const trimmed = args.content.trim()
    if (trimmed.length === 0) throw new Error('Message cannot be empty')
    if (trimmed.length > 2000) throw new Error('Message too long (max 2000 characters)')

    // Get user if authenticated (but don't require it)
    let user = null
    try {
      user = await authComponent.getAuthUser(ctx)
    } catch {
      // Not authenticated, that's ok
    }

    // Rate limit: use user ID if authenticated, otherwise use a generic key
    const rateLimitKey = user?._id || 'anonymous'
    await rateLimiter.limit(ctx, 'sendMessage', { key: rateLimitKey })

    return await ctx.db.insert('messages', {
      content: trimmed,
      authorId: user?._id,
      authorName: user?.name ?? 'Anonymous',
    })
  },
})

// Delete own message (author only)
export const remove = mutation({
  args: {
    id: v.id('messages'),
  },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx)

    const message = await ctx.db.get(args.id)
    if (!message) {
      throw new Error('Message not found')
    }

    if (message.authorId !== user._id) {
      throw new Error('Not authorized to delete this message')
    }

    await ctx.db.delete(args.id)
  },
})

// Delete any message (admin only)
// Example of admin-only mutation using RBAC
export const deleteAny = mutation({
  args: {
    id: v.id('messages'),
  },
  handler: async (ctx, args) => {
    // Only admins can delete any message
    await requireAdmin(ctx)

    const message = await ctx.db.get(args.id)
    if (!message) {
      throw new Error('Message not found')
    }

    await ctx.db.delete(args.id)
  },
})
