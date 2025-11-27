/**
 * 重试机制
 */

import { TimeoutError, NetworkError } from './errors'

export const withRetry = async (
  fn,
  options = {}
) => {
  const {
    maxAttempts = 3,
    delayMs = 1000,
    backoffMultiplier = 2,
    shouldRetry = (error) => error instanceof NetworkError || error instanceof TimeoutError
  } = options

  let lastError
  let delay = delayMs

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error

      // 检查是否应该重试
      if (!shouldRetry(error) || attempt === maxAttempts) {
        throw error
      }

      // 等待后重试
      await new Promise(resolve => setTimeout(resolve, delay))
      delay *= backoffMultiplier
    }
  }

  throw lastError
}
