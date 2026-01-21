import { eq, desc, sql } from 'drizzle-orm'
import { getDb } from '../../database/client'
import { messages } from './messages.schema'
import type { Message, NewMessage } from './messages.schema'

export class MessagesService {
  /**
   * 查询留言列表
   */
  static async findAll(options: { offset?: number; limit?: number; isRead?: boolean } = {}) {
    const db = getDb()
    const { offset = 0, limit = 20, isRead } = options

    const where = isRead !== undefined ? eq(messages.isRead, isRead) : undefined

    const [items, countResult] = await Promise.all([
      db.select().from(messages).where(where).orderBy(desc(messages.createdAt)).limit(limit).offset(offset),
      db.select({ count: sql<number>`count(*)` }).from(messages).where(where),
    ])

    return {
      items,
      total: Number(countResult[0]?.count || 0),
    }
  }

  /**
   * 根据 ID 查询留言
   */
  static async findById(id: string): Promise<Message | null> {
    const db = getDb()
    const [message] = await db.select().from(messages).where(eq(messages.id, id)).limit(1)
    return message || null
  }

  /**
   * 创建留言
   */
  static async create(data: Omit<NewMessage, 'id' | 'createdAt'>): Promise<Message> {
    const db = getDb()
    const [message] = await db.insert(messages).values(data).returning()
    return message
  }

  /**
   * 标记为已读
   */
  static async markAsRead(id: string): Promise<Message | null> {
    const db = getDb()
    const [message] = await db
      .update(messages)
      .set({ isRead: true, readAt: new Date() })
      .where(eq(messages.id, id))
      .returning()
    return message || null
  }

  /**
   * 删除留言
   */
  static async delete(id: string): Promise<boolean> {
    const db = getDb()
    const result = await db.delete(messages).where(eq(messages.id, id)).returning()
    return result.length > 0
  }

  /**
   * 获取未读数量
   */
  static async getUnreadCount(): Promise<number> {
    const db = getDb()
    const [result] = await db
      .select({ count: sql<number>`count(*)` })
      .from(messages)
      .where(eq(messages.isRead, false))
    return Number(result?.count || 0)
  }
}
