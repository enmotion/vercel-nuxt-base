import { PostsService } from '../../modules/posts/posts.service'
import { success, notFound, error } from '../../utils/response'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    
    if (!id) {
      return notFound('文章 ID 不能为空')
    }
    
    const result = await PostsService.delete(id)
    
    if (!result) {
      return notFound('文章不存在或已被删除')
    }
    
    return success(null, '文章删除成功')
  } catch (err: any) {
    console.error('Failed to delete post:', err)
    return error(err.message || 'Failed to delete post', 500)
  }
})
