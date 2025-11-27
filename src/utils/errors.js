/**
 * 自定义错误类
 */

export class APIError extends Error {
  constructor(code, message, status = null, data = null) {
    super(message)
    this.name = 'APIError'
    this.code = code
    this.status = status
    this.data = data
  }
}

export class ValidationError extends Error {
  constructor(message, field = null) {
    super(message)
    this.name = 'ValidationError'
    this.field = field
  }
}

export class NetworkError extends Error {
  constructor(message) {
    super(message)
    this.name = 'NetworkError'
  }
}

export class TimeoutError extends Error {
  constructor(message = 'Request timeout') {
    super(message)
    this.name = 'TimeoutError'
  }
}

export const isNetworkError = (error) => {
  return error?.response?.status >= 500 || error?.code === 'ECONNABORTED'
}

export const isAuthError = (error) => {
  return error?.response?.status === 401
}

export const isValidationError = (error) => {
  return error?.response?.status === 400
}
