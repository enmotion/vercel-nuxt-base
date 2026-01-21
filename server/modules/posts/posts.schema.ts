import { pgTable, uuid, varchar, text, timestamp, integer } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { profiles } from '../users/users.schema'

// 文章表
export const posts = pgTable('posts', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 200 }).notNull(),
  slug: varchar('slug', { length: 200 }).unique().notNull(),
  content: text('content'),
  excerpt: text('excerpt'),
  coverImage: text('cover_image'),
  status: varchar('status', { length: 20 }).default('draft'), // draft, published, scheduled
  publishedAt: timestamp('published_at', { withTimezone: true }),
  authorId: uuid('author_id').references(() => profiles.id),
  metaTitle: varchar('meta_title', { length: 200 }),
  metaDescription: text('meta_description'),
  metaKeywords: text('meta_keywords'),
  viewCount: integer('view_count').default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
})

// 关系定义
export const postsRelations = relations(posts, ({ one }) => ({
  author: one(profiles, {
    fields: [posts.authorId],
    references: [profiles.id],
  }),
}))

export type Post = typeof posts.$inferSelect
export type NewPost = typeof posts.$inferInsert
