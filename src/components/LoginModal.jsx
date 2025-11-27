import React from 'react'
import { useStore } from '../store'
import { Lock, Unlock } from 'lucide-react'

export default function LoginModal({ isOpen, onClose }) {
  const [tokenInput, setTokenInput] = React.useState('')
  const [isPrivate, setIsPrivate] = React.useState(false)
  const { setToken, fetchBrowse } = useStore()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = isPrivate ? tokenInput : null
      await fetchBrowse('/', token)
      if (token) setToken(token)
      onClose()
    } catch (error) {
      alert('认证失败: ' + error.message)
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
          {/* 模式选择 */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setIsPrivate(false)}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                !isPrivate
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Unlock size={18} />
                公开模式
              </div>
            </button>
            <button
              type="button"
              onClick={() => setIsPrivate(true)}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                isPrivate
                  ? 'bg-purple-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Lock size={18} />
                私密模式
              </div>
            </button>
          </div>

          {/* Token 输入 */}
          {isPrivate && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                访问令牌
              </label>
              <input
                type="password"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                placeholder="输入你的 API Token"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                required={isPrivate}
              />
              <p className="text-xs text-gray-500">
                Token 将被保存到本地存储中
              </p>
            </div>
          )}

          {/* 提交按钮 */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-lg font-medium hover:shadow-lg transition-all transform hover:scale-105"
          >
            进入文件库
          </button>
        </form>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-900">
            💡 提示: 公开模式可以浏览所有公共文件，私密模式需要 Token 来访问受保护的内容。
          </p>
        </div>
      </div>
    </div>
  )
}
