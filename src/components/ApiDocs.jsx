import React from 'react'
import { Code, Copy, CheckCircle } from 'lucide-react'

const API_ENDPOINTS = [
  {
    name: '目录浏览',
    endpoint: '/api/browse',
    method: 'GET',
    description: '列出指定目录下的所有文件和子目录',
    params: [
      { name: 'path', type: 'string', required: true, example: '/' },
      { name: 'token', type: 'string', required: false, example: 'your-token' }
    ],
    example: {
      url: 'GET /api/browse?path=/&token=test-token',
      response: JSON.stringify({
        path: '/',
        items: [
          { name: 'readme.md', size: 1024, isDir: false },
          { name: 'docs', isDir: true }
        ]
      }, null, 2)
    }
  },
  {
    name: '文件信息',
    endpoint: '/api/file-info',
    method: 'GET',
    description: '获取文件的详细信息，包括哈希值',
    params: [
      { name: 'path', type: 'string', required: true, example: '/readme.md' },
      { name: 'token', type: 'string', required: false, example: 'your-token' }
    ],
    example: {
      url: 'GET /api/file-info?path=/readme.md',
      response: JSON.stringify({
        name: 'readme.md',
        size: 1024,
        mimeType: 'text/markdown',
        md5: 'abc123def456',
        sha256: 'xyz789abc456xyz789abc456'
      }, null, 2)
    }
  },
  {
    name: '访问统计',
    endpoint: '/api/stats',
    method: 'GET',
    description: '获取文件访问统计信息',
    params: [
      { name: 'start', type: 'string', required: false, example: '2025-01-01' },
      { name: 'end', type: 'string', required: false, example: '2025-01-31' },
      { name: 'token', type: 'string', required: true, example: 'your-token', note: 'Header' }
    ],
    example: {
      url: 'GET /api/stats (Header: X-API-Token: your-token)',
      response: JSON.stringify({
        totalRequests: 1000,
        successRate: 95.5,
        hotFiles: [{ path: '/readme.md', count: 250 }],
        hotIPs: [{ ip: '192.168.1.1', count: 100 }]
      }, null, 2)
    }
  }
]

export default function ApiDocs() {
  const [copied, setCopied] = React.useState({})

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text)
    setCopied({ ...copied, [id]: true })
    setTimeout(() => setCopied({ ...copied, [id]: false }), 2000)
  }

  return (
    <div className="space-y-8">
      {/* 简介 */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-8">
        <div className="flex items-start gap-4">
          <Code size={32} className="text-blue-600 flex-shrink-0 mt-1" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">RawBox API</h2>
            <p className="text-gray-700 mb-4">
              RawBox 提供强大的 RESTful API 用于文件管理和统计。
              所有 API 都支持跨域请求，并返回标准的 JSON 格式。
            </p>
            <div className="space-y-2 text-sm text-gray-600">
              <p>📌 <strong>基础 URL:</strong> <code className="bg-white px-2 py-1 rounded">http://localhost:8888</code></p>
              <p>📌 <strong>响应格式:</strong> JSON</p>
              <p>📌 <strong>认证:</strong> 使用 Token 进行私密文件访问</p>
            </div>
          </div>
        </div>
      </div>

      {/* API 端点 */}
      <div className="space-y-6">
        {API_ENDPOINTS.map((api, idx) => (
          <div key={idx} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {/* 头部 */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-bold text-gray-900">{api.name}</h3>
                <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {api.method}
                </span>
              </div>
              <code className="text-gray-600 font-mono text-sm">{api.endpoint}</code>
              <p className="text-gray-600 text-sm mt-2">{api.description}</p>
            </div>

            {/* 内容 */}
            <div className="p-6 space-y-6">
              {/* 参数 */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">📋 请求参数</h4>
                <div className="space-y-2">
                  {api.params.map((param, pIdx) => (
                    <div key={pIdx} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-2 mb-1">
                        <code className="font-mono text-blue-600 font-bold">{param.name}</code>
                        <span className={`text-xs px-2 py-0.5 rounded ${
                          param.required
                            ? 'bg-red-100 text-red-700'
                            : 'bg-gray-200 text-gray-700'
                        }`}>
                          {param.required ? '必需' : '可选'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">类型: <code className="bg-white px-1 rounded">{param.type}</code></p>
                      <p className="text-sm text-gray-600">示例: <code className="bg-white px-1 rounded">{param.example}</code></p>
                      {param.note && <p className="text-xs text-gray-500 mt-1">💡 {param.note}</p>}
                    </div>
                  ))}
                </div>
              </div>

              {/* 示例 */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">🔗 请求示例</h4>
                <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm text-gray-100 overflow-x-auto relative group">
                  <pre>{api.example.url}</pre>
                  <button
                    onClick={() => handleCopy(api.example.url, `url-${idx}`)}
                    className="absolute top-3 right-3 p-2 bg-gray-700 hover:bg-gray-600 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                    title="复制"
                  >
                    {copied[`url-${idx}`] ? (
                      <CheckCircle size={18} className="text-green-400" />
                    ) : (
                      <Copy size={18} className="text-gray-300" />
                    )}
                  </button>
                </div>
              </div>

              {/* 响应 */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">📦 响应示例</h4>
                <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm text-gray-100 overflow-x-auto relative group max-h-72 overflow-y-auto">
                  <pre className="whitespace-pre-wrap break-words">{api.example.response}</pre>
                  <button
                    onClick={() => handleCopy(api.example.response, `response-${idx}`)}
                    className="absolute top-3 right-3 p-2 bg-gray-700 hover:bg-gray-600 rounded"
                    title="复制"
                  >
                    {copied[`response-${idx}`] ? (
                      <CheckCircle size={18} className="text-green-400" />
                    ) : (
                      <Copy size={18} className="text-gray-300" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 错误处理 */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h3 className="font-semibold text-gray-900 mb-4">⚠️ 错误处理</h3>
        <div className="space-y-3">
          <div className="bg-white p-3 rounded border border-yellow-200">
            <p className="font-mono font-bold text-red-600">401 Unauthorized</p>
            <p className="text-sm text-gray-600 mt-1">认证失败，Token 无效或不存在</p>
          </div>
          <div className="bg-white p-3 rounded border border-yellow-200">
            <p className="font-mono font-bold text-red-600">404 Not Found</p>
            <p className="text-sm text-gray-600 mt-1">请求的文件或目录不存在</p>
          </div>
          <div className="bg-white p-3 rounded border border-yellow-200">
            <p className="font-mono font-bold text-red-600">400 Bad Request</p>
            <p className="text-sm text-gray-600 mt-1">请求参数错误或无效</p>
          </div>
        </div>
      </div>
    </div>
  )
}
