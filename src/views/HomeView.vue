<template>
  <div class="home-view">
    <!-- 顶部导航栏 -->
    <header class="app-header">
      <div class="header-content">
        <div class="logo-section">
          <h1 class="app-title">智能简历生成器</h1>
          <p class="app-subtitle">基于JSON数据的现代化简历制作工具</p>
        </div>
        
        <div class="header-actions">
          <ThemeSwitcher />
          <button @click="exportJson" class="btn btn-secondary">
            <DocumentArrowDownIcon class="icon" />
            导出JSON
          </button>
          <button @click="importJson" class="btn btn-secondary">
            <DocumentArrowUpIcon class="icon" />
            导入JSON
          </button>
          <button @click="exportLongImage" class="btn btn-primary">
            <DocumentTextIcon class="icon" />
            导出长图
          </button>
        </div>
      </div>
    </header>

    <!-- 主要内容区域 -->
    <main class="main-content">
      <div class="content-layout">
        <!-- 左侧编辑器 -->
        <div class="editor-panel" :class="{ collapsed: isEditorCollapsed }">
          <div class="panel-header">
            <h2 class="panel-title">JSON 编辑器</h2>
            <button 
              @click="toggleEditor" 
              class="collapse-btn"
              :title="isEditorCollapsed ? '展开编辑器' : '折叠编辑器'"
            >
              <ChevronLeftIcon v-if="!isEditorCollapsed" class="icon" />
              <ChevronRightIcon v-else class="icon" />
            </button>
          </div>
          <div class="panel-content">
            <JsonEditor />
          </div>
        </div>

        <!-- 右侧预览区域 -->
        <div class="preview-panel">
          <div class="panel-header">
            <h2 class="panel-title">简历预览</h2>
            <div class="preview-actions">
              <button @click="refreshPreview" class="btn btn-ghost" title="刷新预览">
                <ArrowPathIcon class="icon" />
              </button>
              <button @click="toggleFullscreen" class="btn btn-ghost" title="全屏预览">
                <ArrowsPointingOutIcon class="icon" />
              </button>
            </div>
          </div>
          <div class="panel-content">
            <div class="preview-container" ref="previewContainer">
              <ResumePreview />
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- 状态栏 -->
    <footer class="status-bar">
      <div class="status-left">
        <div class="validation-indicator" :class="{ valid: isValid, invalid: !isValid }">
          <CheckCircleIcon v-if="isValid" class="icon" />
          <ExclamationTriangleIcon v-else class="icon" />
          <span>{{ isValid ? '数据有效' : '数据无效' }}</span>
        </div>
        <div class="theme-indicator">
          <SwatchIcon class="icon" />
          <span>当前主题: {{ currentThemeInfo?.name }}</span>
        </div>
      </div>
      
      <div class="status-right">
        <div class="last-updated">
          <ClockIcon class="icon" />
          <span>最后更新: {{ formatTime(lastUpdated) }}</span>
        </div>
      </div>
    </footer>

    <!-- 文件输入 -->
    <input 
      ref="fileInput" 
      type="file" 
      accept=".json"
      style="display: none"
      @change="handleFileImport"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useResumeStore } from '@/stores/resume'
import { useThemeStore } from '@/stores/theme'
import ResumePreview from '@/components/ResumePreview.vue'
import JsonEditor from '@/components/JsonEditor.vue'
import ThemeSwitcher from '@/components/ThemeSwitcher.vue'
import {
  DocumentArrowDownIcon,
  DocumentArrowUpIcon,
  DocumentTextIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowPathIcon,
  ArrowsPointingOutIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  SwatchIcon,
  ClockIcon
} from '@heroicons/vue/24/outline'

const resumeStore = useResumeStore()
const themeStore = useThemeStore()

const isEditorCollapsed = ref(false)
const fileInput = ref<HTMLInputElement>()
const previewContainer = ref<HTMLElement>()

const isValid = computed(() => resumeStore.isResumeValid)
const currentThemeInfo = computed(() => themeStore.getCurrentThemeInfo)
const lastUpdated = computed(() => resumeStore.getResumeData.metadata.updatedAt)

// 切换编辑器显示/隐藏
const toggleEditor = () => {
  isEditorCollapsed.value = !isEditorCollapsed.value
}

// 刷新预览
const refreshPreview = () => {
  // 触发重新渲染
  resumeStore.validateData()
}

// 全屏预览
const toggleFullscreen = () => {
  if (!previewContainer.value) return
  
  if (document.fullscreenElement) {
    document.exitFullscreen()
  } else {
    previewContainer.value.requestFullscreen()
  }
}

