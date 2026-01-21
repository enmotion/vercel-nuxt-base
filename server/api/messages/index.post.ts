import { MessagesService } from '../../modules/messages/messages.service'
import { success, error } from '../../utils/response'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const headers = getHeaders(event)
    
    const message = await MessagesService.create({
      name: body.name,
      email: body.email,
      subject: body.subject,
      content: body.content,
      ipAddress: headers['x-forwarded-for'] || headers['x-real-ip'] || '',
      userAgent: headers['user-agent'] || '',
      locale: body.locale,
      isRead: false,
    })
    
    return success(message, '留言提交成功')
  } catch (err: any) {
    console.error('Failed to create message:', err)
    return error(err.message || 'Failed to create message', 500)
  }
})
