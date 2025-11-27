import React from 'react'
import { useStore } from '../store'
import { Folder, File, Download, Info, ChevronRight, ArrowLeft } from 'lucide-react'
import { fileAPI } from '../api/client'

export default function FileBrowser() {
  const { files, currentPath, setCurrentPath, fetchBrowse, loading, error, token } = useStore()
  const [fileDetails, setFileDetails] = React.useState(null)

  const handleNavigate = async (path) => {
    try {
      await fetchBrowse(path, token || null)
    } catch (error) {
      alert('导航失败: ' + error.message)
    }
  }

  const handleParentDir = () => {
    const parts = currentPath.split('/').filter(Boolean)
    parts.pop()
    const parentPath = '/' + parts.join('/')
    handleNavigate(parentPath)
  }

  const handleDownload = (filename) => {
    const downloadUrl = fileAPI.download(
      currentPath === '/' ? filename : `${currentPath}/${filename}`,
      token || null
    )
    window.open(downloadUrl, '_blank')
  }

  const handleFileInfo = async (filename) => {
    try {
      const path = currentPath === '/' ? filename : `${currentPath}/${filename}`
      const info = await useStore.getState().fetchFileInfo(path, token || null)
      setFileDetails(info)
    } catch (error) {
      alert('获取文件信息失败: ' + error.message)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="space-y-4">
          <div className="w-12 h-12 rounded-full border-4 border-gray-300 border-t-blue-500 animate-spin mx-auto"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800 font-medium">⚠️ 错误</p>
        <p className="text-red-600 text-sm mt-1">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 面包屑导航 */}
      <div className="flex items-center gap-2 text-sm text-gray-600 flex-wrap">
        <button
          onClick={() => handleNavigate('/')}
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          根目录
        </button>
        {currentPath !== '/' && currentPath.split('/').filter(Boolean).map((part, i, arr) => (
          <React.Fragment key={i}>
            <ChevronRight size={16} />
            <button
              onClick={() => handleNavigate('/' + arr.slice(0, i + 1).join('/'))}
              className={i === arr.length - 1 ? 'text-gray-900 font-medium' : 'text-blue-600 hover:text-blue-700'}
            >
              {part}
            </button>
          </React.Fragment>
        ))}
      </div>

      {/* 返回按钮 */}
      {currentPath !== '/' && (
        <button
          onClick={handleParentDir}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 font-medium transition-colors"
        >
          <ArrowLeft size={18} />
          返回上级目录
        </button>
      )}

      {/* 文件列表 */}
      <div className="grid gap-3">
        {files && files.length > 0 ? (
          files.map((item, idx) => (
            <div
              key={idx}
              className="group bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-blue-300 transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {item.isDir ? (
                    <div className="text-blue-500 flex-shrink-0">
                      <Folder size={24} />
                    </div>
                  ) : (
                    <div className="text-gray-400 flex-shrink-0">
                      <File size={24} />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <button
                      onClick={() => item.isDir && handleNavigate(currentPath === '/' ? item.name : `${currentPath}/${item.name}`)}
                      className={`font-medium transition-colors truncate ${
                        item.isDir
                          ? 'text-blue-600 hover:text-blue-700 cursor-pointer'
                          : 'text-gray-900'
                      }`}
                    >
                      {item.name}
                    </button>
                    {!item.isDir && item.size && (
                      <p className="text-sm text-gray-500">
                        {(item.size / 1024).toFixed(2)} KB
                      </p>
                    )}
                  </div>
                </div>

                {/* 操作按钮 */}
                <div className="flex items-center gap-2 ml-4 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  {!item.isDir && (
                    <>
                      <button
                        onClick={() => handleFileInfo(item.name)}
                        className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 hover:text-blue-600 transition-colors"
                        title="文件信息"
                      >
                        <Info size={18} />
                      </button>
                      <button
                        onClick={() => handleDownload(item.name)}
                        className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 hover:text-blue-600 transition-colors"
                        title="下载文件"
                      >
                        <Download size={18} />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* 修改时间 */}
              {item.modTime && (
                <p className="text-xs text-gray-400 mt-2">
                  修改于: {new Date(item.modTime).toLocaleString('zh-CN')}
                </p>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <Folder size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">此目录为空</p>
          </div>
        )}
      </div>

      {/* 文件详情模态框 */}
      {fileDetails && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              {fileDetails.name}
            </h3>
            <div className="space-y-4">
              <div className="border-b pb-3">
                <p className="text-sm text-gray-600 font-medium">大小</p>
                <p className="text-lg font-semibold text-gray-900">
                  {(fileDetails.size / 1024).toFixed(2)} KB
                </p>
              </div>
              <div className="border-b pb-3">
                <p className="text-sm text-gray-600 font-medium">MIME 类型</p>
                <p className="text-lg font-semibold text-gray-900">
                  {fileDetails.mimeType}
                </p>
              </div>
              {fileDetails.md5 && (
                <div className="border-b pb-3">
                  <p className="text-sm text-gray-600 font-medium">MD5</p>
                  <p className="text-xs font-mono text-gray-900 break-all">
                    {fileDetails.md5}
                  </p>
                </div>
              )}
              {fileDetails.sha256 && (
                <div>
                  <p className="text-sm text-gray-600 font-medium">SHA256</p>
                  <p className="text-xs font-mono text-gray-900 break-all">
                    {fileDetails.sha256}
                  </p>
                </div>
              )}
            </div>
            <button
              onClick={() => setFileDetails(null)}
              className="w-full mt-6 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-medium transition-colors"
            >
              关闭
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
