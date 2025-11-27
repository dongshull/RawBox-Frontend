import axios from 'axios'
import logger from '../utils/logger'
import {
  APIError,
  ValidationError,
  isAuthError,
  isValidationError,
  isNetworkError
} from '../utils/errors'
import { withRetry } from '../utils/retry'
import { API_CONFIG } from './config'

/**
 * 创建 axios 实例
 */
const api = axios.create({
  timeout: API_CONFIG.timeout,
  headers: {
    'Content-Type': 'application/json'
  }
})

/**
 * 请求拦截器
 * - 自动添加 session token
 * - 记录请求日志
 */
api.interceptors.request.use(
  (config) => {
    const sessionToken = localStorage.getItem(API_CONFIG.tokenStorageKey)
    if (sessionToken) {
      config.headers['X-Session-Token'] = sessionToken
    }

    logger.debug(`[${config.method.toUpperCase()}] ${config.url}`, {
      params: config.params,
      data: config.data
    })

    return config
  },
  (error) => {
    logger.error('Request interceptor error', error)
    return Promise.reject(error)
  }
)

/**
 * 响应拦截器
 * - 统一错误处理
 * - 自动处理认证过期
 * - 记录响应日志
 */
api.interceptors.response.use(
  (response) => {
    logger.debug(`Response [${response.status}]`, {
      url: response.config.url,
      data: response.data
    })
    return response
  },
  (error) => {
    // 网络错误
    if (!error.response) {
      logger.error('Network error', error.message)
      return Promise.reject(error)
    }

    const { status, data, config } = error.response
    const message = data?.message || API_CONFIG.errorMessages[status] || '请求失败'

    // 认证失败 - 清除 token 并提示重新登录
    if (isAuthError(error)) {
      logger.warn('Authentication failed, clearing token')
      localStorage.removeItem(API_CONFIG.tokenStorageKey)
      window.dispatchEvent(new CustomEvent('auth-error', { detail: message }))
    }

    logger.error(`Response error [${status}]`, {
      url: config.url,
      message,
      data
    })

    return Promise.reject(
      new APIError(data?.code || status, message, status, data)
    )
  }
)

/**
 * API 客户端
 */
export const fileAPI = {
  /**
   * 管理员登录
   */
  adminLogin: async (username, password) => {
    if (!username || !password) {
      throw new ValidationError('用户名和密码不能为空')
    }

    return withRetry(
      () =>
        api.post(API_CONFIG.loginEndpoint, {
          username: username.trim(),
          password
        }),
      {
        maxAttempts: 2,
        shouldRetry: isNetworkError
      }
    )
  },

  /**
   * 获取文件列表
   */
  getFiles: async (sessionToken, dir = '.') => {
    if (!sessionToken) {
      throw new ValidationError('Session token is required')
    }

    if (!dir || typeof dir !== 'string') {
      throw new ValidationError('Invalid directory path')
    }

    return withRetry(
      () =>
        api.get(API_CONFIG.filesEndpoint, {
          params: { dir }
        }),
      {
        maxAttempts: API_CONFIG.maxRetries
      }
    )
  },

  /**
   * 获取文件信息
   */
  fileInfo: async (filename, sessionToken) => {
    if (!filename) {
      throw new ValidationError('Filename is required')
    }

    const response = await fileAPI.getFiles(sessionToken, '.')
    const file = response.data.files?.find((f) => f.name === filename)

    if (!file) {
      throw new APIError(404, `File not found: ${filename}`)
    }

    return file
  },

  /**
   * 获取统计数据
   */
  stats: async (sessionToken) => {
    if (!sessionToken) {
      throw new ValidationError('Session token is required')
    }

    return withRetry(
      () => api.get(API_CONFIG.logsEndpoint),
      {
        maxAttempts: API_CONFIG.maxRetries
      }
    )
  },

  /**
   * 下载文件
   */
  download: (path, apiToken = null) => {
    if (!path) {
      throw new ValidationError('File path is required')
    }

    const params = {}
    if (apiToken) {
      params.api = apiToken
    }

    const queryString = new URLSearchParams(params).toString()
    return `/${path}${queryString ? '?' + queryString : ''}`
  },

  /**
   * 获取日志
   */
  logs: async (sessionToken, file = null) => {
    if (!sessionToken) {
      throw new ValidationError('Session token is required')
    }

    const params = {}
    if (file) {
      params.file = file
    }

    return withRetry(
      () =>
        api.get(API_CONFIG.logsEndpoint, {
          params
        }),
      {
        maxAttempts: API_CONFIG.maxRetries
      }
    )
  }
}

export default api
