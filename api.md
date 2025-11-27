# RawBox API 接口文档

## 基本信息

**基础 URL**: `http://localhost:18080` 或 `http://your-domain:18080`

**请求格式**: JSON

**响应格式**: JSON

**CORS 支持**: ✅ 已启用，支持跨域请求

---

## 目录

1. [管理员接口](#管理员接口)
   - [登录](#登录)
   - [获取文件列表](#获取文件列表)
   - [获取日志](#获取日志)
2. [文件访问接口](#文件访问接口)
   - [获取公开文件](#获取公开文件)
   - [获取私密文件](#获取私密文件)
3. [快速开始](#快速开始)
4. [错误处理](#错误处理)

---

## 管理员接口

### 登录

**端点**: `POST /admin/login`

**说明**: 使用管理员账号登录，获取会话令牌

**请求示例**:
```bash
curl -X POST http://localhost:18080/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123456"
  }'
```

**请求参数** (JSON Body):
```json
{
  "username": "admin",           // 必填：管理员用户名
  "password": "admin123456"      // 必填：管理员密码
}
```

**成功响应** (200 OK):
```json
{
  "code": 200,
  "message": "Login successful",
  "token": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6"
}
```

**失败响应** (401 Unauthorized):
```json
{
  "code": 401,
  "message": "Invalid username or password"
}
```

**前端代码示例** (JavaScript):
```javascript
async function login(username, password) {
  try {
    const response = await fetch('http://localhost:18080/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: username,
        password: password
      })
    });

    const data = await response.json();
    
    if (data.code === 200) {
      // 登录成功，保存令牌
      localStorage.setItem('sessionToken', data.token);
      console.log('登录成功，令牌:', data.token);
      return data.token;
    } else {
      console.error('登录失败:', data.message);
      return null;
    }
  } catch (error) {
    console.error('请求失败:', error);
    return null;
  }
}
```

---

### 获取文件列表

**端点**: `GET /admin/files`

**说明**: 获取指定目录下的文件和文件夹列表（需要会话令牌）

**请求头**:
```
X-Session-Token: <从登录接口获取的令牌>
```

**请求示例**:
```bash
curl http://localhost:18080/admin/files \
  -H "X-Session-Token: a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6"

# 获取特定目录
curl "http://localhost:18080/admin/files?dir=public" \
  -H "X-Session-Token: a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6"

# 获取私密目录
curl "http://localhost:18080/admin/files?dir=private" \
  -H "X-Session-Token: a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6"
```

**查询参数**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| dir | string | 否 | 目录路径，默认为 `.`（根目录） |

**成功响应** (200 OK):
```json
{
  "code": 200,
  "message": "Success",
  "files": [
    {
      "name": "public",
      "size": 4096,
      "is_dir": true,
      "time": "2025-11-27 11:45:06"
    },
    {
      "name": "private",
      "size": 4096,
      "is_dir": true,
      "time": "2025-11-27 11:45:06"
    },
    {
      "name": "test.txt",
      "size": 102,
      "is_dir": false,
      "time": "2025-11-27 11:45:06"
    }
  ]
}
```

**失败响应** (401 Unauthorized):
```json
{
  "code": 401,
  "message": "Unauthorized: Invalid or expired session"
}
```

**前端代码示例** (JavaScript):
```javascript
async function getFileList(dir = '.') {
  const sessionToken = localStorage.getItem('sessionToken');
  
  if (!sessionToken) {
    console.error('未登录，请先登录');
    return null;
  }

  try {
    const url = new URL('http://localhost:18080/admin/files');
    if (dir !== '.') {
      url.searchParams.append('dir', dir);
    }

    const response = await fetch(url.toString(), {
      headers: {
        'X-Session-Token': sessionToken
      }
    });

    const data = await response.json();

    if (data.code === 200) {
      console.log('文件列表:', data.files);
      return data.files;
    } else {
      console.error('获取文件列表失败:', data.message);
      return null;
    }
  } catch (error) {
    console.error('请求失败:', error);
    return null;
  }
}

// 使用示例
getFileList();           // 获取根目录
getFileList('public');   // 获取 public 目录
getFileList('private');  // 获取 private 目录
```

**前端代码示例** (TypeScript with Axios):
```typescript
import axios from 'axios';

interface FileInfo {
  name: string;
  size: number;
  is_dir: boolean;
  time: string;
}

interface FileListResponse {
  code: number;
  message: string;
  files: FileInfo[];
}

async function getFileList(dir: string = '.'): Promise<FileInfo[] | null> {
  const sessionToken = localStorage.getItem('sessionToken');
  
  if (!sessionToken) {
    console.error('未登录，请先登录');
    return null;
  }

  try {
    const response = await axios.get<FileListResponse>(
      'http://localhost:18080/admin/files',
      {
        params: { dir },
        headers: {
          'X-Session-Token': sessionToken
        }
      }
    );

    if (response.data.code === 200) {
      return response.data.files;
    } else {
      console.error('获取文件列表失败:', response.data.message);
      return null;
    }
  } catch (error) {
    console.error('请求失败:', error);
    return null;
  }
}
```

---

### 获取日志

**端点**: `GET /admin/logs`

**说明**: 获取日志文件列表或特定日志文件的内容（需要会话令牌）

**请求头**:
```
X-Session-Token: <从登录接口获取的令牌>
```

**请求示例**:
```bash
# 获取日志文件列表
curl http://localhost:18080/admin/logs \
  -H "X-Session-Token: a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6"

# 获取特定日志文件内容
curl "http://localhost:18080/admin/logs?file=2025-11-27-RawBox-log.txt" \
  -H "X-Session-Token: a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6"
```

**查询参数**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| file | string | 否 | 日志文件名，如不指定则返回文件列表 |

**获取日志列表响应** (200 OK):
```json
{
  "code": 200,
  "message": "Success",
  "logs": [
    "2025-11-27-RawBox-log.txt",
    "2025-11-26-RawBox-log.txt",
    "2025-11-25-RawBox-log.txt"
  ]
}
```

**获取日志内容响应** (200 OK - 纯文本):
```
2025-11-27 11:45:06, 127.0.0.1, /test.txt, Mozilla/5.0, 200
2025-11-27 11:45:10, 192.168.1.100, /secret.json, Mozilla/5.0, 401
2025-11-27 11:45:15, 10.0.0.50, /config.json, curl/7.64.1, 200
```

**前端代码示例** (JavaScript):
```javascript
async function getLogList() {
  const sessionToken = localStorage.getItem('sessionToken');
  
  if (!sessionToken) {
    console.error('未登录，请先登录');
    return null;
  }

  try {
    const response = await fetch('http://localhost:18080/admin/logs', {
      headers: {
        'X-Session-Token': sessionToken
      }
    });

    const data = await response.json();

    if (data.code === 200) {
      console.log('日志文件列表:', data.logs);
      return data.logs;
    } else {
      console.error('获取日志列表失败:', data.message);
      return null;
    }
  } catch (error) {
    console.error('请求失败:', error);
    return null;
  }
}

async function getLogContent(filename) {
  const sessionToken = localStorage.getItem('sessionToken');
  
  if (!sessionToken) {
    console.error('未登录，请先登录');
    return null;
  }

  try {
    const response = await fetch(
      `http://localhost:18080/admin/logs?file=${encodeURIComponent(filename)}`,
      {
        headers: {
          'X-Session-Token': sessionToken
        }
      }
    );

    const content = await response.text();
    console.log('日志内容:', content);
    return content;
  } catch (error) {
    console.error('请求失败:', error);
    return null;
  }
}

// 使用示例
const logs = await getLogList();
if (logs && logs.length > 0) {
  const content = await getLogContent(logs[0]);
}
```

---

## 文件访问接口

### 获取公开文件

**端点**: `GET /<filename>`

**说明**: 获取公开目录中的文件内容，无需认证

**请求示例**:
```bash
# 获取文本文件
curl http://localhost:18080/test.txt

# 获取 JSON 文件
curl http://localhost:18080/config.json

# 获取 Markdown 文件
curl http://localhost:18080/test.md
```

**成功响应** (200 OK):
```
文件内容直接返回，Content-Type 根据文件类型自动设置
```

**失败响应** (404 Not Found):
```
File not found
```

**前端代码示例** (JavaScript):
```javascript
async function getPublicFile(filename) {
  try {
    const response = await fetch(`http://localhost:18080/${filename}`);
    
    if (response.ok) {
      const content = await response.text();
      console.log('文件内容:', content);
      return content;
    } else {
      console.error('文件获取失败:', response.status);
      return null;
    }
  } catch (error) {
    console.error('请求失败:', error);
    return null;
  }
}

// 使用示例
getPublicFile('test.txt');
getPublicFile('config.json');
```

---

### 获取私密文件

**端点**: `GET /<filename>?api=<TOKEN>`

**说明**: 获取私密目录中的文件内容，需要有效的 API Token

**请求示例**:
```bash
# 获取私密文件
curl "http://localhost:18080/secret.txt?api=123"

# 获取私密 JSON 文件
curl "http://localhost:18080/secret.json?api=123"
```

**查询参数**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| api | string | 是 | API Token |

**成功响应** (200 OK):
```
文件内容直接返回
```

**失败响应** (401 Unauthorized):
```
Unauthorized: Invalid or missing token
```

**失败响应** (404 Not Found):
```
File not found
```

**前端代码示例** (JavaScript):
```javascript
async function getPrivateFile(filename, apiToken) {
  try {
    const url = new URL(`http://localhost:18080/${filename}`);
    url.searchParams.append('api', apiToken);

    const response = await fetch(url.toString());
    
    if (response.ok) {
      const content = await response.text();
      console.log('文件内容:', content);
      return content;
    } else if (response.status === 401) {
      console.error('API Token 无效');
      return null;
    } else if (response.status === 404) {
      console.error('文件不存在');
      return null;
    }
  } catch (error) {
    console.error('请求失败:', error);
    return null;
  }
}

// 使用示例
getPrivateFile('secret.txt', '123');
getPrivateFile('secret.json', '123');
```

---

## 快速开始

### 步骤 1: 初始化并登录

```javascript
// 存储服务器配置
const API_BASE = 'http://localhost:18080';

// 登录获取令牌
async function setupAuth() {
  const response = await fetch(`${API_BASE}/admin/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username: 'admin',
      password: 'admin123456'
    })
  });

  const data = await response.json();
  
  if (data.code === 200) {
    localStorage.setItem('sessionToken', data.token);
    console.log('✅ 登录成功');
    return true;
  } else {
    console.error('❌ 登录失败:', data.message);
    return false;
  }
}
```

### 步骤 2: 构建 API 调用工具函数

```javascript
class RawBoxAPI {
  constructor(baseURL = 'http://localhost:18080') {
    this.baseURL = baseURL;
    this.sessionToken = localStorage.getItem('sessionToken');
  }

  // 登录
  async login(username, password) {
    const response = await fetch(`${this.baseURL}/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();
    if (data.code === 200) {
      this.sessionToken = data.token;
      localStorage.setItem('sessionToken', data.token);
    }
    return data;
  }

  // 获取文件列表
  async getFileList(dir = '.') {
    const response = await fetch(
      `${this.baseURL}/admin/files?dir=${encodeURIComponent(dir)}`,
      {
        headers: {
          'X-Session-Token': this.sessionToken
        }
      }
    );
    return await response.json();
  }

  // 获取日志列表
  async getLogList() {
    const response = await fetch(`${this.baseURL}/admin/logs`, {
      headers: {
        'X-Session-Token': this.sessionToken
      }
    });
    return await response.json();
  }

  // 获取日志内容
  async getLogContent(filename) {
    const response = await fetch(
      `${this.baseURL}/admin/logs?file=${encodeURIComponent(filename)}`,
      {
        headers: {
          'X-Session-Token': this.sessionToken
        }
      }
    );
    return await response.text();
  }

  // 获取公开文件
  async getPublicFile(filename) {
    const response = await fetch(`${this.baseURL}/${filename}`);
    if (response.ok) {
      return await response.text();
    }
    throw new Error(`获取文件失败: ${response.status}`);
  }

  // 获取私密文件
  async getPrivateFile(filename, apiToken) {
    const response = await fetch(
      `${this.baseURL}/${filename}?api=${apiToken}`
    );
    if (response.ok) {
      return await response.text();
    }
    throw new Error(`获取文件失败: ${response.status}`);
  }
}

// 使用示例
const api = new RawBoxAPI();

(async () => {
  // 登录
  await api.login('admin', 'admin123456');

  // 获取文件列表
  const files = await api.getFileList('public');
  console.log('公开文件:', files);

  // 获取日志
  const logs = await api.getLogList();
  console.log('日志文件:', logs);

  if (logs.logs && logs.logs.length > 0) {
    const content = await api.getLogContent(logs.logs[0]);
    console.log('日志内容:', content);
  }

  // 获取公开文件
  const text = await api.getPublicFile('test.txt');
  console.log('文件内容:', text);
})();
```

### 步骤 3: 在 Vue 中使用

```vue
<template>
  <div class="rawbox-admin">
    <div v-if="!isLoggedIn" class="login">
      <input v-model="username" type="text" placeholder="用户名" />
      <input v-model="password" type="password" placeholder="密码" />
      <button @click="login">登录</button>
    </div>

    <div v-else class="admin-panel">
      <h2>欢迎，{{ username }}！</h2>

      <!-- 文件浏览器 -->
      <div class="file-browser">
        <h3>文件浏览</h3>
        <button @click="loadFileList('public')">公开文件</button>
        <button @click="loadFileList('private')">私密文件</button>

        <ul>
          <li v-for="file in files" :key="file.name">
            <span v-if="file.is_dir">[文件夹]</span>
            <span v-else>[文件]</span>
            {{ file.name }}
          </li>
        </ul>
      </div>

      <!-- 日志查看器 -->
      <div class="log-viewer">
        <h3>日志</h3>
        <select @change="loadLogContent">
          <option value="">选择日志文件</option>
          <option v-for="log in logs" :key="log" :value="log">
            {{ log }}
          </option>
        </select>

        <pre v-if="logContent">{{ logContent }}</pre>
      </div>

      <button @click="logout">退出登录</button>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';

const api = new RawBoxAPI();

export default {
  setup() {
    const isLoggedIn = ref(false);
    const username = ref('');
    const password = ref('');
    const files = ref([]);
    const logs = ref([]);
    const logContent = ref('');

    const login = async () => {
      const result = await api.login(username.value, password.value);
      if (result.code === 200) {
        isLoggedIn.value = true;
        await loadFileList('public');
        await loadLogList();
      }
    };

    const logout = () => {
      isLoggedIn.value = false;
      localStorage.removeItem('sessionToken');
    };

    const loadFileList = async (dir) => {
      const result = await api.getFileList(dir);
      if (result.code === 200) {
        files.value = result.files;
      }
    };

    const loadLogList = async () => {
      const result = await api.getLogList();
      if (result.code === 200) {
        logs.value = result.logs;
      }
    };

    const loadLogContent = async (event) => {
      const filename = event.target.value;
      if (filename) {
        logContent.value = await api.getLogContent(filename);
      }
    };

    return {
      isLoggedIn,
      username,
      password,
      files,
      logs,
      logContent,
      login,
      logout,
      loadFileList,
      loadLogList,
      loadLogContent
    };
  }
};
</script>

<style scoped>
.rawbox-admin {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.login,
.admin-panel {
  border: 1px solid #ddd;
  padding: 20px;
  border-radius: 8px;
}

input {
  margin: 5px;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button {
  margin: 5px;
  padding: 8px 16px;
  background: #0066cc;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background: #0052a3;
}

.file-browser,
.log-viewer {
  margin: 20px 0;
  padding: 15px;
  background: #f5f5f5;
  border-radius: 4px;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  padding: 5px;
  margin: 5px 0;
  background: white;
  border-radius: 4px;
}

pre {
  background: white;
  padding: 10px;
  border-radius: 4px;
  overflow-x: auto;
  max-height: 400px;
}

select {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}
</style>
```

---

## 错误处理

### HTTP 状态码

| 状态码 | 说明 | 处理方式 |
|--------|------|---------|
| 200 | 请求成功 | 正常处理响应 |
| 400 | 请求错误 | 检查请求参数 |
| 401 | 未授权 | 重新登录或检查令牌 |
| 404 | 资源不存在 | 检查文件/路径是否存在 |
| 405 | 方法不允许 | 使用正确的请求方法 |
| 500 | 服务器错误 | 检查服务器日志 |

### 前端错误处理示例

```javascript
async function handleAPIRequest(promise) {
  try {
    const response = await promise;
    
    if (!response.ok) {
      switch (response.status) {
        case 401:
          console.error('会话过期，请重新登录');
          // 清除令牌并重定向到登录页
          localStorage.removeItem('sessionToken');
          window.location.href = '/login';
          break;
        case 404:
          console.error('资源不存在');
          break;
        case 500:
          console.error('服务器错误，请稍后重试');
          break;
        default:
          console.error(`请求失败: ${response.status}`);
      }
      return null;
    }

    return response.json ? await response.json() : await response.text();
  } catch (error) {
    console.error('网络错误:', error);
    return null;
  }
}
```

---

## CORS 和跨域请求

服务器已启用 CORS，支持以下请求头：

```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, HEAD, OPTIONS, POST
Access-Control-Allow-Headers: Content-Type, X-Session-Token
Access-Control-Max-Age: 86400
```

这意味着前端可以直接从任何域名向服务器发起请求。

---

## 常见问题

**Q: 会话令牌过期了怎么办？**
A: 会话令牌在 `SESSION_TIMEOUT` 秒后过期（默认 3600 秒）。过期后需要重新登录。

**Q: 可以保存多个令牌吗？**
A: 可以，每次登录都会生成一个新的令牌，前面的令牌仍然有效。

**Q: 如何下载文件？**
A: 直接访问文件 URL，浏览器会自动下载。对于文本文件，浏览器可能会直接显示内容。

**Q: API Token 和会话令牌有什么区别？**
A: 
- **API Token** 用于访问私密文件，由环境变量 `API_TOKENS` 配置
- **会话令牌** 用于管理员接口认证，通过登录接口获取

---

## 更新日志

**v0.2.0** (2025-11-27)
- ✨ 添加管理员登录系统
- ✨ 添加文件列表接口
- ✨ 添加日志查看接口
- ✨ 支持会话管理
- 🔒 支持 CORS 跨域请求

---

## 联系支持

如有问题或建议，请提交 Issue 或联系开发团队。

**GitHub**: https://github.com/dongshull/RawBox
