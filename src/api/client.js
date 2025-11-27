import axios from 'axios'

const API_BASE = 'http://localhost:8888'

const api = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
})

export const fileAPI = {
  // 目录浏览
  browse: (path = '/', token = null) => {
    const params = { path }
    if (token) params.token = token
    return api.get('/api/browse', { params })
  },

  // 获取文件信息
  fileInfo: (path, token = null) => {
    const params = { path }
    if (token) params.token = token
    return api.get('/api/file-info', { params })
  },

  // 获取统计数据
  stats: (token, startDate = null, endDate = null) => {
    const params = {}
    if (startDate) params.start = startDate
    if (endDate) params.end = endDate
    return api.get('/api/stats', {
      params,
      headers: { 'X-API-Token': token }
    })
  },

  // 获取文件内容（下载）
  download: (path, token = null) => {
    const params = {}
    if (token) params.token = token
    return `${API_BASE}/${path}${new URLSearchParams(params).toString() ? '?' + new URLSearchParams(params) : ''}`
  },

  // 查看日志
  logs: (token, date = null) => {
    const params = {}
    if (date) params.date = date
    return api.get('/log', {
      params,
      headers: { 'X-API-Token': token }
    })
  }
}

export default api
