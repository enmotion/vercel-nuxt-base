import { PostsService } from '../../modules/posts/posts.service'
import { success, error } from '../../utils/response'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    
    // TODO: 获取当前用户 ID
    const userId = null
    
    const post = await PostsService.create({
      title: body.title,
      slug: body.slug,
      content: body.content,
      excerpt: body.excerpt,
      coverImage: body.coverImage,
      status: body.status || 'draft',
      authorId: userId,
      metaTitle: body.metaTitle,
      metaDescription: body.metaDescription,
      publishedAt: body.status === 'published' ? new Date() : null,
    })
    
    return success(post, '文章创建成功')
  } catch (err: any) {
    console.error('Failed to create post:', err)
    return error(err.message || 'Failed to create post', 500)
  }
})
