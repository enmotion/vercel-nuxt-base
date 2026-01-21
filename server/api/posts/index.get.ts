import { PostsService } from '../../modules/posts/posts.service'
import { success, error } from '../../utils/response'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    
    const options = {
      offset: Number(query.offset) || 0,
      limit: Math.min(Number(query.limit) || 20, 100),
      status: query.status as 'draft' | 'published' | undefined,
      search: query.search as string | undefined,
    }

    const result = await PostsService.findAll(options)
    
    return success(result)
  } catch (err: any) {
    console.error('Failed to fetch posts:', err)
    return error(err.message || 'Failed to fetch posts', 500)
  }
})
