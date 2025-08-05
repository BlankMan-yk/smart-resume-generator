# 部署指南

本文档介绍如何将智能简历生成器部署到各种平台。

## 📦 构建准备

### 1. 安装依赖
```bash
npm install
```

### 2. 构建生产版本
```bash
npm run build
```

构建完成后，所有静态文件将生成在 `dist/` 目录中。

## 🌐 部署选项

### 1. Netlify 部署

#### 方法一：拖拽部署
1. 访问 [Netlify](https://netlify.com)
2. 将 `dist/` 文件夹拖拽到部署区域
3. 获得临时域名，可以绑定自定义域名

#### 方法二：Git 集成
1. 将代码推送到 GitHub/GitLab
2. 在 Netlify 中连接仓库
3. 设置构建命令：`npm run build`
4. 设置发布目录：`dist`
5. 自动部署

### 2. Vercel 部署

#### 方法一：CLI 部署
```bash
npm install -g vercel
vercel --prod
```

#### 方法二：Git 集成
1. 访问 [Vercel](https://vercel.com)
2. 导入 GitHub 仓库
3. 自动检测 Vue 项目配置
4. 一键部署

### 3. GitHub Pages 部署

#### 创建部署脚本
在 `package.json` 中添加：
```json
{
  "scripts": {
    "deploy": "npm run build && gh-pages -d dist"
  }
}
```

#### 安装 gh-pages
```bash
npm install --save-dev gh-pages
```

#### 部署
```bash
npm run deploy
```

### 4. 服务器部署

#### Nginx 配置
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Gzip 压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

#### Apache 配置
创建 `.htaccess` 文件：
```apache
RewriteEngine On
RewriteBase /

# 处理 Vue Router 的 history 模式
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

# 启用 Gzip 压缩
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# 设置缓存
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
</IfModule>
```

## ⚙️ 环境配置

### 环境变量
如果需要配置环境变量，创建 `.env.production` 文件：
```env
VITE_APP_TITLE=智能简历生成器
VITE_APP_VERSION=1.0.0
VITE_API_BASE_URL=https://api.your-domain.com
```

### 构建优化

#### Vite 配置优化
在 `vite.config.ts` 中添加：
```typescript
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router', 'pinia'],
          codemirror: ['codemirror', '@codemirror/lang-json', '@codemirror/theme-one-dark']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
})
```

## 🔧 性能优化

### 1. 代码分割
- 路由级别的懒加载
- 组件级别的异步加载
- 第三方库的分包处理

### 2. 资源优化
- 图片压缩和格式优化
- CSS 和 JS 的压缩
- Gzip 压缩启用

### 3. 缓存策略
- 静态资源的长期缓存
- HTML 文件的短期缓存
- Service Worker 的离线缓存

## 🌍 CDN 配置

### 使用 CDN 加速
```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      external: ['vue', 'vue-router'],
      output: {
        globals: {
          vue: 'Vue',
          'vue-router': 'VueRouter'
        }
      }
    }
  }
})
```

在 `index.html` 中引入 CDN：
```html
<script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
<script src="https://unpkg.com/vue-router@4/dist/vue-router.global.js"></script>
```

## 📊 监控和分析

### 1. 性能监控
- Google Analytics
- Google PageSpeed Insights
- Lighthouse 性能测试

### 2. 错误监控
- Sentry 错误追踪
- 浏览器控制台错误监控

### 3. 用户行为分析
- 热力图分析
- 用户路径追踪
- 转化率统计

## 🔒 安全配置

### 1. HTTPS 配置
确保网站使用 HTTPS 协议，特别是处理用户数据时。

### 2. CSP 配置
在 `index.html` 中添加内容安全策略：
```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';">
```

### 3. 隐私保护
- 不收集用户个人信息
- 本地存储敏感数据
- 遵循 GDPR 等隐私法规

## 🚀 自动化部署

### GitHub Actions 配置
创建 `.github/workflows/deploy.yml`：
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '16'
        
    - name: Install dependencies
      run: npm install
      
    - name: Build
      run: npm run build
      
    - name: Deploy
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

## 📱 PWA 配置

### 添加 PWA 支持
1. 安装 PWA 插件：
```bash
npm install vite-plugin-pwa -D
```

2. 配置 `vite.config.ts`：
```typescript
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      },
      manifest: {
        name: '智能简历生成器',
        short_name: '简历生成器',
        description: '基于JSON数据的现代化简历制作工具',
        theme_color: '#667eea',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          }
        ]
      }
    })
  ]
})
```

## 🔍 SEO 优化

### Meta 标签优化
```html
<meta name="description" content="智能简历生成器 - 基于JSON数据的现代化在线简历制作工具">
<meta name="keywords" content="简历生成器,在线简历,JSON简历,简历制作">
<meta property="og:title" content="智能简历生成器">
<meta property="og:description" content="现代化的在线简历制作工具，支持多主题切换">
<meta property="og:image" content="/og-image.png">
```

### 结构化数据
添加 JSON-LD 结构化数据以提高搜索引擎理解。

## 📞 技术支持

如果在部署过程中遇到问题，请：
1. 检查构建日志中的错误信息
2. 确认所有依赖都已正确安装
3. 验证环境变量配置
4. 查看浏览器控制台错误
5. 提交 GitHub Issue 寻求帮助

---

祝您部署顺利！🎉

