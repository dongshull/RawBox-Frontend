# RawBox Frontend

🚀 一个现代、精美的文件共享服务前端，采用大厂设计风格

## ✨ 特性

- 📁 **文件浏览** - 优雅的目录树和文件管理
- 📊 **访问统计** - 实时统计文件访问情况
- 🔐 **安全认证** - 支持 Token 认证的私密文件访问
- 🎨 **现代 UI** - 采用 Tailwind CSS 和 Lucide 图标
- ⚡ **高性能** - 基于 Vite 和 React 18
- 📱 **响应式设计** - 完美支持各种屏幕尺寸

## 🛠️ 技术栈

- **框架**: React 18.2
- **构建工具**: Vite 5
- **样式**: Tailwind CSS 3.3
- **状态管理**: Zustand 4.4
- **图标库**: Lucide React
- **HTTP 客户端**: Axios

## 📦 项目结构

```
src/
├── components/          # React 组件
│   ├── Header.jsx      # 顶部导航栏
│   ├── LoginModal.jsx  # 登录模态框
│   ├── FileBrowser.jsx # 文件浏览器
│   ├── Statistics.jsx  # 统计分析
│   └── ApiDocs.jsx     # API 文档展示
├── store/              # 状态管理
│   └── index.js        # Zustand store
├── api/                # API 客户端
│   └── client.js       # Axios 配置
├── App.jsx             # 主应用组件
├── main.jsx            # 入口文件
└── index.css           # 全局样式
```

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:5173

### 3. 后端服务

确保后端运行在 http://localhost:8888

```bash
# 在另一个终端启动后端
cd ../RawBox
git checkout main  # 或 dev
go run main.go
```

### 4. 构建生产版本

```bash
npm run build
```

生成优化后的生产包到 `dist/` 目录

## 📚 功能说明

### 文件浏览
- 支持目录导航和文件浏览
- 显示文件大小和修改时间
- 快速下载和查看文件详情
- 面包屑导航便捷定位

### 访问统计
- 实时请求统计
- 成功率分析
- 热门文件排行
- 活跃用户排行
- 支持时间范围筛选

### 安全功能
- Token 认证
- 公开/私密模式切换
- 本地存储 Token（可选）
- 安全的文件下载

## 🔧 配置

### 修改后端地址

编辑 `vite.config.js`：

```javascript
proxy: {
  '/api': {
    target: 'http://你的后端地址:8888',
    changeOrigin: true
  }
}
```

### 自定义主题色

编辑 `tailwind.config.js` 修改颜色配置

## 🌐 后端 API

前端依赖的后端 API 端点：

- `GET /api/browse` - 目录浏览
- `GET /api/file-info` - 文件信息
- `GET /api/stats` - 访问统计
- `GET /:path` - 文件下载

详见应用中的 **API 文档** 选项卡

## 🤝 与后端的关系

- 前端在 `RawBox-Frontend` 目录（独立项目）
- 后端在 `RawBox` 目录（main/dev 分支）
- 通过 HTTP API 通信
- 完全解耦，可独立开发和部署

## 📄 许可证

MIT License

---

**开发步骤:**

1. `npm install` 安装依赖
2. `npm run dev` 启动开发服务器
3. 编写组件代码
4. `npm run build` 生产构建
5. `npm run preview` 预览生产版本
