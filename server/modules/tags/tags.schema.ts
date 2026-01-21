import { pgTable, uuid, varchar, timestamp } from 'drizzle-orm/pg-core'

// 标签表
export const tags = pgTable('tags', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 50 }).notNull(),
  slug: varchar('slug', { length: 50 }).unique().notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
})

export type Tag = typeof tags.$inferSelect
export type NewTag = typeof tags.$inferInsert
