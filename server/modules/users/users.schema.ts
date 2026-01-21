import { pgTable, uuid, varchar, text, timestamp, boolean } from 'drizzle-orm/pg-core'

// 用户档案表 (扩展 Supabase Auth 用户)
export const profiles = pgTable('profiles', {
  id: uuid('id').primaryKey(), // 关联 Supabase auth.users.id
  username: varchar('username', { length: 50 }).unique(),
  displayName: varchar('display_name', { length: 100 }),
  avatarUrl: text('avatar_url'),
  bio: text('bio'),
  role: varchar('role', { length: 20 }).default('user'), // admin, editor, user
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
})

export type Profile = typeof profiles.$inferSelect
export type NewProfile = typeof profiles.$inferInsert
