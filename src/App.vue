<script setup lang="ts">
// 无需导入不存在的组件
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

onMounted(() => {
  // 检查是否有重定向
  const redirect = sessionStorage.getItem('redirect');
  if (redirect) {
    sessionStorage.removeItem('redirect');
    // 使用哈希路由重定向
    router.push('/' + redirect);
  }
});
</script>

<template>
  <div class="app">
    <header class="header">
      <div class="container">
        <router-link to="/" class="logo">Tobenot Wiki</router-link>
        <nav class="main-nav">
          <router-link to="/" class="nav-link">首页</router-link>
          <router-link to="/category/characters" class="nav-link">人物</router-link>
          <router-link to="/category/locations" class="nav-link">地点</router-link>
          <router-link to="/category/events" class="nav-link">事件</router-link>
        </nav>
      </div>
    </header>
    
    <main class="main-content">
      <router-view />
    </main>
    
    <footer class="footer">
      <div class="container">
        <p>&copy; {{ new Date().getFullYear() }} Tobenot Wiki. 保留所有权利。</p>
      </div>
    </footer>
  </div>
</template>

<style>
/* 重置基础样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
  line-height: 1.6;
  color: #333;
  background-color: #f8f9fa;
}

.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* 应用布局 */
.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex: 1;
}

/* 头部样式 */
.header {
  background-color: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 1rem 0;
}

.header .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  text-decoration: none;
}

.main-nav {
  display: flex;
  gap: 1.5rem;
}

.nav-link {
  color: #555;
  text-decoration: none;
  padding: 0.5rem 0;
  position: relative;
}

.nav-link:hover {
  color: #000;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background-color: #333;
  transition: width 0.3s;
}

.nav-link:hover::after,
.router-link-active::after {
  width: 100%;
}

/* 页脚样式 */
.footer {
  background-color: #333;
  color: #fff;
  padding: 2rem 0;
  margin-top: 3rem;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .header .container {
    flex-direction: column;
    gap: 1rem;
  }
  
  .main-nav {
    width: 100%;
    justify-content: center;
  }
}
</style>
