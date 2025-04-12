import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/HomePage.vue')
  },
  {
    path: '/category/:type',
    name: 'Category',
    component: () => import('../views/CategoryPage.vue')
  },
  {
    path: '/entry/:type/:id',
    name: 'Entry',
    component: () => import('../views/EntryPage.vue')
  },
  // 添加一个通配符路由，捕获所有未匹配的路由
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router 