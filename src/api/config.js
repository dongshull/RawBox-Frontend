/**
 * API 配置
 */

export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:18080',
  timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '30000'),
  maxRetries: parseInt(import.meta.env.VITE_MAX_RETRIES || '3'),
  tokenStorageKey: import.meta.env.VITE_TOKEN_STORAGE_KEY || 'rawbox_session_token',
  apiTokenStorageKey: import.meta.env.VITE_API_TOKEN_STORAGE_KEY || 'rawbox_api_token',
  
  // 认证相关
  loginEndpoint: '/admin/login',
  filesEndpoint: '/admin/files',
  logsEndpoint: '/admin/logs',
  
  // HTTP 方法
  methods: {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    DELETE: 'DELETE'
  },
  
  // 状态码
  statusCodes: {
    OK: 200,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    SERVER_ERROR: 500
  },
  
  // 错误信息映射
  errorMessages: {
    401: '会话已过期，请重新登录',
    403: '无权限访问该资源',
    404: '请求的资源不存在',
    500: '服务器错误，请稍后重试',
    NETWORK_ERROR: '网络连接失败',
    TIMEOUT: '请求超时'
  }
}
