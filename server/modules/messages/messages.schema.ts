import { pgTable, uuid, varchar, text, timestamp, boolean } from 'drizzle-orm/pg-core'

// 留言表
export const messages = pgTable('messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  subject: varchar('subject', { length: 200 }),
  content: text('content').notNull(),
  isRead: boolean('is_read').default(false),
  ipAddress: varchar('ip_address', { length: 45 }),
  userAgent: text('user_agent'),
  locale: varchar('locale', { length: 10 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  readAt: timestamp('read_at', { withTimezone: true }),
})

export type Message = typeof messages.$inferSelect
export type NewMessage = typeof messages.$inferInsert
