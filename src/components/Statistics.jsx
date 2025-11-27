import React from 'react'
import { useStore } from '../store'
import { BarChart3, TrendingUp, Users, Activity, Lock } from 'lucide-react'

export default function Statistics() {
  const { stats, loading, error, token, fetchStats } = useStore()
  const [startDate, setStartDate] = React.useState('')
  const [endDate, setEndDate] = React.useState('')

  const handleFetchStats = async () => {
    try {
      await fetchStats(token, startDate || null, endDate || null)
    } catch (error) {
      alert('获取统计失败: ' + error.message)
    }
  }

  if (!token) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
        <Lock size={32} className="mx-auto text-blue-500 mb-3" />
        <p className="text-blue-900 font-medium">需要认证才能查看统计数据</p>
        <p className="text-blue-700 text-sm mt-2">请使用有效的 Token 登录</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 时间范围选择 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">查询时间范围</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              开始日期
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              结束日期
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={handleFetchStats}
              disabled={loading}
              className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-medium py-2 rounded-lg transition-colors"
            >
              {loading ? '加载中...' : '查询'}
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 font-medium">⚠️ 错误</p>
          <p className="text-red-600 text-sm mt-1">{error}</p>
        </div>
      )}

      {stats && (
        <>
          {/* 统计卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">总请求数</p>
                  <p className="text-3xl font-bold text-blue-900 mt-2">
                    {stats.totalRequests}
                  </p>
                </div>
                <Activity size={40} className="text-blue-400" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">成功率</p>
                  <p className="text-3xl font-bold text-green-900 mt-2">
                    {stats.successRate.toFixed(2)}%
                  </p>
                </div>
                <TrendingUp size={40} className="text-green-400" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">唯一 IP</p>
                  <p className="text-3xl font-bold text-purple-900 mt-2">
                    {stats.uniqueIPs}
                  </p>
                </div>
                <Users size={40} className="text-purple-400" />
              </div>
            </div>
          </div>

          {/* 热门文件 */}
          {stats.hotFiles && stats.hotFiles.length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <BarChart3 size={20} className="text-blue-500" />
                热门文件 TOP 10
              </h3>
              <div className="space-y-3">
                {stats.hotFiles.slice(0, 10).map((file, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                        {idx + 1}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 truncate">{file.path}</p>
                        <p className="text-xs text-gray-500">{file.count} 次访问</p>
                      </div>
                    </div>
                    <div className="w-32 bg-gray-200 rounded-full h-2 ml-4">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{
                          width: `${(file.count / stats.hotFiles[0].count) * 100}%`
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 热门 IP */}
          {stats.hotIPs && stats.hotIPs.length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Users size={20} className="text-purple-500" />
                活跃用户 TOP 10
              </h3>
              <div className="space-y-3">
                {stats.hotIPs.slice(0, 10).map((ip, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="bg-purple-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                        {idx + 1}
                      </div>
                      <div>
                        <p className="font-mono font-medium text-gray-900">{ip.ip}</p>
                        <p className="text-xs text-gray-500">{ip.count} 个请求</p>
                      </div>
                    </div>
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-purple-500 h-2 rounded-full"
                        style={{
                          width: `${(ip.count / stats.hotIPs[0].count) * 100}%`
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
