import React from 'react'
import './index.css'
import Header from './components/Header'
import LoginModal from './components/LoginModal'
import FileBrowser from './components/FileBrowser'
import Statistics from './components/Statistics'
import ApiDocs from './components/ApiDocs'
import { useStore } from './store'
import logger from './utils/logger'

export default function App() {
  const [showLogin, setShowLogin] = React.useState(false)
  const [currentTab, setCurrentTab] = React.useState('browser')
  const { sessionToken, fetchBrowse, isAuthenticated, clearAuth } = useStore()

  // 处理全局认证错误事件
  React.useEffect(() => {
    const handleAuthError = (event) => {
      logger.warn('Authentication error detected', event.detail)
      clearAuth()
      setShowLogin(true)
    }

    window.addEventListener('auth-error', handleAuthError)
    return () => window.removeEventListener('auth-error', handleAuthError)
  }, [clearAuth])

  // 初始化应用，检查认证状态
  React.useEffect(() => {
    const initializeApp = async () => {
      try {
        // 检查 URL 参数中是否有会话 token
        const params = new URLSearchParams(window.location.search)
        const tokenParam = params.get('token')

        if (tokenParam) {
          logger.info('Token found in URL parameters')
          useStore.setState({ sessionToken: tokenParam })
          localStorage.setItem('rawbox_session_token', tokenParam)
          
          try {
            await fetchBrowse('.', tokenParam)
            logger.info('App initialized with URL token')
          } catch (error) {
            logger.error('Failed to load files with URL token', error)
            setShowLogin(true)
          }
        } else if (sessionToken && isAuthenticated) {
          // 使用本地存储的 session token
          logger.info('Using stored session token')
          try {
            await fetchBrowse('.', sessionToken)
            logger.info('App initialized with stored token')
          } catch (error) {
            logger.error('Failed to load files with stored token', error)
            setShowLogin(true)
          }
        } else {
          // 没有 token，显示登录
          logger.info('No authentication token found, showing login')
          setShowLogin(true)
        }
      } catch (error) {
        logger.error('App initialization error', error)
        setShowLogin(true)
      }
    }

    initializeApp()
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

