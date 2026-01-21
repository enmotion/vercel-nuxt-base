// 统一 API 响应类型
export interface ApiResponse<T = any> {
  code: number
  data?: T
  msg: string
}

// 成功响应
export function success<T>(data: T, msg = '操作成功'): ApiResponse<T> {
  return {
    code: 200,
    data,
    msg,
  }
}

// 错误响应
export function error(msg: string, code = 400): ApiResponse {
  return {
    code,
    msg,
  }
}

// 未授权
export function unauthorized(msg = '请先登录'): ApiResponse {
  return {
    code: 401,
    msg,
  }
}

// 禁止访问
export function forbidden(msg = '无权访问'): ApiResponse {
  return {
    code: 403,
    msg,
  }
}

// 未找到
export function notFound(msg = '资源不存在'): ApiResponse {
  return {
    code: 404,
    msg,
  }
}
