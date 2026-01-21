import { PostsService } from '../../modules/posts/posts.service'
import { success, notFound, error } from '../../utils/response'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    
    if (!id) {
      return notFound('文章 ID 不能为空')
    }
    
    const post = await PostsService.findById(id)
    
    if (!post) {
      return notFound('文章不存在')
    }
    
    return success(post)
  } catch (err: any) {
    console.error('Failed to fetch post:', err)
    return error(err.message || 'Failed to fetch post', 500)
  }
})
