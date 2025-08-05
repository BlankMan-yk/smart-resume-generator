<template>
  <div class="resume-preview" :data-theme="currentTheme">
    <div class="resume-container">
      <!-- 个人信息部分 -->
      <section class="personal-section">
        <div class="personal-header">
          <div class="avatar-container" v-if="resumeData.personalInfo.avatar && resumeData.personalInfo.avatar.trim()">
            <img 
              :src="resumeData.personalInfo.avatar" 
              :alt="resumeData.personalInfo.name" 
              class="avatar" 
              @error="handleImageError"
              @load="handleImageLoad"
            />
          </div>
          <div class="personal-info">
            <h1 class="name">{{ resumeData.personalInfo.name }}</h1>
            <h2 class="title">{{ resumeData.personalInfo.title }}</h2>
            <div class="contact-info">
              <div class="contact-item" v-if="resumeData.personalInfo.email">
                <EnvelopeIcon class="icon" />
                <span>{{ resumeData.personalInfo.email }}</span>
              </div>
              <div class="contact-item" v-if="resumeData.personalInfo.phone">
                <PhoneIcon class="icon" />
                <span>{{ resumeData.personalInfo.phone }}</span>
              </div>
              <div class="contact-item" v-if="resumeData.personalInfo.location">
                <MapPinIcon class="icon" />
                <span>{{ resumeData.personalInfo.location }}</span>
              </div>
              <div class="contact-item" v-if="resumeData.personalInfo.website">
                <GlobeAltIcon class="icon" />
                <a :href="resumeData.personalInfo.website" target="_blank">{{ resumeData.personalInfo.website }}</a>
              </div>
            </div>
          </div>
        </div>
        <div class="summary" v-if="resumeData.personalInfo.summary">
          <p>{{ resumeData.personalInfo.summary }}</p>
        </div>
      </section>

      <!-- 工作经历 -->
      <section class="section" v-if="resumeData.experience.length > 0">
        <h3 class="section-title">工作经历</h3>
        <div class="experience-list">
          <div 
            v-for="exp in resumeData.experience" 
            :key="exp.id" 
            class="experience-item"
          >
            <div class="experience-header">
              <div class="experience-main">
                <h4 class="position">{{ exp.position }}</h4>
                <h5 class="company">{{ exp.company }}</h5>
              </div>
              <div class="experience-meta">
                <span class="date">{{ formatDate(exp.startDate) }} - {{ exp.current ? '至今' : formatDate(exp.endDate) }}</span>
                <span class="location" v-if="exp.location">{{ exp.location }}</span>
              </div>
            </div>
            <p class="description" v-if="exp.description">{{ exp.description }}</p>
            <ul class="achievements" v-if="exp.achievements.length > 0">
              <li v-for="achievement in exp.achievements" :key="achievement">{{ achievement }}</li>
            </ul>
            <div class="technologies" v-if="exp.technologies.length > 0">
              <span class="tech-tag" v-for="tech in exp.technologies" :key="tech">{{ tech }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- 教育背景 -->
      <section class="section" v-if="resumeData.education.length > 0">
        <h3 class="section-title">教育背景</h3>
        <div class="education-list">
          <div 
            v-for="edu in resumeData.education" 
            :key="edu.id" 
            class="education-item"
          >
            <div class="education-header">
              <div class="education-main">
                <h4 class="degree">{{ edu.degree }} - {{ edu.major }}</h4>
                <h5 class="institution">{{ edu.institution }}</h5>
              </div>
              <div class="education-meta">
                <span class="date">{{ formatDate(edu.startDate) }} - {{ formatDate(edu.endDate) }}</span>
                <span class="gpa" v-if="edu.gpa">GPA: {{ edu.gpa }}</span>
              </div>
            </div>
            <div class="honors" v-if="edu.honors.length > 0">
              <span class="honor-tag" v-for="honor in edu.honors" :key="honor">{{ honor }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- 技能 -->
      <section class="section" v-if="resumeData.skills.technical.length > 0 || resumeData.skills.soft.length > 0">
        <h3 class="section-title">专业技能</h3>
        <div class="skills-container">
          <div class="technical-skills" v-if="resumeData.skills.technical.length > 0">
            <div 
              v-for="category in resumeData.skills.technical" 
              :key="category.category"
              class="skill-category"
            >
              <h4 class="category-title">{{ category.category }}</h4>
              <div class="skill-items">
                <div 
                  v-for="skill in category.items" 
                  :key="skill.name"
                  class="skill-item"
                >
                  <span class="skill-name">{{ skill.name }}</span>
                  <div class="skill-bar">
                    <div class="skill-progress" :style="{ width: skill.level + '%' }"></div>
                  </div>
                  <span class="skill-level">{{ skill.level }}%</span>
                </div>
              </div>
            </div>
          </div>
          <div class="soft-skills" v-if="resumeData.skills.soft.length > 0">
            <h4 class="category-title">软技能</h4>
            <div class="soft-skill-tags">
              <span class="soft-skill-tag" v-for="skill in resumeData.skills.soft" :key="skill">{{ skill }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- 项目经历 -->
      <section class="section" v-if="resumeData.projects.length > 0">
        <h3 class="section-title">项目经历</h3>
        <div class="projects-list">
          <div 
            v-for="project in resumeData.projects" 
            :key="project.id" 
            class="project-item"
          >
            <div class="project-header">
              <div class="project-main">
                <h4 class="project-name">{{ project.name }}</h4>
                <div class="project-links">
                  <a v-if="project.url" :href="project.url" target="_blank" class="project-link">
                    <GlobeAltIcon class="icon" />
                    演示
                  </a>
                  <a v-if="project.github" :href="project.github" target="_blank" class="project-link">
                    <CodeBracketIcon class="icon" />
                    代码
                  </a>
                </div>
              </div>
              <div class="project-meta">
                <span class="date">{{ formatDate(project.startDate) }} - {{ project.endDate ? formatDate(project.endDate) : '进行中' }}</span>
              </div>
            </div>
            <p class="project-description">{{ project.description }}</p>
            <div class="project-technologies" v-if="project.technologies.length > 0">
              <span class="tech-tag" v-for="tech in project.technologies" :key="tech">{{ tech }}</span>
            </div>
            <ul class="project-highlights" v-if="project.highlights.length > 0">
              <li v-for="highlight in project.highlights" :key="highlight">{{ highlight }}</li>
            </ul>
          </div>
        </div>
      </section>

      <!-- 其他信息 -->
      <div class="additional-sections">
        <!-- 证书 -->
        <section class="section small-section" v-if="resumeData.certifications.length > 0">
          <h3 class="section-title">证书认证</h3>
          <div class="certifications-list">
            <div 
              v-for="cert in resumeData.certifications" 
              :key="cert.name" 
              class="certification-item"
            >
              <h4 class="cert-name">{{ cert.name }}</h4>
              <p class="cert-issuer">{{ cert.issuer }} - {{ formatDate(cert.date) }}</p>
            </div>
          </div>
        </section>

        <!-- 语言 -->
        <section class="section small-section" v-if="resumeData.languages.length > 0">
          <h3 class="section-title">语言能力</h3>
          <div class="languages-list">
            <div 
              v-for="lang in resumeData.languages" 
              :key="lang.name" 
              class="language-item"
            >
              <span class="lang-name">{{ lang.name }}</span>
              <span class="lang-level">{{ lang.level }}</span>
            </div>
          </div>
        </section>

        <!-- 兴趣爱好 -->
        <section class="section small-section" v-if="resumeData.interests.length > 0">
          <h3 class="section-title">兴趣爱好</h3>
          <div class="interests-list">
            <span class="interest-tag" v-for="interest in resumeData.interests" :key="interest">{{ interest }}</span>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useResumeStore } from '@/stores/resume'
import { useThemeStore } from '@/stores/theme'
import {
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  GlobeAltIcon,
  CodeBracketIcon
} from '@heroicons/vue/24/outline'

const resumeStore = useResumeStore()
const themeStore = useThemeStore()

const resumeData = computed(() => resumeStore.getResumeData)
const currentTheme = computed(() => themeStore.getCurrentTheme)

const formatDate = (dateString: string | undefined): string => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit' })
}

// 处理图片加载错误
const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.style.display = 'none'
  console.warn('头像图片加载失败:', img.src)
}

