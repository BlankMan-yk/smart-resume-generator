import { defineStore } from 'pinia'
import type { Theme } from '@/types/resume'

export const useThemeStore = defineStore('theme', {
  state: () => ({
    currentTheme: 'liquid-glass',
    availableThemes: [
      {
        id: 'liquid-glass',
        name: '液态玻璃',
        description: '苹果风格的现代玻璃质感',
        preview: '/themes/liquid-glass-preview.jpg'
      },
      {
        id: 'business',
        name: '商务专业',
        description: '简洁专业的商务风格',
        preview: '/themes/business-preview.jpg'
      },
      {
        id: 'creative',
        name: '创意设计',
        description: '适合设计师的创意风格',
        preview: '/themes/creative-preview.jpg'
      },
      {
        id: 'minimal',
        name: '极简主义',
        description: '现代极简设计风格',
        preview: '/themes/minimal-preview.jpg'
      },
      {
        id: 'tech',
        name: '科技未来',
        description: '适合技术岗位的科技风格',
        preview: '/themes/tech-preview.jpg'
      }
    ] as Theme[]
  }),

  getters: {
    getCurrentTheme: (state) => state.currentTheme,
    getAvailableThemes: (state) => state.availableThemes,
    getCurrentThemeInfo: (state) => {
      return state.availableThemes.find(theme => theme.id === state.currentTheme)
    }
  },

  actions: {
    setTheme(themeId: string) {
      if (this.availableThemes.find(theme => theme.id === themeId)) {
        this.currentTheme = themeId
        document.documentElement.setAttribute('data-theme', themeId)
        localStorage.setItem('resume-theme', themeId)
      }
    },

    loadTheme() {
      const savedTheme = localStorage.getItem('resume-theme')
      if (savedTheme && this.availableThemes.find(theme => theme.id === savedTheme)) {
        this.setTheme(savedTheme)
      } else {
        this.setTheme('liquid-glass')
      }
    },

    initializeTheme() {
      this.loadTheme()
    }
  }
})

