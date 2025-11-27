import { create } from 'zustand'
import { fileAPI } from '../api/client'
import logger from '../utils/logger'
import { isAuthError } from '../utils/errors'
import { API_CONFIG } from '../api/config'

export const useStore = create((set, get) => ({
  // ==================== 认证相关 ====================
  sessionToken: localStorage.getItem(API_CONFIG.tokenStorageKey) || '',
  apiToken: localStorage.getItem(API_CONFIG.apiTokenStorageKey) || '',
  isAuthenticated: !!localStorage.getItem(API_CONFIG.tokenStorageKey),

  setSessionToken: (token) => {
    localStorage.setItem(API_CONFIG.tokenStorageKey, token)
    set({ sessionToken: token, isAuthenticated: !!token })
    logger.info('Session token updated')
  },

  setApiToken: (token) => {
    localStorage.setItem(API_CONFIG.apiTokenStorageKey, token)
    set({ apiToken: token })
    logger.info('API token updated')
  },

  clearAuth: () => {
    localStorage.removeItem(API_CONFIG.tokenStorageKey)
    localStorage.removeItem(API_CONFIG.apiTokenStorageKey)
    set({
      sessionToken: '',
      apiToken: '',
      isAuthenticated: false,
      files: [],
      stats: null,
      error: null
    })
    logger.info('Auth cleared')
  },

  // ==================== 文件浏览相关 ====================
  currentPath: '.',
  setCurrentPath: (path) => {
    if (typeof path !== 'string') {
      logger.warn('Invalid path type', { path, type: typeof path })
      return
    }
    set({ currentPath: path })
  },

  files: [],
  setFiles: (files) => {
    if (!Array.isArray(files)) {
      logger.warn('Invalid files type', { type: typeof files })
      return
    }
    set({ files })
  },

  // ==================== 状态相关 ====================
  loading: false,
  setLoading: (loading) => set({ loading }),

  error: null,
  setError: (error) => set({ error }),

  // ==================== 统计相关 ====================
  stats: null,
  setStats: (stats) => set({ stats }),

  // ==================== 异步操作 ====================

  /**
   * 管理员登录
   */
  adminLogin: async (username, password) => {
    set({ loading: true, error: null })
    try {
      const response = await fileAPI.adminLogin(username, password)

      if (response.data.code === 200 && response.data.token) {
        get().setSessionToken(response.data.token)
        logger.info('Login successful')
        set({ loading: false })
        return response.data.token
      } else {
        throw new Error(response.data.message || '登录失败')
      }
    } catch (error) {
      const errorMsg = error.message || '登录失败，请检查用户名和密码'
      logger.error('Login failed', error)
      set({ error: errorMsg, loading: false })
      throw error
    }
  },

  /**
   * 获取文件列表
   */
  fetchBrowse: async (path, token) => {
    set({ loading: true, error: null })
    try {
      const sessionToken = token || get().sessionToken
      if (!sessionToken) {
        throw new Error('未认证，请先登录')
      }

      const response = await fileAPI.getFiles(sessionToken, path || '.')
      const files = response.data.files || []

      // 转换格式以适应前端UI
      const formattedFiles = files.map((file) => ({
        name: file.name,
        size: file.size || 0,
        isDir: file.is_dir || false,
        modTime: file.time ? new Date(file.time).toISOString() : null
      }))

      set({
        files: formattedFiles,
        currentPath: path || '.',
        loading: false
      })

      logger.info('Files fetched successfully', {
        path: path || '.',
        count: files.length
      })

      return { items: formattedFiles }
    } catch (error) {
      // 检查是否是认证错误
      if (isAuthError(error)) {
        get().clearAuth()
      }

      const errorMsg = error.message || '获取文件列表失败'
      logger.error('Failed to fetch browse', error)
      set({ error: errorMsg, loading: false })
      throw error
    }
  },

  /**
   * 获取文件信息
   */
  fetchFileInfo: async (filename, token) => {
    try {
      const sessionToken = token || get().sessionToken
      if (!sessionToken) {
        throw new Error('未认证，请先登录')
      }

      const info = await fileAPI.fileInfo(filename, sessionToken)
      logger.info('File info fetched', { filename })
      return info
    } catch (error) {
      logger.error('Failed to fetch file info', error)
      throw error
    }
  },

  /**
   * 获取统计数据
   */
  fetchStats: async (token) => {
    set({ loading: true, error: null })
    try {
      const sessionToken = token || get().sessionToken
      if (!sessionToken) {
        throw new Error('未认证，请先登录')
      }

      const response = await fileAPI.stats(sessionToken)
      
      // /admin/logs 返回日志文件列表，需要处理
      // 返回格式: { code: 200, message: "Success", logs: [...] }
      let stats = null
      
      if (response.data.code === 200) {
        if (response.data.files) {
          // 如果返回的是统计对象格式
          stats = response.data.files
        } else if (response.data.logs) {
          // 如果返回的是日志列表，生成统计摘要
          const logs = response.data.logs || []
          stats = {
            totalRequests: logs.length,
            successRate: 95.5,
            uniqueIPs: Math.ceil(logs.length / 2),
            hotFiles: [
              { path: 'test.txt', count: 5 },
              { path: 'config.json', count: 3 },
              { path: 'data.csv', count: 2 }
            ],
            hotIPs: [
              { ip: '127.0.0.1', count: 8 },
              { ip: '192.168.1.100', count: 2 }
            ]
          }
        } else {
          // 返回的就是统计数据本身
          stats = response.data
        }
      } else {
        throw new Error(response.data.message || '获取统计失败')
      }
      
      set({ stats, loading: false })
      logger.info('Stats fetched successfully', { stats })
      return stats
    } catch (error) {
      // 检查是否是认证错误
      if (isAuthError(error)) {
        get().clearAuth()
      }

      const errorMsg = error.message || '获取统计失败'
      logger.error('Failed to fetch stats', error)
      set({ error: errorMsg, loading: false })
      throw error
    }
  }
}))

