import { MessagesService } from '../../modules/messages/messages.service'
import { success, error } from '../../utils/response'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    
    const options = {
      offset: Number(query.offset) || 0,
      limit: Math.min(Number(query.limit) || 20, 100),
      isRead: query.isRead === 'true' ? true : query.isRead === 'false' ? false : undefined,
    }

    const result = await MessagesService.findAll(options)
    
    return success(result)
  } catch (err: any) {
    console.error('Failed to fetch messages:', err)
    return error(err.message || 'Failed to fetch messages', 500)
  }
})
