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
    path: '/entry/:type/:id(.*)',
    name: 'Entry',
    component: () => import('../views/EntryPage.vue')
  },
  {
    path: '/novels',
    name: 'Novels',
    component: () => import('../views/NovelsPage.vue')
  },
  {
    path: '/games',
    name: 'Games',
    component: () => import('../views/GamesPage.vue')
  },
  // New: Works routes
  {
    path: '/works',
    name: 'WorksIndex',
    component: () => import('../views/WorksPage.vue')
  },
  {
    path: '/works/:workId',
    name: 'WorkDetail',
    component: () => import('../views/WorkDetailPage.vue')
  },
  {
    path: '/works/:workId/parts/:partId',
    name: 'PartDetail',
    component: () => import('../views/PartDetailPage.vue')
  },
  // New: Themes routes
  {
    path: '/themes',
    name: 'ThemesIndex',
    component: () => import('../views/ThemesPage.vue')
  },
  {
    path: '/theme/:themeId',
    name: 'ThemeDetail',
    component: () => import('../views/ThemeDetailPage.vue')
  },
  // Catch-all
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