// 导出JSON
const exportJson = () => {
  const jsonData = resumeStore.exportToJSON()
  const blob = new Blob([jsonData], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  
  const link = document.createElement('a')
  link.href = url
  link.download = `resume-${new Date().toISOString().split('T')[0]}.json`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  URL.revokeObjectURL(url)
}

// 导入JSON
const importJson = () => {
  fileInput.value?.click()
}

// 处理文件导入
const handleFileImport = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (!file) return
  
  const reader = new FileReader()
  reader.onload = (e) => {
    const content = e.target?.result as string
    if (resumeStore.importFromJSON(content)) {
      alert('JSON文件导入成功！')
    } else {
      alert('JSON文件格式错误，请检查文件内容。')
    }
  }
  reader.readAsText(file)
  
  // 清空input值，允许重复选择同一文件
  target.value = ''
}

// 导出长图
const exportLongImage = async () => {
  try {
    // 显示加载提示
    const loadingMessage = document.createElement('div')
    loadingMessage.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 20px;
      border-radius: 8px;
      z-index: 9999;
      font-size: 16px;
    `
    loadingMessage.textContent = '正在生成长图，请稍候...'
    document.body.appendChild(loadingMessage)

    // 获取预览容器
    const previewContainer = document.querySelector('.preview-container')
    if (!previewContainer) {
      throw new Error('找不到预览容器')
    }

    // 保存原始样式
    let originalStyle = previewContainer.getAttribute('style') || ''
    
    // 为截图优化样式，保持当前主题
    previewContainer.style.cssText = `
      width: 800px !important;
      max-width: none !important;
      margin: 0 auto !important;
      padding: 20px !important;
      border-radius: 8px !important;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1) !important;
      min-height: 100px !important;
    `

    // 获取当前主题
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'liquid-glass'
    
    // 为液态玻璃主题添加特殊处理
    let liquidGlassFix: HTMLStyleElement | null = null
    if (currentTheme === 'liquid-glass') {
      // 添加一个临时的样式覆盖，确保液态玻璃效果能正确渲染
      liquidGlassFix = document.createElement('style')
      liquidGlassFix.textContent = `
        .resume-container {
          background: rgba(255, 255, 255, 0.1) !important;
          border: 1px solid rgba(255, 255, 255, 0.18) !important;
        }
        
        .section {
          background: rgba(255, 255, 255, 0.05) !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
        }
        
        .personal-section {
          background: rgba(255, 255, 255, 0.15) !important;
        }
        
        /* 确保所有文字在液态玻璃主题下可见 */
        * {
          color: rgba(255, 255, 255, 0.9) !important;
        }
        
        .section-title {
          color: rgba(255, 255, 255, 0.9) !important;
        }
        
        .name {
          color: rgba(255, 255, 255, 0.95) !important;
        }
        
        .title {
          color: rgba(255, 255, 255, 0.7) !important;
        }
        
        .contact-info {
          color: rgba(255, 255, 255, 0.8) !important;
        }
        
        .position, .degree {
          color: rgba(255, 255, 255, 0.9) !important;
        }
        
        .company, .institution {
          color: rgba(255, 255, 255, 0.8) !important;
        }
        
        .date {
          color: rgba(255, 255, 255, 0.6) !important;
        }
        
        .description {
          color: rgba(255, 255, 255, 0.8) !important;
        }
        
        .achievements, .highlights {
          color: rgba(255, 255, 255, 0.8) !important;
        }
        
        .achievements li, .highlights li {
          color: rgba(255, 255, 255, 0.8) !important;
        }
        
        .summary {
          color: rgba(255, 255, 255, 0.8) !important;
        }
        
        .tech-tag {
          background: rgba(255, 255, 255, 0.2) !important;
          color: rgba(255, 255, 255, 0.9) !important;
          border: 1px solid rgba(255, 255, 255, 0.2) !important;
        }
        
        .skill-category h4 {
          color: rgba(255, 255, 255, 0.9) !important;
        }
        
        .skill-item {
          color: rgba(255, 255, 255, 0.8) !important;
        }
        
        .soft-skill-tag {
          background: rgba(147, 51, 234, 0.2) !important;
          color: rgba(147, 51, 234, 0.9) !important;
          border: 1px solid rgba(147, 51, 234, 0.3) !important;
        }
        
        .honor-tag {
          background: rgba(255, 215, 0, 0.2) !important;
          color: rgba(255, 215, 0, 0.9) !important;
          border: 1px solid rgba(255, 215, 0, 0.3) !important;
        }
        
        .language-item, .interest-item {
          background: rgba(255, 255, 255, 0.2) !important;
          color: rgba(255, 255, 255, 0.9) !important;
          border: 1px solid rgba(255, 255, 255, 0.2) !important;
        }
      `
      document.head.appendChild(liquidGlassFix)
      
      // 等待样式应用
      await new Promise(resolve => setTimeout(resolve, 1000))
    } else {
      // 等待样式应用
      await new Promise(resolve => setTimeout(resolve, 500))
    }

    // 确保容器有内容且尺寸正确
    if (!previewContainer.innerHTML.trim()) {
      throw new Error('预览容器为空，请先更新预览')
    }

    // 强制重新计算布局
    previewContainer.offsetHeight

    // 检查容器尺寸
    const containerWidth = previewContainer.offsetWidth
    const containerHeight = previewContainer.scrollHeight

    if (containerWidth === 0 || containerHeight === 0) {
      throw new Error('容器尺寸无效，请检查预览内容')
    }

    console.log('容器尺寸:', containerWidth, 'x', containerHeight)

    // 动态导入html2canvas
    const html2canvas = (await import('html2canvas')).default
    
    // 截取长图，保持当前主题样式
    const canvas = await html2canvas(previewContainer, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: currentTheme === 'liquid-glass' ? 'transparent' : '#ffffff',
      width: 800,
      height: Math.max(containerHeight, 600), // 确保最小高度
      scrollX: 0,
      scrollY: 0,
      logging: true, // 开启日志以便调试

      onclone: (clonedDoc) => {
        // 在克隆的文档中确保所有内容可见
        const clonedContainer = clonedDoc.querySelector('.preview-container')
        if (clonedContainer) {
          clonedContainer.style.width = '800px'
          clonedContainer.style.height = 'auto'
          clonedContainer.style.overflow = 'visible'
        }
        

      }
    })

    // 检查canvas尺寸
    if (canvas.width === 0 || canvas.height === 0) {
      throw new Error('Canvas尺寸无效，截图失败')
    }

    console.log('Canvas尺寸:', canvas.width, 'x', canvas.height)

    // 恢复原始样式
    previewContainer.setAttribute('style', originalStyle)

    // 移除液态玻璃主题的临时样式
    if (liquidGlassFix && liquidGlassFix.parentNode) {
      document.head.removeChild(liquidGlassFix)
    }

    // 将canvas转换为图片并下载
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `resume-${new Date().toISOString().split('T')[0]}.png`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
        
        // 清理加载提示
        document.body.removeChild(loadingMessage)
        
        // 显示成功提示
        alert('长图导出成功！')
      } else {
        throw new Error('图片生成失败')
      }
    }, 'image/png', 0.9)
    
  } catch (error) {
    console.error('长图导出失败:', error)
    alert('长图导出失败，请重试')
    
    // 恢复原始样式
    const previewContainer = document.querySelector('.preview-container')
    if (previewContainer) {
      previewContainer.setAttribute('style', originalStyle || '')
    }
    
    // 移除液态玻璃主题的临时样式
    if (liquidGlassFix && liquidGlassFix.parentNode) {
      document.head.removeChild(liquidGlassFix)
    }
    
    // 清理加载提示
    const loadingMessage = document.querySelector('[style*="position: fixed"]')
    if (loadingMessage && loadingMessage.textContent?.includes('正在生成长图')) {
      document.body.removeChild(loadingMessage)
    }
  }
}

// 格式化时间
const formatTime = (isoString: string): string => {
  const date = new Date(isoString)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(() => {
  // 初始化主题
  themeStore.initializeTheme()
})
</script>

<style scoped lang="scss">
.home-view {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--app-bg, #f8fafc);
  
  .app-header {
    background: var(--header-bg, #ffffff);
    border-bottom: 1px solid var(--border-color, #e2e8f0);
    padding: 1rem 2rem;
    
    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      max-width: 1400px;
      margin: 0 auto;
      
      .logo-section {
        .app-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--heading-color, #1e293b);
          margin: 0 0 0.25rem 0;
        }
        
        .app-subtitle {
          font-size: 0.875rem;
          color: var(--text-secondary, #64748b);
          margin: 0;
        }
      }
      
      .header-actions {
        display: flex;
        align-items: center;
        gap: 1rem;
        
        .btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          border: none;
          border-radius: 6px;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          
          .icon {
            width: 1rem;
            height: 1rem;
          }
          
          &.btn-primary {
            background: var(--primary-color, #3b82f6);
            color: white;
            
            &:hover {
              background: var(--primary-hover, #2563eb);
            }
          }
          
          &.btn-secondary {
            background: var(--secondary-bg, #f1f5f9);
            color: var(--secondary-text, #475569);
            border: 1px solid var(--secondary-border, #cbd5e1);
            
            &:hover {
              background: var(--secondary-hover, #e2e8f0);
            }
          }
        }
      }
    }
  }
  
  .main-content {
    flex: 1;
    overflow: hidden;
    
    .content-layout {
      height: 100%;
      display: flex;
      
      .editor-panel {
        width: 400px;
        background: var(--panel-bg, #ffffff);
        border-right: 1px solid var(--border-color, #e2e8f0);
        display: flex;
        flex-direction: column;
        transition: all 0.3s ease;
        
        &.collapsed {
          width: 0;
          min-width: 0;
          overflow: hidden;
        }
        
        .panel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 1.5rem;
          border-bottom: 1px solid var(--border-color, #e2e8f0);
          
          .panel-title {
            font-size: 1rem;
            font-weight: 600;
            color: var(--heading-color, #1e293b);
            margin: 0;
          }
          
          .collapse-btn {
            background: none;
            border: none;
            padding: 0.5rem;
            border-radius: 4px;
            cursor: pointer;
            color: var(--text-secondary, #64748b);
            transition: all 0.2s ease;
            
            &:hover {
              background: var(--hover-bg, #f1f5f9);
              color: var(--text-primary, #1e293b);
            }
            
            .icon {
              width: 1rem;
              height: 1rem;
            }
          }
        }
        
        .panel-content {
          flex: 1;
          overflow: hidden;
        }
      }
      
      .preview-panel {
        flex: 1;
        display: flex;
        flex-direction: column;
        background: var(--panel-bg, #ffffff);
        
        .panel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 1.5rem;
          border-bottom: 1px solid var(--border-color, #e2e8f0);
          
          .panel-title {
            font-size: 1rem;
            font-weight: 600;
            color: var(--heading-color, #1e293b);
            margin: 0;
          }
          
          .preview-actions {
            display: flex;
            gap: 0.5rem;
            
            .btn-ghost {
              background: none;
              border: none;
              padding: 0.5rem;
              border-radius: 4px;
              cursor: pointer;
              color: var(--text-secondary, #64748b);
              transition: all 0.2s ease;
              
              &:hover {
                background: var(--hover-bg, #f1f5f9);
                color: var(--text-primary, #1e293b);
              }
              
              .icon {
                width: 1rem;
                height: 1rem;
              }
            }
          }
        }
        
        .panel-content {
          flex: 1;
          overflow: auto;
          
          .preview-container {
            height: 100%;
          }
        }
      }
    }
  }
  
  .status-bar {
    background: var(--status-bar-bg, #f8fafc);
    border-top: 1px solid var(--border-color, #e2e8f0);
    padding: 0.75rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.875rem;
    
    .status-left,
    .status-right {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }
    
    .validation-indicator {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      
      .icon {
        width: 1rem;
        height: 1rem;
      }
      
      &.valid {
        color: var(--success-color, #059669);
      }
      
      &.invalid {
        color: var(--error-color, #dc2626);
      }
    }
    
    .theme-indicator,
    .last-updated {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--text-secondary, #64748b);
      
      .icon {
        width: 1rem;
        height: 1rem;
      }
    }
  }
}

// 响应式设计
@media (max-width: 1024px) {
  .home-view {
    .app-header {
      padding: 1rem;
      
      .header-content {
        flex-direction: column;
        gap: 1rem;
        align-items: stretch;
        
        .header-actions {
          justify-content: center;
          flex-wrap: wrap;
        }
      }
    }
    
    .main-content {
      .content-layout {
        flex-direction: column;
        
        .editor-panel {
          width: 100%;
          height: 300px;
          border-right: none;
          border-bottom: 1px solid var(--border-color, #e2e8f0);
          
          &.collapsed {
            height: 0;
            min-height: 0;
          }
        }
        
        .preview-panel {
          flex: 1;
        }
      }
    }
    
    .status-bar {
      padding: 0.75rem 1rem;
      flex-direction: column;
      gap: 0.5rem;
      align-items: stretch;
      
      .status-left,
      .status-right {
        justify-content: center;
        gap: 1rem;
      }
    }
  }
}

@media (max-width: 768px) {
  .home-view {
    .app-header {
      .header-content {
        .header-actions {
          .btn {
            padding: 0.5rem 0.75rem;
            font-size: 0.75rem;
            
            span {
              display: none;
            }
          }
        }
      }
    }
  }
}
</style>

