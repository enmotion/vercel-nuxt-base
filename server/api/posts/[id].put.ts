import { PostsService } from '../../modules/posts/posts.service'
import { success, notFound, error } from '../../utils/response'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    const body = await readBody(event)
    
    if (!id) {
      return notFound('文章 ID 不能为空')
    }
    
    // 检查文章是否存在
    const existingPost = await PostsService.findById(id)
    if (!existingPost) {
      return notFound('文章不存在')
    }
    
    // 更新文章
    const updatedPost = await PostsService.update(id, {
      ...body,
      // 如果状态从 draft 变为 published，且原来没有发布时间，则设置发布时间
      publishedAt: body.status === 'published' && !existingPost.publishedAt 
        ? new Date() 
        : (body.publishedAt || existingPost.publishedAt)
    })
    
    return success(updatedPost, '文章更新成功')
  } catch (err: any) {
    console.error('Failed to update post:', err)
    return error(err.message || 'Failed to update post', 500)
  }
})