// 处理图片加载成功
const handleImageLoad = (event: Event) => {
  const img = event.target as HTMLImageElement
  if (img.naturalWidth === 0 || img.naturalHeight === 0) {
    img.style.display = 'none'
    console.warn('头像图片尺寸无效:', img.src)
  }
}
</script>

<style scoped lang="scss">
.resume-preview {
  width: 100%;
  min-height: 100vh;
  padding: 2rem;
  background: var(--preview-bg, #f5f5f5);
  
  .resume-container {
    max-width: 210mm; // A4 width
    margin: 0 auto;
    background: var(--resume-bg, #ffffff);
    box-shadow: var(--resume-shadow, 0 4px 20px rgba(0, 0, 0, 0.1));
    border-radius: var(--resume-border-radius, 8px);
    overflow: hidden;
    
    .personal-section {
      padding: 2rem;
      background: var(--personal-bg, linear-gradient(135deg, #667eea 0%, #764ba2 100%));
      color: var(--personal-text, white);
      
      .personal-header {
        display: flex;
        align-items: flex-start;
        gap: 1.5rem;
        margin-bottom: 1.5rem;
        
        .avatar-container {
          flex-shrink: 0;
          
          .avatar {
            width: 120px;
            height: 120px;
            border-radius: 50%;
            object-fit: cover;
            border: 4px solid rgba(255, 255, 255, 0.2);
          }
        }
        
        .personal-info {
          flex: 1;
          
          .name {
            font-size: 2.5rem;
            font-weight: 700;
            margin: 0 0 0.5rem 0;
            line-height: 1.2;
          }
          
          .title {
            font-size: 1.25rem;
            font-weight: 400;
            margin: 0 0 1rem 0;
            opacity: 0.9;
          }
          
          .contact-info {
            display: flex;
            flex-wrap: wrap;
            gap: 1rem;
            
            .contact-item {
              display: flex;
              align-items: center;
              gap: 0.5rem;
              
              .icon {
                width: 1rem;
                height: 1rem;
                opacity: 0.8;
              }
              
              a {
                color: inherit;
                text-decoration: none;
                
                &:hover {
                  text-decoration: underline;
                }
              }
            }
          }
        }
      }
      
      .summary {
        font-size: 1rem;
        line-height: 1.6;
        opacity: 0.95;
      }
    }
    
    .section {
      padding: 2rem;
      border-bottom: 1px solid var(--border-color, #e5e7eb);
      
      &:last-child {
        border-bottom: none;
      }
      
      .section-title {
        font-size: 1.5rem;
        font-weight: 600;
        color: var(--heading-color, #1f2937);
        margin: 0 0 1.5rem 0;
        padding-bottom: 0.5rem;
        border-bottom: 2px solid var(--accent-color, #667eea);
      }
    }
    
    .experience-list,
    .education-list,
    .projects-list {
      .experience-item,
      .education-item,
      .project-item {
        margin-bottom: 2rem;
        
        &:last-child {
          margin-bottom: 0;
        }
        
        .experience-header,
        .education-header,
        .project-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
          
          .experience-main,
          .education-main,
          .project-main {
            flex: 1;
            
            h4 {
              font-size: 1.125rem;
              font-weight: 600;
              color: var(--heading-color, #1f2937);
              margin: 0 0 0.25rem 0;
            }
            
            h5 {
              font-size: 1rem;
              font-weight: 500;
              color: var(--subheading-color, #6b7280);
              margin: 0;
            }
            
            .project-links {
              display: flex;
              gap: 1rem;
              margin-top: 0.5rem;
              
              .project-link {
                display: flex;
                align-items: center;
                gap: 0.25rem;
                color: var(--accent-color, #667eea);
                text-decoration: none;
                font-size: 0.875rem;
                
                .icon {
                  width: 1rem;
                  height: 1rem;
                }
                
                &:hover {
                  text-decoration: underline;
                }
              }
            }
          }
          
          .experience-meta,
          .education-meta,
          .project-meta {
            text-align: right;
            font-size: 0.875rem;
            color: var(--meta-color, #6b7280);
            
            .date {
              display: block;
              font-weight: 500;
            }
            
            .location,
            .gpa {
              display: block;
              margin-top: 0.25rem;
            }
          }
        }
        
        .description,
        .project-description {
          color: var(--text-color, #374151);
          line-height: 1.6;
          margin-bottom: 1rem;
        }
        
        .achievements,
        .project-highlights {
          list-style: none;
          padding: 0;
          margin: 0 0 1rem 0;
          
          li {
            position: relative;
            padding-left: 1.5rem;
            margin-bottom: 0.5rem;
            color: var(--text-color, #374151);
            line-height: 1.5;
            
            &::before {
              content: '•';
              position: absolute;
              left: 0;
              color: var(--accent-color, #667eea);
              font-weight: bold;
            }
          }
        }
        
        .technologies,
        .project-technologies {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          
          .tech-tag {
            background: var(--tag-bg, #f3f4f6);
            color: var(--tag-text, #374151);
            padding: 0.25rem 0.75rem;
            border-radius: 1rem;
            font-size: 0.75rem;
            font-weight: 500;
          }
        }
        
        .honors {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          
          .honor-tag {
            background: var(--honor-bg, #fef3c7);
            color: var(--honor-text, #92400e);
            padding: 0.25rem 0.75rem;
            border-radius: 1rem;
            font-size: 0.75rem;
            font-weight: 500;
          }
        }
      }
    }
    
    .skills-container {
      .technical-skills {
        margin-bottom: 2rem;
        
        .skill-category {
          margin-bottom: 1.5rem;
          
          .category-title {
            font-size: 1rem;
            font-weight: 600;
            color: var(--heading-color, #1f2937);
            margin: 0 0 1rem 0;
          }
          
          .skill-items {
            display: grid;
            gap: 0.75rem;
            
            .skill-item {
              display: grid;
              grid-template-columns: 1fr 2fr auto;
              align-items: center;
              gap: 1rem;
              
              .skill-name {
                font-weight: 500;
                color: var(--text-color, #374151);
              }
              
              .skill-bar {
                height: 8px;
                background: var(--skill-bar-bg, #e5e7eb);
                border-radius: 4px;
                overflow: hidden;
                
                .skill-progress {
                  height: 100%;
                  background: var(--accent-color, #667eea);
                  border-radius: 4px;
                  transition: width 0.3s ease;
                }
              }
              
              .skill-level {
                font-size: 0.875rem;
                color: var(--meta-color, #6b7280);
                font-weight: 500;
              }
            }
          }
        }
      }
      
      .soft-skills {
        .category-title {
          font-size: 1rem;
          font-weight: 600;
          color: var(--heading-color, #1f2937);
          margin: 0 0 1rem 0;
        }
        
        .soft-skill-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          
          .soft-skill-tag {
            background: var(--soft-skill-bg, #ede9fe);
            color: var(--soft-skill-text, #6d28d9);
            padding: 0.5rem 1rem;
            border-radius: 1rem;
            font-size: 0.875rem;
            font-weight: 500;
          }
        }
      }
    }
    
    .additional-sections {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 0;
      
      .small-section {
        padding: 1.5rem 2rem;
        
        .section-title {
          font-size: 1.25rem;
          margin-bottom: 1rem;
        }
        
        .certifications-list {
          .certification-item {
            margin-bottom: 1rem;
            
            .cert-name {
              font-size: 1rem;
              font-weight: 600;
              color: var(--heading-color, #1f2937);
              margin: 0 0 0.25rem 0;
            }
            
            .cert-issuer {
              font-size: 0.875rem;
              color: var(--meta-color, #6b7280);
              margin: 0;
            }
          }
        }
        
        .languages-list {
          .language-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.5rem 0;
            border-bottom: 1px solid var(--border-color, #e5e7eb);
            
            &:last-child {
              border-bottom: none;
            }
            
            .lang-name {
              font-weight: 500;
              color: var(--text-color, #374151);
            }
            
            .lang-level {
              font-size: 0.875rem;
              color: var(--meta-color, #6b7280);
            }
          }
        }
        
        .interests-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          
          .interest-tag {
            background: var(--interest-bg, #f0f9ff);
            color: var(--interest-text, #0369a1);
            padding: 0.5rem 1rem;
            border-radius: 1rem;
            font-size: 0.875rem;
            font-weight: 500;
          }
        }
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .resume-preview {
    padding: 1rem;
    
    .resume-container {
      .personal-section {
        padding: 1.5rem;
        
        .personal-header {
          flex-direction: column;
          text-align: center;
          
          .personal-info {
            .contact-info {
              justify-content: center;
            }
          }
        }
      }
      
      .section {
        padding: 1.5rem;
      }
      
      .experience-header,
      .education-header,
      .project-header {
        flex-direction: column;
        gap: 0.5rem;
        
        .experience-meta,
        .education-meta,
        .project-meta {
          text-align: left;
        }
      }
      
      .additional-sections {
        grid-template-columns: 1fr;
      }
    }
  }
}
</style>

