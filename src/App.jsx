import React from 'react'
import './index.css'
import Header from './components/Header'
import LoginModal from './components/LoginModal'
import FileBrowser from './components/FileBrowser'
import Statistics from './components/Statistics'
import ApiDocs from './components/ApiDocs'
import { useStore } from './store'

export default function App() {
  const [showLogin, setShowLogin] = React.useState(false)
  const [currentTab, setCurrentTab] = React.useState('browser')
  const { token, fetchBrowse } = useStore()

  React.useEffect(() => {
    // 初始化时尝试加载公开目录
    if (!token) {
      fetchBrowse('/', null).catch(() => {
        // 如果公开目录不可用，显示登录
        setShowLogin(true)
      })
    } else {
      fetchBrowse('/', token).catch(() => {
        alert('Token 已过期，请重新登录')
        setShowLogin(true)
      })
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onShowLogin={() => setShowLogin(true)} currentTab={currentTab} setCurrentTab={setCurrentTab} />

      <main className="max-w-7xl mx-auto px-6 py-8">
        {currentTab === 'browser' && <FileBrowser />}
        {currentTab === 'stats' && <Statistics />}
        {currentTab === 'docs' && <ApiDocs />}
      </main>

      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />

      <footer className="bg-gray-900 text-gray-400 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p>© 2025 RawBox. 高效的文件共享服务。</p>
          <p className="text-sm mt-2">构建于 React 18 + Vite + Tailwind CSS</p>
        </div>
      </footer>
    </div>
  )
}
