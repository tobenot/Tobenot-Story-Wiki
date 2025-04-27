<!-- ThemeSwitcher.vue -->
<template>
  <button 
    @click="toggleDarkMode" 
    class="p-2 border-2 border-slate-900 dark:border-slate-600 transition-colors dark:text-starlight-200 bg-white dark:bg-cosmic-800 shadow-brutal hover:shadow-brutal-lg"
    :aria-label="isDarkMode ? '切换到浅色模式' : '切换到深色模式'"
  >
    <!-- 太阳图标 - 浅色模式显示 -->
    <svg v-if="isDarkMode" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
    
    <!-- 月亮图标 - 深色模式显示 -->
    <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
  </button>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { SunIcon, MoonIcon } from '@heroicons/vue/24/outline';

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
</script>