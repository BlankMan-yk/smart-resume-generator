<template>
  <div class="theme-switcher">
    <button 
      @click="toggleDropdown" 
      class="theme-button"
      :class="{ active: isDropdownOpen }"
    >
      <SwatchIcon class="icon" />
      <span class="theme-name">{{ currentThemeInfo?.name || '选择主题' }}</span>
      <ChevronDownIcon class="chevron" :class="{ rotated: isDropdownOpen }" />
    </button>
    
    <Transition name="dropdown">
      <div v-if="isDropdownOpen" class="theme-dropdown">
        <div class="dropdown-header">
          <h3>选择主题</h3>
          <p>选择一个适合你的简历主题</p>
        </div>
        
        <div class="theme-grid">
          <div 
            v-for="theme in availableThemes" 
            :key="theme.id"
            class="theme-card"
            :class="{ active: theme.id === currentTheme }"
            @click="selectTheme(theme.id)"
          >
            <div class="theme-preview">
              <div class="preview-placeholder" :data-theme="theme.id">
                <div class="preview-header"></div>
                <div class="preview-content">
                  <div class="preview-line long"></div>
                  <div class="preview-line medium"></div>
                  <div class="preview-line short"></div>
                </div>
              </div>
            </div>
            
            <div class="theme-info">
              <h4 class="theme-title">{{ theme.name }}</h4>
              <p class="theme-description">{{ theme.description }}</p>
            </div>
            
            <div v-if="theme.id === currentTheme" class="theme-selected">
              <CheckIcon class="check-icon" />
            </div>
          </div>
        </div>
      </div>
    </Transition>
    
    <!-- 背景遮罩 -->
    <div 
      v-if="isDropdownOpen" 
      class="dropdown-backdrop"
      @click="closeDropdown"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useThemeStore } from '@/stores/theme'
import {
  SwatchIcon,
  ChevronDownIcon,
  CheckIcon
} from '@heroicons/vue/24/outline'

const themeStore = useThemeStore()
const isDropdownOpen = ref(false)

const currentTheme = computed(() => themeStore.getCurrentTheme)
const availableThemes = computed(() => themeStore.getAvailableThemes)
const currentThemeInfo = computed(() => themeStore.getCurrentThemeInfo)

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

const closeDropdown = () => {
  isDropdownOpen.value = false
}

const selectTheme = (themeId: string) => {
  themeStore.setTheme(themeId)
  closeDropdown()
}

// 点击外部关闭下拉菜单
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('.theme-switcher')) {
    closeDropdown()
  }
}

// ESC 键关闭下拉菜单
const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    closeDropdown()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('keydown', handleKeyDown)
})
</script>

