import { create } from 'zustand'
import { fileAPI } from '../api/client'

export const useStore = create((set) => ({
  // 认证相关
  token: localStorage.getItem('rawbox_token') || '',
  setToken: (token) => {
    localStorage.setItem('rawbox_token', token)
    set({ token })
  },
  clearToken: () => {
    localStorage.removeItem('rawbox_token')
    set({ token: '' })
  },

  // 浏览相关
  currentPath: '/',
  setCurrentPath: (path) => set({ currentPath: path }),

  files: [],
  setFiles: (files) => set({ files }),

  loading: false,
  setLoading: (loading) => set({ loading }),

  error: null,
  setError: (error) => set({ error }),

  // 统计相关
  stats: null,
  setStats: (stats) => set({ stats }),

  // 异步操作
  fetchBrowse: async (path, token) => {
    set({ loading: true, error: null })
    try {
      const response = await fileAPI.browse(path, token)
      set({ files: response.data.items || [], currentPath: path, loading: false })
      return response.data
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.message
      set({ error: errorMsg, loading: false })
      throw error
    }
  },

  fetchFileInfo: async (path, token) => {
    try {
      const response = await fileAPI.fileInfo(path, token)
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  fetchStats: async (token, startDate, endDate) => {
    set({ loading: true, error: null })
    try {
      const response = await fileAPI.stats(token, startDate, endDate)
      set({ stats: response.data, loading: false })
      return response.data
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.message
      set({ error: errorMsg, loading: false })
      throw error
    }
  },
}))
