import { pgTable, uuid, varchar, text, timestamp, integer } from 'drizzle-orm/pg-core'
import { profiles } from '../users/users.schema'

// 媒体文件表
export const media = pgTable('media', {
  id: uuid('id').primaryKey().defaultRandom(),
  filename: varchar('filename', { length: 255 }).notNull(),
  originalName: varchar('original_name', { length: 255 }),
  path: text('path').notNull(), // 相对路径
  mimeType: varchar('mime_type', { length: 100 }),
  size: integer('size'), // bytes
  width: integer('width'),
  height: integer('height'),
  altText: varchar('alt_text', { length: 255 }),
  uploadedBy: uuid('uploaded_by').references(() => profiles.id),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
})

export type Media = typeof media.$inferSelect
export type NewMedia = typeof media.$inferInsert