<style scoped lang="scss">
.theme-switcher {
  position: relative;
  
  .theme-button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    background: var(--button-bg, #ffffff);
    border: 1px solid var(--button-border, #d1d5db);
    border-radius: 8px;
    color: var(--button-text, #374151);
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    min-width: 160px;
    
    &:hover {
      background: var(--button-hover-bg, #f9fafb);
      border-color: var(--button-hover-border, #9ca3af);
    }
    
    &.active {
      background: var(--button-active-bg, #f3f4f6);
      border-color: var(--button-active-border, #6b7280);
    }
    
    .icon {
      width: 1.25rem;
      height: 1.25rem;
      flex-shrink: 0;
    }
    
    .theme-name {
      flex: 1;
      text-align: left;
    }
    
    .chevron {
      width: 1rem;
      height: 1rem;
      transition: transform 0.2s ease;
      flex-shrink: 0;
      
      &.rotated {
        transform: rotate(180deg);
      }
    }
  }
  
  .theme-dropdown {
    position: absolute;
    top: calc(100% + 0.5rem);
    left: 0;
    right: 0;
    background: var(--dropdown-bg, #ffffff);
    border: 1px solid var(--dropdown-border, #e5e7eb);
    border-radius: 12px;
    box-shadow: var(--dropdown-shadow, 0 10px 25px rgba(0, 0, 0, 0.1));
    z-index: 1000;
    min-width: 400px;
    max-height: 80vh;
    overflow-y: auto;
    
    .dropdown-header {
      padding: 1.5rem 1.5rem 1rem 1.5rem;
      border-bottom: 1px solid var(--dropdown-border, #e5e7eb);
      
      h3 {
        font-size: 1.125rem;
        font-weight: 600;
        color: var(--heading-color, #111827);
        margin: 0 0 0.25rem 0;
      }
      
      p {
        font-size: 0.875rem;
        color: var(--text-secondary, #6b7280);
        margin: 0;
      }
    }
    
    .theme-grid {
      padding: 1rem;
      display: grid;
      gap: 1rem;
      
      .theme-card {
        position: relative;
        padding: 1rem;
        border: 2px solid var(--card-border, #e5e7eb);
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s ease;
        background: var(--card-bg, #ffffff);
        
        &:hover {
          border-color: var(--card-hover-border, #d1d5db);
          box-shadow: var(--card-hover-shadow, 0 4px 12px rgba(0, 0, 0, 0.05));
        }
        
        &.active {
          border-color: var(--accent-color, #667eea);
          box-shadow: var(--card-active-shadow, 0 0 0 3px rgba(102, 126, 234, 0.1));
        }
        
        .theme-preview {
          margin-bottom: 1rem;
          
          .preview-placeholder {
            height: 120px;
            border-radius: 6px;
            padding: 1rem;
            position: relative;
            overflow: hidden;
            
            // 液态玻璃主题预览
            &[data-theme="liquid-glass"] {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              
              .preview-header {
                height: 20px;
                background: rgba(255, 255, 255, 0.2);
                border-radius: 4px;
                margin-bottom: 0.75rem;
                backdrop-filter: blur(4px);
              }
              
              .preview-line {
                height: 8px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 4px;
                margin-bottom: 0.5rem;
                backdrop-filter: blur(2px);
                
                &.long { width: 100%; }
                &.medium { width: 75%; }
                &.short { width: 50%; }
              }
            }
            
            // 商务主题预览
            &[data-theme="business"] {
              background: #f8f9fa;
              border: 1px solid #e9ecef;
              
              .preview-header {
                height: 20px;
                background: #2c3e50;
                border-radius: 4px;
                margin-bottom: 0.75rem;
              }
              
              .preview-line {
                height: 8px;
                background: #6c757d;
                border-radius: 2px;
                margin-bottom: 0.5rem;
                
                &.long { width: 100%; }
                &.medium { width: 75%; }
                &.short { width: 50%; }
              }
            }
            
            // 创意主题预览
            &[data-theme="creative"] {
              background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1);
              
              .preview-header {
                height: 20px;
                background: rgba(255, 255, 255, 0.9);
                border-radius: 10px;
                margin-bottom: 0.75rem;
              }
              
              .preview-line {
                height: 8px;
                background: rgba(255, 255, 255, 0.8);
                border-radius: 4px;
                margin-bottom: 0.5rem;
                
                &.long { width: 100%; }
                &.medium { width: 75%; }
                &.short { width: 50%; }
              }
            }
            
            // 极简主题预览
            &[data-theme="minimal"] {
              background: #ffffff;
              border: 1px solid #f0f0f0;
              
              .preview-header {
                height: 20px;
                background: #000000;
                border-radius: 0;
                margin-bottom: 0.75rem;
              }
              
              .preview-line {
                height: 8px;
                background: #333333;
                border-radius: 0;
                margin-bottom: 0.5rem;
                
                &.long { width: 100%; }
                &.medium { width: 75%; }
                &.short { width: 50%; }
              }
            }
            
            // 科技主题预览
            &[data-theme="tech"] {
              background: #0f172a;
              border: 1px solid #1e293b;
              
              .preview-header {
                height: 20px;
                background: linear-gradient(90deg, #00ff88, #00ccff);
                border-radius: 4px;
                margin-bottom: 0.75rem;
              }
              
              .preview-line {
                height: 8px;
                background: #64748b;
                border-radius: 4px;
                margin-bottom: 0.5rem;
                
                &.long { width: 100%; }
                &.medium { width: 75%; }
                &.short { width: 50%; }
              }
            }
          }
        }
        
        .theme-info {
          .theme-title {
            font-size: 1rem;
            font-weight: 600;
            color: var(--heading-color, #111827);
            margin: 0 0 0.25rem 0;
          }
          
          .theme-description {
            font-size: 0.875rem;
            color: var(--text-secondary, #6b7280);
            margin: 0;
            line-height: 1.4;
          }
        }
        
        .theme-selected {
          position: absolute;
          top: 0.75rem;
          right: 0.75rem;
          width: 1.5rem;
          height: 1.5rem;
          background: var(--accent-color, #667eea);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          
          .check-icon {
            width: 1rem;
            height: 1rem;
            color: white;
          }
        }
      }
    }
  }
  
  .dropdown-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 999;
  }
}

// 下拉动画
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}

.dropdown-enter-to,
.dropdown-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
}

// 响应式设计
@media (max-width: 768px) {
  .theme-switcher {
    .theme-dropdown {
      min-width: 300px;
      max-width: 90vw;
      left: 50%;
      transform: translateX(-50%);
      
      .theme-grid {
        .theme-card {
          .theme-preview {
            .preview-placeholder {
              height: 80px;
            }
          }
        }
      }
    }
  }
}
</style>

