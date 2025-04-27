<!-- src/App.vue -->
<template>
  <div class="min-h-screen bg-white bg-fixed relative overflow-hidden">
    <!-- 浅灰色背景层 -->
    <div class="absolute inset-0 bg-gray-50/70"></div>
    <div class="absolute inset-0 bg-gray-100/30"></div>
    
    <!-- 极简几何图案 - 模仿图片中的魔法阵效果 -->
    <div class="absolute inset-0 pointer-events-none overflow-hidden">
      <div class="magic-circle"></div>
    </div>
    
    <!-- 流动星光特效 -->
    <div class="absolute inset-0 pointer-events-none overflow-hidden">
      <div class="absolute top-0 left-0 w-full h-full">
        <div class="star-particle"></div>
        <div class="star-particle delay-2"></div>
        <div class="star-particle delay-4"></div>
        <div class="star-particle delay-3 small"></div>
        <div class="star-particle delay-5 small"></div>
        <div class="star-particle delay-1 small"></div>
        <div class="star-particle delay-6"></div>
        <div class="star-particle delay-7 small"></div>
        <div class="star-particle delay-8"></div>
      </div>
    </div>
    
    <!-- 主要内容区域 -->
    <div class="relative z-10 min-h-screen text-gray-800 dark:text-gray-200">
      <router-view />
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';

// 检查系统主题偏好和已保存的设置
onMounted(() => {
  if (
    localStorage.theme === 'dark' || 
    (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
  ) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
});
</script>

<style>
/* 全局样式和星光效果 */
:root {
  --star-color: rgba(170, 137, 74, 0.4); /* 淡金色星光 */
  --star-tail-length: 6em;
  --star-tail-height: 2px;
  --star-width: 3px;
  --star-delay-range: 5s;
  /* 使用白/灰/金色系 */
  --cosmic-primary: #FFFFFF; /* 纯白色 */
  --cosmic-secondary: #F5F5F8; /* cosmic-50 - 几乎纯白 */
  --starlight-primary: #AA894A; /* starlight-500 */
  --starlight-secondary: #E9D4A4; /* starlight-200 */
}

body {
  margin: 0;
  overflow-x: hidden;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  background-color: var(--cosmic-primary);
}

/* 背景渐变 - 改为白色/浅灰色调 */
.bg-cosmic-gradient {
  background: linear-gradient(to bottom, #FFFFFF, #F5F5F8);
}

/* 魔法阵设计 - 改为金色调 */
.magic-circle {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60vh;
  height: 60vh;
  border: 1px solid rgba(170, 137, 74, 0.25); /* starlight-500 with alpha */
  border-radius: 50%;
  box-shadow: 0 0 60px rgba(170, 137, 74, 0.1); /* starlight-500 with alpha */
  opacity: 0.7;
}

.magic-circle::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 45vh;
  height: 45vh;
  border: 1px solid rgba(219, 189, 125, 0.2); /* starlight-300 with alpha */
  border-radius: 50%;
}

.magic-circle::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 30vh;
  height: 30vh;
  border: 1px solid rgba(170, 137, 74, 0.25); /* starlight-500 with alpha */
  border-radius: 50%;
}

/* 定义流动星光粒子 - 使用新的 --star-color */
.star-particle {
  position: absolute;
  top: 50%;
  left: 50%;
  width: var(--star-width);
  height: var(--star-width);
  background: transparent;
  border-radius: 50%;
  filter: drop-shadow(0 0 6px var(--star-color));
  animation: tail-fade 2s ease-in-out infinite, falling 5s linear infinite;
  transform-origin: center;
}

.star-particle::before, .star-particle::after {
  content: '';
  position: absolute;
  top: calc(var(--star-width) / -2);
  left: calc(var(--star-width) / -2);
  width: var(--star-width);
  height: var(--star-width);
  background: var(--star-color);
  border-radius: 50%;
  transform: rotate(45deg);
}

.star-particle::after {
  transform: rotate(90deg);
}

.star-particle.small {
  width: calc(var(--star-width) * 0.6);
  height: calc(var(--star-width) * 0.6);
}

.delay-1 { animation-delay: 1s; }
.delay-2 { animation-delay: 2s; }
.delay-3 { animation-delay: 3s; }
.delay-4 { animation-delay: 4s; }
.delay-5 { animation-delay: 5s; }
.delay-6 { animation-delay: 6s; }
.delay-7 { animation-delay: 7s; }
.delay-8 { animation-delay: 8s; }

@keyframes tail-fade {
  0%, 100% { 
    width: 0; 
    opacity: 0;
  }
  
  40% { 
    width: var(--star-tail-length);
    opacity: 1;
  }
  
  70%, 100% { 
    width: 0;
    opacity: 0;
  }
}

@keyframes falling {
  0% {
    transform: translateX(0) translateY(0);
  }
  100% {
    transform: translateX(25vw) translateY(100vh);
  }
}

/* 为适用于全应用程序的组件样式 */
.btn {
  @apply inline-flex items-center px-4 py-2 rounded-lg transition-all duration-300 font-medium text-sm;
}

.btn-primary {
  @apply bg-secondary-600 hover:bg-secondary-700 focus:ring-2 focus:ring-offset-2 focus:ring-secondary-500 text-white shadow-md shadow-secondary-900/30;
}

.btn-secondary {
  @apply bg-gray-100 hover:bg-gray-200 text-gray-800 shadow-sm border border-gray-200/80 backdrop-blur-sm;
}

.wiki-card {
  @apply bg-white/90 backdrop-blur-sm rounded-lg border border-gray-100 shadow-sm transition-all duration-300 overflow-hidden text-inherit no-underline;
}

.wiki-card:hover {
  @apply border-starlight-400/50 shadow-starlight transform -translate-y-1;
}
</style>