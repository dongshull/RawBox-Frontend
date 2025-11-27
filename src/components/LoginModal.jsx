import React from 'react'
import { useStore } from '../store'
import { Lock, Unlock } from 'lucide-react'

export default function LoginModal({ isOpen, onClose }) {
  const [username, setUsername] = React.useState('admin')
  const [password, setPassword] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)
  const { adminLogin, fetchBrowse, loading: storeLoading } = useStore()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      // 管理员登录
      const token = await adminLogin(username, password)
      // 登录成功后加载文件列表
      await fetchBrowse('.', token)
      onClose()
    } catch (error) {
      alert('登录失败: ' + error.message)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 transform transition-all">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">欢迎使用 RawBox</h2>
          <p className="text-gray-600 mt-2">文件共享服务</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 用户名输入 */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              用户名
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="输入用户名"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            />
          </div>

          {/* 密码输入 */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              密码
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="输入密码"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            />
          </div>

          {/* 提交按钮 */}
          <button
            type="submit"
            disabled={isLoading || storeLoading}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-lg font-medium hover:shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading || storeLoading ? '登录中...' : '登录'}
          </button>
        </form>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-900">
            💡 提示: 请输入管理员用户名和密码登录。
          </p>
        </div>
      </div>
    </div>
  )
}

