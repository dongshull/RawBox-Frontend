import React from 'react'
import { useStore } from '../store'
import { LogOut, Settings } from 'lucide-react'

export default function Header({ onShowLogin, currentTab, setCurrentTab }) {
  const { token, clearToken } = useStore()

  const handleLogout = () => {
    clearToken()
    onShowLogin()
  }

  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">📦 RawBox</h1>
            <p className="text-blue-100 text-sm mt-1">高效的文件共享服务</p>
          </div>

          <div className="flex items-center gap-4">
            {token && (
              <div className="flex items-center gap-2 bg-blue-500/30 px-4 py-2 rounded-lg">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-blue-100 text-sm font-medium">已认证</span>
              </div>
            )}
            {token && (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
              >
                <LogOut size={18} />
                登出
              </button>
            )}
            {!token && (
              <button
                onClick={onShowLogin}
                className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 hover:bg-blue-50 rounded-lg font-medium transition-colors"
              >
                <Settings size={18} />
                登录
              </button>
            )}
          </div>
        </div>

        {/* 导航标签 */}
        <nav className="flex gap-2 border-t border-blue-500/30 pt-4">
          <button
            onClick={() => setCurrentTab('browser')}
            className={`px-4 py-2 font-medium rounded-lg transition-all ${
              currentTab === 'browser'
                ? 'bg-white text-blue-600 shadow-lg'
                : 'text-blue-100 hover:text-white'
            }`}
          >
            📁 文件浏览
          </button>
          <button
            onClick={() => setCurrentTab('stats')}
            className={`px-4 py-2 font-medium rounded-lg transition-all ${
              currentTab === 'stats'
                ? 'bg-white text-blue-600 shadow-lg'
                : 'text-blue-100 hover:text-white'
            }`}
          >
            📊 访问统计
          </button>
          <button
            onClick={() => setCurrentTab('docs')}
            className={`px-4 py-2 font-medium rounded-lg transition-all ${
              currentTab === 'docs'
                ? 'bg-white text-blue-600 shadow-lg'
                : 'text-blue-100 hover:text-white'
            }`}
          >
            📚 API 文档
          </button>
        </nav>
      </div>
    </header>
  )
}
