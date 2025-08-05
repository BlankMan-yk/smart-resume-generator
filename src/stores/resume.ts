import { defineStore } from 'pinia'
import type { ResumeData, ValidationError } from '@/types/resume'

const defaultResumeData: ResumeData = {
  personalInfo: {
    name: '张三',
    title: '前端开发工程师',
    email: 'zhangsan@example.com',
    phone: '+86 138-0000-0000',
    location: '北京市',
    website: 'https://zhangsan.dev',
    linkedin: 'https://linkedin.com/in/zhangsan',
    github: 'https://github.com/zhangsan',
    avatar: '',
    summary: '具有5年前端开发经验的工程师，专注于Vue.js和React技术栈，热爱开源项目，具备良好的团队协作能力和技术领导力。'
  },
  experience: [
    {
      id: 'exp1',
      company: '阿里巴巴集团',
      position: '高级前端开发工程师',
      startDate: '2022-03',
      endDate: '',
      current: true,
      location: '杭州市',
      description: '负责电商平台前端架构设计和核心功能开发',
      achievements: [
        '主导重构了商品详情页，页面加载速度提升40%',
        '设计并实现了组件库，被团队广泛使用',
        '指导3名初级开发者，提升团队整体技术水平'
      ],
      technologies: ['Vue.js', 'TypeScript', 'Webpack', 'Element Plus']
    },
    {
      id: 'exp2',
      company: '腾讯科技',
      position: '前端开发工程师',
      startDate: '2020-06',
      endDate: '2022-02',
      current: false,
      location: '深圳市',
      description: '参与微信小程序和H5项目开发',
      achievements: [
        '开发了多个高质量的微信小程序',
        '优化了H5页面性能，首屏加载时间减少30%',
        '参与制定前端开发规范和最佳实践'
      ],
      technologies: ['React', 'JavaScript', 'Sass', 'Ant Design']
    }
  ],
  education: [
    {
      id: 'edu1',
      institution: '清华大学',
      degree: '学士',
      major: '计算机科学与技术',
      startDate: '2016-09',
      endDate: '2020-06',
      gpa: '3.8/4.0',
      honors: ['优秀毕业生', '国家奖学金']
    }
  ],
  skills: {
    technical: [
      {
        category: '编程语言',
        items: [
          { name: 'JavaScript', level: 95 },
          { name: 'TypeScript', level: 90 },
          { name: 'Python', level: 75 },
          { name: 'Java', level: 70 }
        ]
      },
      {
        category: '前端框架',
        items: [
          { name: 'Vue.js', level: 95 },
          { name: 'React', level: 85 },
          { name: 'Angular', level: 70 }
        ]
      },
      {
        category: '工具与技术',
        items: [
          { name: 'Webpack', level: 85 },
          { name: 'Vite', level: 90 },
          { name: 'Git', level: 90 },
          { name: 'Docker', level: 75 }
        ]
      }
    ],
    soft: ['团队协作', '项目管理', '技术分享', '问题解决', '持续学习']
  },
  projects: [
    {
      id: 'proj1',
      name: '智能简历生成器',
      description: '基于Vue.js的在线简历生成工具，支持多主题切换和JSON数据导入导出',
      technologies: ['Vue.js', 'TypeScript', 'Pinia', 'SCSS'],
      url: 'https://resume-generator.example.com',
      github: 'https://github.com/zhangsan/resume-generator',
      startDate: '2024-01',
      endDate: '2024-03',
      highlights: [
        '实现了5种不同风格的主题',
        '支持实时预览和PDF导出',
        '获得了1000+用户使用'
      ]
    },
    {
      id: 'proj2',
      name: '电商管理后台',
      description: '基于React的电商平台管理系统，包含商品管理、订单处理、数据分析等功能',
      technologies: ['React', 'Ant Design', 'Redux', 'Echarts'],
      url: 'https://admin.shop.example.com',
      startDate: '2023-06',
      endDate: '2023-12',
      highlights: [
        '支持大数据量的商品管理',
        '实现了实时数据监控',
        '提升了运营效率50%'
      ]
    }
  ],
  certifications: [
    {
      name: 'AWS Certified Developer',
      issuer: 'Amazon Web Services',
      date: '2023-08',
      url: 'https://aws.amazon.com/certification/'
    }
  ],
  languages: [
    { name: '中文', level: '母语' },
    { name: '英语', level: '流利' },
    { name: '日语', level: '基础' }
  ],
  interests: ['开源贡献', '技术博客', '摄影', '旅行', '阅读'],
  theme: 'liquid-glass',
  layout: 'standard',
  metadata: {
    version: '1.0',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
}

export const useResumeStore = defineStore('resume', {
  state: () => ({
    resumeData: { ...defaultResumeData },
    isValid: true,
    errors: [] as ValidationError[]
  }),

  getters: {
    getResumeData: (state) => state.resumeData,
    getValidationErrors: (state) => state.errors,
    isResumeValid: (state) => state.isValid
  },

  actions: {
    updateResumeData(newData: Partial<ResumeData>) {
      this.resumeData = { ...this.resumeData, ...newData }
      this.resumeData.metadata.updatedAt = new Date().toISOString()
      this.validateData()
    },

    updatePersonalInfo(personalInfo: Partial<typeof this.resumeData.personalInfo>) {
      this.resumeData.personalInfo = { ...this.resumeData.personalInfo, ...personalInfo }
      this.resumeData.metadata.updatedAt = new Date().toISOString()
      this.validateData()
    },

    addExperience(experience: Omit<typeof this.resumeData.experience[0], 'id'>) {
      const newExperience = {
        ...experience,
        id: `exp_${Date.now()}`
      }
      this.resumeData.experience.push(newExperience)
      this.resumeData.metadata.updatedAt = new Date().toISOString()
    },

    updateExperience(id: string, experience: Partial<typeof this.resumeData.experience[0]>) {
      const index = this.resumeData.experience.findIndex(exp => exp.id === id)
      if (index !== -1) {
        this.resumeData.experience[index] = { ...this.resumeData.experience[index], ...experience }
        this.resumeData.metadata.updatedAt = new Date().toISOString()
      }
    },

    removeExperience(id: string) {
      this.resumeData.experience = this.resumeData.experience.filter(exp => exp.id !== id)
      this.resumeData.metadata.updatedAt = new Date().toISOString()
    },

    validateData() {
      this.errors = []
      this.isValid = true

      // 验证必填字段
      if (!this.resumeData.personalInfo.name?.trim()) {
        this.errors.push({ field: 'personalInfo.name', message: '姓名为必填项' })
        this.isValid = false
      }

      if (!this.resumeData.personalInfo.email?.trim()) {
        this.errors.push({ field: 'personalInfo.email', message: '邮箱为必填项' })
        this.isValid = false
      }

      // 验证邮箱格式
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (this.resumeData.personalInfo.email && 
          !emailRegex.test(this.resumeData.personalInfo.email)) {
        this.errors.push({ field: 'personalInfo.email', message: '邮箱格式不正确' })
        this.isValid = false
      }

      // 验证电话格式
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
      if (this.resumeData.personalInfo.phone && 
          !phoneRegex.test(this.resumeData.personalInfo.phone.replace(/[\s\-\(\)]/g, ''))) {
        this.errors.push({ field: 'personalInfo.phone', message: '电话格式不正确' })
        this.isValid = false
      }
    },

    exportToJSON(): string {
      return JSON.stringify(this.resumeData, null, 2)
    },

    importFromJSON(jsonString: string): boolean {
      try {
        const data = JSON.parse(jsonString) as ResumeData
        
        // 基本数据结构验证
        if (!data.personalInfo || !data.experience || !data.education) {
          throw new Error('JSON数据结构不完整')
        }

        this.updateResumeData(data)
        return true
      } catch (error) {
        this.errors.push({ 
          field: 'json', 
          message: `JSON格式错误：${error instanceof Error ? error.message : '未知错误'}` 
        })
        this.isValid = false
        return false
      }
    },

    resetToDefault() {
      this.resumeData = { ...defaultResumeData }
      this.resumeData.metadata.createdAt = new Date().toISOString()
      this.resumeData.metadata.updatedAt = new Date().toISOString()
      this.validateData()
    }
  }
})

