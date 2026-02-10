/**
 * Factory Pattern Examples
 * =========================
 *
 * Create objects with consistent configuration and validation.
 *
 * Benefits:
 * - Consistent object creation
 * - DRY (Don't Repeat Yourself)
 * - Easy to extend with new query types
 *
 * Usage:
 * ```typescript
 * import { QueryFactory } from './lib/patterns/Factory'
 *
 * export const listMessages = query({
 *   handler: async (ctx, args) => {
 *     const factory = new QueryFactory(ctx, 'messages')
 *     return await factory.paginated({ limit: 50 })
 *   },
 * })
 * ```
 */

import type { QueryCtx, MutationCtx } from '../../_generated/server'
import type { TableNames, Doc } from '../../_generated/dataModel'

/**
 * Query Factory
 * Build consistent, reusable queries with common patterns
 */
export class QueryFactory<T extends TableNames> {
  constructor(
    private ctx: QueryCtx,
    private table: T
  ) {}

  /**
   * Create a paginated query
   */
  async paginated(options: {
    limit?: number
    cursor?: string
    orderBy?: 'asc' | 'desc'
    filter?: (q: any) => any
  }): Promise<{
    page: Doc<T>[]
    continueCursor: string | null
    isDone: boolean
  }> {
    const baseQuery = this.ctx.db.query(this.table)
    const orderedQuery = baseQuery.order(options.orderBy ?? 'desc')
    const filteredQuery = options.filter ? orderedQuery.filter(options.filter) : orderedQuery

    const result = await filteredQuery.paginate({
      numItems: options.limit ?? 20,
      cursor: options.cursor ?? null,
    })

    return {
      page: result.page,
      continueCursor: result.continueCursor,
      isDone: result.isDone,
    }
  }

  /**
   * Get recent items (last N days)
   */
  async recent(days: number = 7, limit: number = 50): Promise<Doc<T>[]> {
    const cutoffTime = Date.now() - days * 24 * 60 * 60 * 1000

    return await this.ctx.db
      .query(this.table)
      .filter((q) => q.gte(q.field('_creationTime'), cutoffTime))
      .order('desc')
      .take(limit)
  }

  /**
   * Get items in date range
   */
  async dateRange(startTime: number, endTime: number): Promise<Doc<T>[]> {
    return await this.ctx.db
      .query(this.table)
      .filter((q) =>
        q.and(q.gte(q.field('_creationTime'), startTime), q.lte(q.field('_creationTime'), endTime))
      )
      .collect()
  }

  /**
   * Search by field value
   */
  async searchByField(field: string, value: any, limit: number = 20): Promise<Doc<T>[]> {
    return await this.ctx.db
      .query(this.table)
      .filter((q) => q.eq(q.field(field as any), value))
      .take(limit)
  }

  /**
   * Get all with filter
   */
  async getAllWhere(filter: (q: any) => any): Promise<Doc<T>[]> {
    return await this.ctx.db.query(this.table).filter(filter).collect()
  }
}

/**
 * Validation Schema Factory
 * Create consistent validation schemas for common patterns
 */
import { v } from 'convex/values'
import type { ObjectType, PropertyValidators } from 'convex/values'

export class ValidationSchemaFactory {
  /** Email validation */
  static email() {
    return v.string() // Convex v.string(), use Zod for complex validation
  }

  /** Required string with min length */
  static requiredString(minLength: number = 1) {
    void minLength
    return v.string()
  }

  /** Positive number */
  static positiveNumber() {
    return v.number()
  }

  /** Optional field wrapper */
  static optional(schema: Parameters<typeof v.optional>[0]) {
    return v.optional(schema)
  }

  /** User creation schema */
  static userCreation() {
    return {
      name: this.requiredString(2),
      email: this.email(),
      role: v.optional(v.union(v.literal('user'), v.literal('admin'))),
    }
  }

  /** Message creation schema */
  static messageCreation() {
    return {
      content: this.requiredString(1),
      authorId: v.string(),
    }
  }

  /** File upload schema */
  static fileUpload() {
    return {
      storageId: v.id('_storage'),
      name: this.requiredString(1),
      type: this.requiredString(1),
      size: this.positiveNumber(),
    }
  }

  /** Pagination schema */
  static pagination() {
    return {
      limit: v.optional(v.number()),
      cursor: v.optional(v.string()),
    }
  }

  /** Date range schema */
  static dateRange() {
    return {
      startDate: v.number(),
      endDate: v.number(),
    }
  }
}

/**
 * Response Factory
 * Create consistent API responses
 */
export class ResponseFactory {
  /** Success response */
  static success<T>(data: T, message?: string) {
    return {
      success: true as const,
      data,
      message,
    }
  }

  /** Error response */
  static error(message: string, code?: string) {
    return {
      success: false as const,
      error: message,
      code,
    }
  }

  /** Paginated response */
  static paginated<T>(items: T[], cursor: string | null, totalCount?: number) {
    return {
      items,
      cursor,
      hasMore: cursor !== null,
      totalCount,
    }
  }

  /** List response */
  static list<T>(items: T[], totalCount?: number) {
    return {
      items,
      count: items.length,
      totalCount,
    }
  }
}

/**
 * Mutation Builder Factory
 * Create mutations with common patterns
 */
import { mutation } from '../../_generated/server'
import { requireAuth, requireAdmin, type AuthUser } from '../authHelpers'

export class MutationFactory {
  /**
   * Create a mutation with automatic auth check
   */
  static authenticated<Args extends PropertyValidators, Output>(
    args: Args,
    handler: (ctx: MutationCtx, args: ObjectType<Args>, user: AuthUser) => Promise<Output>
  ) {
    return mutation({
      args,
      handler: async (ctx, ...argsArray: [ObjectType<Args>]) => {
        const user = await requireAuth(ctx)
        const [args] = argsArray
        return await handler(ctx, args, user)
      },
    })
  }

  /**
   * Create a mutation with admin check
   */
  static adminOnly<Args extends PropertyValidators, Output>(
    args: Args,
    handler: (ctx: MutationCtx, args: ObjectType<Args>, user: AuthUser) => Promise<Output>
  ) {
    return mutation({
      args,
      handler: async (ctx, ...argsArray: [ObjectType<Args>]) => {
        const user = await requireAdmin(ctx)
        const [args] = argsArray
        return await handler(ctx, args, user)
      },
    })
  }
}

/**
 * Example Usage
 */

// Query with factory
export const examplePaginatedQuery = {
  handler: async (ctx: QueryCtx, args: { cursor?: string }) => {
    const factory = new QueryFactory(ctx, 'messages')
    return await factory.paginated({
      limit: 50,
      cursor: args.cursor,
      orderBy: 'desc',
    })
  },
}

// Validation with factory
import { mutation as convexMutation } from '../../_generated/server'

export const exampleCreateMessage = convexMutation({
  args: ValidationSchemaFactory.messageCreation(),
  handler: async (ctx, args) => {
    const messageId = await ctx.db.insert('messages', {
      ...args,
    })
    return ResponseFactory.success({ messageId }, 'Message created')
  },
})
