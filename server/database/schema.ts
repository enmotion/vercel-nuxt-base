// 聚合导出所有 Schema 表定义
// 每个模块的 schema 在各自的模块目录中定义

// 用户
export { profiles } from '../modules/users/users.schema'
export type { Profile, NewProfile } from '../modules/users/users.schema'

// 文章
export { posts, postsRelations } from '../modules/posts/posts.schema'
export type { Post, NewPost } from '../modules/posts/posts.schema'

// 分类
export { categories } from '../modules/categories/categories.schema'
export type { Category, NewCategory } from '../modules/categories/categories.schema'

// 标签
export { tags } from '../modules/tags/tags.schema'
export type { Tag, NewTag } from '../modules/tags/tags.schema'

// 留言
export { messages } from '../modules/messages/messages.schema'
export type { Message, NewMessage } from '../modules/messages/messages.schema'

// 媒体
export { media } from '../modules/media/media.schema'
export type { Media, NewMedia } from '../modules/media/media.schema'

// 设置
export { settings } from '../modules/settings/settings.schema'
export type { Setting, NewSetting } from '../modules/settings/settings.schema'
