import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        title: '智能简历生成器'
      }
    }
  ]
})

// 设置页面标题
router.beforeEach((to) => {
  document.title = to.meta.title as string || '智能简历生成器'
})

export default router
