<template>
  <div class="json-editor">
    <div class="editor-header">
      <h3 class="editor-title">JSON 数据编辑器</h3>
      <div class="editor-actions">
        <button @click="updatePreview" class="btn btn-primary" title="更新预览">
          <ArrowPathIcon class="icon" />
          更新预览
        </button>
        <button @click="formatJson" class="btn btn-secondary" title="格式化JSON">
          <DocumentTextIcon class="icon" />
          格式化
        </button>
        <button @click="validateJson" class="btn btn-secondary" title="验证JSON">
          <CheckCircleIcon class="icon" />
          验证
        </button>
        <button @click="resetToDefault" class="btn btn-warning" title="重置为默认">
          <ArrowPathIcon class="icon" />
          重置
        </button>
      </div>
    </div>
    
    <div class="editor-container">
      <div class="editor-wrapper" ref="editorContainer"></div>
    </div>
    
    <div class="editor-footer">
      <div class="validation-status">
        <div v-if="isValid" class="status-valid">
          <CheckCircleIcon class="icon" />
          <span>JSON 格式正确</span>
        </div>
        <div v-else class="status-invalid">
          <ExclamationTriangleIcon class="icon" />
          <span>JSON 格式错误</span>
        </div>
      </div>
      
      <div class="editor-stats">
        <span>行数: {{ lineCount }}</span>
        <span>字符数: {{ charCount }}</span>
      </div>
    </div>
    
    <!-- 错误信息 -->
    <div v-if="errors.length > 0" class="error-panel">
      <h4 class="error-title">验证错误</h4>
      <ul class="error-list">
        <li v-for="error in errors" :key="error.field" class="error-item">
          <strong>{{ error.field }}:</strong> {{ error.message }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, nextTick } from 'vue'
import { useResumeStore } from '@/stores/resume'
import { EditorView, basicSetup } from 'codemirror'
import { json } from '@codemirror/lang-json'
import { oneDark } from '@codemirror/theme-one-dark'
import { EditorState } from '@codemirror/state'
import { SelectionRange } from '@codemirror/state'
import {
  DocumentTextIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon
} from '@heroicons/vue/24/outline'

const resumeStore = useResumeStore()
const editorContainer = ref<HTMLElement>()
let editorView: EditorView | null = null

const isValid = computed(() => resumeStore.isResumeValid)
const errors = computed(() => resumeStore.getValidationErrors)
const lineCount = ref(0)
const charCount = ref(0)

// 用于跟踪编辑器状态
const updateTimeout = ref<number>()

// 初始化编辑器
const initEditor = () => {
  if (!editorContainer.value) return

  const initialDoc = resumeStore.exportToJSON()
  
  const state = EditorState.create({
    doc: initialDoc,
    extensions: [
      basicSetup,
      json(),
      oneDark,
      EditorView.updateListener.of((update) => {
        if (update.docChanged) {
          const content = update.state.doc.toString()
          updateStats(content)
          
          // 防抖处理内容变化
          handleContentChange(content)
        }
      }),
      EditorView.theme({
        '&': {
          height: '100%',
          fontSize: '14px'
        },
        '.cm-content': {
          padding: '16px',
          minHeight: '400px'
        },
        '.cm-focused': {
          outline: 'none'
        },
        '.cm-editor': {
          borderRadius: '8px'
        }
      })
    ]
  })

  editorView = new EditorView({
    state,
    parent: editorContainer.value
  })

  updateStats(initialDoc)
}

// 更新统计信息
const updateStats = (content: string) => {
  lineCount.value = content.split('\n').length
  charCount.value = content.length
}

// 处理内容变化
const handleContentChange = (content: string) => {
  try {
    // 防抖处理，避免频繁更新
    clearTimeout(updateTimeout.value)
    updateTimeout.value = setTimeout(() => {
      if (resumeStore.importFromJSON(content)) {
        // JSON 导入成功，数据已更新
      }
    }, 500)
  } catch (error) {
    // 错误会在 store 中处理
  }
}

// 手动更新预览
const updatePreview = () => {
  if (!editorView) return
  
  const content = editorView.state.doc.toString()
  if (resumeStore.importFromJSON(content)) {
    // 可以添加一个成功提示
    console.log('预览已更新')
  }
}

