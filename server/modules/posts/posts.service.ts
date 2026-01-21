import { eq, and, desc, ilike, sql, type SQL } from 'drizzle-orm'
import { getDb } from '../../database/client'
import { posts } from './posts.schema'
import type { Post, NewPost } from './posts.schema'

export type FindPostsOptions = {
  offset?: number
  limit?: number
  status?: 'draft' | 'published'
  authorId?: string
  search?: string
}

export class PostsService {
  /**
   * 查询文章列表
   */
  static async findAll(options: FindPostsOptions = {}) {
    const db = getDb()
    const { offset = 0, limit = 20, status, authorId, search } = options

    const conditions: SQL[] = []

    if (status) {
      conditions.push(eq(posts.status, status))
    }
    if (authorId) {
      conditions.push(eq(posts.authorId, authorId))
    }
    if (search) {
      conditions.push(ilike(posts.title, `%${search}%`))
    }

    const where = conditions.length > 0 ? and(...conditions) : undefined

    const [items, countResult] = await Promise.all([
      db.select().from(posts).where(where).orderBy(desc(posts.createdAt)).limit(limit).offset(offset),
      db.select({ count: sql<number>`count(*)` }).from(posts).where(where),
    ])

    return {
      items,
      total: Number(countResult[0]?.count || 0),
    }
  }

  /**
   * 根据 ID 查询文章
   */
  static async findById(id: string): Promise<Post | null> {
    const db = getDb()
    const [post] = await db.select().from(posts).where(eq(posts.id, id)).limit(1)
    return post || null
  }

  /**
   * 根据 Slug 查询文章
   */
  static async findBySlug(slug: string): Promise<Post | null> {
    const db = getDb()
    const [post] = await db.select().from(posts).where(eq(posts.slug, slug)).limit(1)
    return post || null
  }

  /**
   * 创建文章
   */
  static async create(data: Omit<NewPost, 'id' | 'createdAt' | 'updatedAt'>): Promise<Post> {
    const db = getDb()
    const [post] = await db.insert(posts).values(data).returning()
    return post
  }

  /**
   * 更新文章
   */
  static async update(id: string, data: Partial<NewPost>): Promise<Post | null> {
    const db = getDb()
    const [post] = await db
      .update(posts)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(posts.id, id))
      .returning()
    return post || null
  }

  /**
   * 删除文章
   */
  static async delete(id: string): Promise<boolean> {
    const db = getDb()
    const result = await db.delete(posts).where(eq(posts.id, id)).returning()
    return result.length > 0
  }

  /**
   * 增加阅读量
   */
  static async incrementViewCount(id: string): Promise<void> {
    const db = getDb()
    await db
      .update(posts)
      .set({ viewCount: sql`${posts.viewCount} + 1` })
      .where(eq(posts.id, id))
  }

  /**
   * 发布文章
   */
  static async publish(id: string): Promise<Post | null> {
    return this.update(id, {
      status: 'published',
      publishedAt: new Date(),
    })
  }
}
