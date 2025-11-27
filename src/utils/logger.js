/**
 * 日志记录工具
 */

const LOG_LEVELS = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
}

const LOG_LEVEL = LOG_LEVELS[import.meta.env.VITE_LOG_LEVEL || 'info'] || 1

const colors = {
  debug: 'color: #888',
  info: 'color: #0066cc',
  warn: 'color: #ff9900',
  error: 'color: #ff0000'
}

const formatTime = () => {
  const now = new Date()
  return now.toISOString().split('T')[1].split('.')[0]
}

const log = (level, message, data = null) => {
  const levelValue = LOG_LEVELS[level] || LOG_LEVELS.info
  
  if (levelValue < LOG_LEVEL) return

  const prefix = `[${formatTime()}] [${level.toUpperCase()}]`
  const style = colors[level] || ''

  if (data) {
    console.log(`%c${prefix} ${message}`, style, data)
  } else {
    console.log(`%c${prefix} ${message}`, style)
  }
}

export default {
  debug: (msg, data) => log('debug', msg, data),
  info: (msg, data) => log('info', msg, data),
  warn: (msg, data) => log('warn', msg, data),
  error: (msg, data) => log('error', msg, data)
}