// 格式化 JSON
const formatJson = () => {
  if (!editorView) return
  
  try {
    const content = editorView.state.doc.toString()
    const parsed = JSON.parse(content)
    const formatted = JSON.stringify(parsed, null, 2)
    
    // 保存当前光标位置
    const selection = editorView.state.selection.main
    const cursorPos = selection.from
    
    editorView.dispatch({
      changes: {
        from: 0,
        to: editorView.state.doc.length,
        insert: formatted
      }
    })
    
    // 恢复光标位置
    const newDocLength = editorView.state.doc.length
    const newCursorPos = Math.min(cursorPos, newDocLength)
    
    editorView.dispatch({
      selection: SelectionRange.cursor(newCursorPos)
    })
    
    updateStats(formatted)
    
    // 格式化后自动更新预览
    updatePreview()
  } catch (error) {
    console.error('格式化失败:', error)
  }
}

// 验证 JSON
const validateJson = () => {
  if (!editorView) return
  
  const content = editorView.state.doc.toString()
  resumeStore.importFromJSON(content)
}

// 重置为默认
const resetToDefault = () => {
  if (!editorView) return
  
  if (confirm('确定要重置为默认数据吗？这将丢失当前的所有修改。')) {
    resumeStore.resetToDefault()
    const defaultContent = resumeStore.exportToJSON()
    
    // 保存当前光标位置
    const selection = editorView.state.selection.main
    const cursorPos = selection.from
    
    editorView.dispatch({
      changes: {
        from: 0,
        to: editorView.state.doc.length,
        insert: defaultContent
      }
    })
    
    // 恢复光标位置
    const newDocLength = editorView.state.doc.length
    const newCursorPos = Math.min(cursorPos, newDocLength)
    
    editorView.dispatch({
      selection: SelectionRange.cursor(newCursorPos)
    })
    
    updateStats(defaultContent)
  }
}

onMounted(() => {
  nextTick(() => {
    initEditor()
  })
})
</script>

<style scoped lang="scss">
.json-editor {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--editor-bg, #1e1e1e);
  border-radius: 8px;
  overflow: hidden;
  
  .editor-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    background: var(--editor-header-bg, #2d2d2d);
    border-bottom: 1px solid var(--editor-border, #404040);
    
    .editor-title {
      color: var(--editor-text, #ffffff);
      font-size: 1rem;
      font-weight: 600;
      margin: 0;
    }
    
    .editor-actions {
      display: flex;
      gap: 0.5rem;
      
      .btn {
        display: flex;
        align-items: center;
        gap: 0.25rem;
        padding: 0.5rem 0.75rem;
        border: none;
        border-radius: 4px;
        font-size: 0.875rem;
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
          background: var(--btn-secondary-bg, #404040);
          color: var(--btn-secondary-text, #ffffff);
          
          &:hover {
            background: var(--btn-secondary-hover, #505050);
          }
        }
        
        &.btn-warning {
          background: var(--btn-warning-bg, #f59e0b);
          color: var(--btn-warning-text, #ffffff);
          
          &:hover {
            background: var(--btn-warning-hover, #d97706);
          }
        }
      }
    }
  }
  
  .editor-container {
    flex: 1;
    overflow: hidden;
    
    .editor-wrapper {
      height: 100%;
      
      :deep(.cm-editor) {
        height: 100%;
      }
    }
  }
  
  .editor-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 1rem;
    background: var(--editor-footer-bg, #2d2d2d);
    border-top: 1px solid var(--editor-border, #404040);
    font-size: 0.875rem;
    
    .validation-status {
      .status-valid {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: var(--success-color, #10b981);
        
        .icon {
          width: 1rem;
          height: 1rem;
        }
      }
      
      .status-invalid {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: var(--error-color, #ef4444);
        
        .icon {
          width: 1rem;
          height: 1rem;
        }
      }
    }
    
    .editor-stats {
      display: flex;
      gap: 1rem;
      color: var(--editor-meta, #9ca3af);
    }
  }
  
  .error-panel {
    background: var(--error-panel-bg, #fef2f2);
    border: 1px solid var(--error-border, #fecaca);
    border-radius: 4px;
    padding: 1rem;
    margin: 1rem;
    
    .error-title {
      color: var(--error-color, #dc2626);
      font-size: 0.875rem;
      font-weight: 600;
      margin: 0 0 0.5rem 0;
    }
    
    .error-list {
      list-style: none;
      padding: 0;
      margin: 0;
      
      .error-item {
        color: var(--error-text, #991b1b);
        font-size: 0.875rem;
        margin-bottom: 0.25rem;
        
        &:last-child {
          margin-bottom: 0;
        }
        
        strong {
          font-weight: 600;
        }
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .json-editor {
    .editor-header {
      flex-direction: column;
      gap: 1rem;
      align-items: stretch;
      
      .editor-actions {
        justify-content: center;
      }
    }
    
    .editor-footer {
      flex-direction: column;
      gap: 0.5rem;
      align-items: stretch;
      
      .editor-stats {
        justify-content: center;
      }
    }
  }
}
</style>

