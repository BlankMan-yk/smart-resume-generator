# 智能简历生成器

一个基于Vue.js的现代化在线简历生成工具，支持JSON数据驱动和多主题切换。

## 🌟 特色功能

### 核心功能
- **JSON数据驱动**: 通过标准化的JSON格式管理简历数据
- **实时预览**: 数据变更即时反映在简历预览中
- **多主题系统**: 5种精美主题可供选择
- **响应式设计**: 完美适配桌面和移动设备
- **数据导入导出**: 支持JSON格式的数据导入和导出

### 主题系统
1. **液态玻璃主题** - 苹果风格的现代玻璃质感，采用最新的Liquid Glass设计语言
2. **商务专业主题** - 简洁专业的商务风格，适合传统行业
3. **创意设计主题** - 充满活力的创意风格，适合设计师和创意工作者
4. **极简主义主题** - 现代极简设计，突出内容本身
5. **科技未来主题** - 科技感十足，适合IT和技术岗位

## 🚀 技术栈

- **前端框架**: Vue 3 + Composition API
- **构建工具**: Vite
- **状态管理**: Pinia
- **样式方案**: SCSS + CSS Variables
- **代码编辑器**: CodeMirror 6
- **图标库**: Heroicons
- **类型检查**: TypeScript

## 📦 安装和运行

### 环境要求
- Node.js 16+
- npm 或 yarn

### 安装依赖
```bash
npm install
```

### 开发模式
```bash
npm run dev
```

### 构建生产版本
```bash
npm run build
```

### 预览生产版本
```bash
npm run preview
```

## 🎨 主题定制

项目采用CSS Variables实现主题系统，所有主题配置都在 `src/assets/themes.scss` 文件中。

### 添加新主题
1. 在 `themes.scss` 中添加新的主题变量
2. 在 `src/stores/theme.ts` 中注册新主题
3. 在 `ThemeSwitcher.vue` 中添加主题预览

### 主题变量结构
```scss
:root[data-theme="your-theme"] {
  --app-bg: #your-background;
  --text-color: #your-text-color;
  // ... 其他变量
}
```

## 📋 JSON数据格式

简历数据采用标准化的JSON格式，包含以下主要部分：

```json
{
  "personalInfo": {
    "name": "姓名",
    "title": "职位标题",
    "email": "邮箱",
    "phone": "电话",
    "location": "地址",
    "summary": "个人简介"
  },
  "experience": [...],
  "education": [...],
  "skills": {...},
  "projects": [...],
  "certifications": [...],
  "languages": [...],
  "interests": [...]
}
```

详细的数据结构定义请参考 `src/types/resume.ts`。

## 🔧 项目结构

```
src/
├── components/           # 通用组件
│   ├── ResumePreview.vue # 简历预览组件
│   ├── JsonEditor.vue    # JSON编辑器
│   └── ThemeSwitcher.vue # 主题切换器
├── stores/              # 状态管理
│   ├── resume.ts        # 简历数据管理
│   └── theme.ts         # 主题管理
├── types/               # TypeScript类型定义
│   └── resume.ts        # 简历数据类型
├── assets/              # 静态资源
│   ├── themes.scss      # 主题样式
│   └── main.css         # 全局样式
└── views/               # 页面组件
    └── HomeView.vue     # 主页面
```

## 🎯 使用指南

### 基本使用
1. 在左侧JSON编辑器中编辑简历数据
2. 右侧实时预览简历效果
3. 使用顶部主题切换器选择喜欢的主题
4. 点击"导出JSON"保存数据
5. 点击"导入JSON"加载已有数据

### 高级功能
- **格式化**: 点击"格式化"按钮美化JSON代码
- **验证**: 点击"验证"按钮检查数据格式
- **重置**: 点击"重置"按钮恢复默认数据
- **折叠编辑器**: 点击折叠按钮隐藏编辑器，专注预览

## 🌐 浏览器支持

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📱 响应式设计

- **桌面端**: 左右分栏布局，编辑器和预览并排显示
- **平板端**: 上下布局，编辑器可折叠
- **移动端**: 单栏布局，通过标签页切换

## 🎨 设计特色

### 液态玻璃效果
采用苹果最新的Liquid Glass设计语言，实现了：
- 半透明玻璃质感
- 背景模糊效果 (backdrop-filter)
- 动态光影变化
- 流畅的动画过渡

### 现代化UI
- 圆角设计
- 柔和阴影
- 渐变色彩
- 微交互动画

## 🔮 未来规划

- [ ] PDF导出功能
- [ ] 更多主题选择
- [ ] AI智能简历优化建议
- [ ] 多语言支持
- [ ] 简历模板市场
- [ ] 协作编辑功能

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交Issue和Pull Request来改进这个项目！

## 📞 联系方式

如有问题或建议，请通过以下方式联系：
- 提交GitHub Issue
- 发送邮件至项目维护者

---

**智能简历生成器** - 让简历制作变得简单而美好 ✨

