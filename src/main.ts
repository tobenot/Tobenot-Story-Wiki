import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './style.css'

async function bootstrap() {
  const app = createApp(App)
  app.use(router)

  // GitHub Pages SPA 兜底：404.html 会把深链接的真实路径写进 sessionStorage，
  // 应用启动后路由到该路径，实现 history 路由下的深链接直达（无首页闪烁）。
  await router.isReady()
  const redirect = sessionStorage.getItem('redirect')
  if (redirect) {
    sessionStorage.removeItem('redirect')
    await router.replace('/' + redirect)
  }

  app.mount('#app')
}

bootstrap()
