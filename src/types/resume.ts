// 简历数据类型定义
export interface PersonalInfo {
  name: string
  title: string
  email: string
  phone: string
  location: string
  website?: string
  linkedin?: string
  github?: string
  avatar?: string
  summary: string
}

export interface Experience {
  id: string
  company: string
  position: string
  startDate: string
  endDate?: string
  current: boolean
  location: string
  description: string
  achievements: string[]
  technologies: string[]
}

export interface Education {
  id: string
  institution: string
  degree: string
  major: string
  startDate: string
  endDate: string
  gpa?: string
  honors: string[]
}

export interface SkillItem {
  name: string
  level: number
}

export interface SkillCategory {
  category: string
  items: SkillItem[]
}

export interface Skills {
  technical: SkillCategory[]
  soft: string[]
}

export interface Project {
  id: string
  name: string
  description: string
  technologies: string[]
  url?: string
  github?: string
  startDate: string
  endDate?: string
  highlights: string[]
}

export interface Certification {
  name: string
  issuer: string
  date: string
  url?: string
}

export interface Language {
  name: string
  level: string
}

export interface ResumeData {
  personalInfo: PersonalInfo
  experience: Experience[]
  education: Education[]
  skills: Skills
  projects: Project[]
  certifications: Certification[]
  languages: Language[]
  interests: string[]
  theme: string
  layout: string
  metadata: {
    version: string
    createdAt: string
    updatedAt: string
  }
}

export interface Theme {
  id: string
  name: string
  description: string
  preview: string
}

export interface ValidationError {
  field: string
  message: string
}

