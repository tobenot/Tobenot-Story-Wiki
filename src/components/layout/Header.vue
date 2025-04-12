<template>
  <header class="sticky top-0 z-50 w-full bg-white shadow-sm dark:bg-slate-800 dark:border-b dark:border-slate-700">
    <div class="container mx-auto px-4 py-4 flex justify-between items-center">
      <router-link to="/" class="flex items-center space-x-2">
        <span class="font-serif text-xl font-bold text-primary-700 dark:text-primary-400">托贝诺特Wiki</span>
      </router-link>
      
      <div class="flex items-center space-x-4">
        <nav class="hidden md:flex space-x-6">
          <router-link to="/category/characters" class="text-slate-600 hover:text-primary-600 dark:text-slate-300 dark:hover:text-primary-400">人物</router-link>
          <router-link to="/category/locations" class="text-slate-600 hover:text-primary-600 dark:text-slate-300 dark:hover:text-primary-400">地点</router-link>
          <router-link to="/category/events" class="text-slate-600 hover:text-primary-600 dark:text-slate-300 dark:hover:text-primary-400">事件</router-link>
        </nav>
        
        <button class="theme-toggle p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700" @click="toggleTheme">
          <span v-if="isDark" class="block w-5 h-5">
            <!-- Sun Icon -->
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </span>
          <span v-else class="block w-5 h-5">
            <!-- Moon Icon -->
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          </span>
          <span class="sr-only">{{ isDark ? '切换到浅色模式' : '切换到深色模式' }}</span>
        </button>
        
        <!-- 移动端菜单按钮 -->
        <button class="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700" @click="toggleMobileMenu">
          <span class="sr-only">打开菜单</span>
          <svg v-if="!mobileMenuOpen" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
    
    <!-- 移动端导航菜单 -->
    <div v-if="mobileMenuOpen" class="md:hidden">
      <nav class="px-4 py-4 space-y-3 bg-white dark:bg-slate-800 border-t dark:border-slate-700">
        <router-link to="/category/characters" class="block py-2 text-slate-600 hover:text-primary-600 dark:text-slate-300 dark:hover:text-primary-400">人物</router-link>
        <router-link to="/category/locations" class="block py-2 text-slate-600 hover:text-primary-600 dark:text-slate-300 dark:hover:text-primary-400">地点</router-link>
        <router-link to="/category/events" class="block py-2 text-slate-600 hover:text-primary-600 dark:text-slate-300 dark:hover:text-primary-400">事件</router-link>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';

const mobileMenuOpen = ref(false);
const isDark = ref(false);

// 检查用户偏好和系统设置
onMounted(() => {
  if (
    localStorage.theme === 'dark' || 
    (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
  ) {
    isDark.value = true;
    document.documentElement.classList.add('dark');
  } else {
    isDark.value = false;
    document.documentElement.classList.remove('dark');
  }
});

// 切换主题
const toggleTheme = () => {
  isDark.value = !isDark.value;
  
  if (isDark.value) {
    document.documentElement.classList.add('dark');
    localStorage.theme = 'dark';
  } else {
    document.documentElement.classList.remove('dark');
    localStorage.theme = 'light';
  }
};

// 切换移动端菜单
const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
};
</script>
