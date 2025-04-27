<template>
  <header class="sticky top-0 z-50 w-full backdrop-blur-sm bg-cosmic-800/60 border-b border-cosmic-600/40">
    <div class="container mx-auto px-4 py-4 flex justify-between items-center">
      <router-link to="/" class="flex items-center space-x-2 group">
        <div class="w-8 h-8 flex items-center justify-center bg-gradient-to-br from-starlight-300 to-starlight-600 rounded-full overflow-hidden">
          <div class="w-6 h-6 bg-cosmic-900/40 rounded-full group-hover:scale-110 transition-transform"></div>
        </div>
        <span class="font-serif text-xl font-bold bg-gradient-to-r from-starlight-100 to-starlight-400 bg-clip-text text-transparent group-hover:from-starlight-50 group-hover:to-starlight-300 transition-colors">托贝诺特Wiki</span>
      </router-link>
      
      <div class="flex items-center space-x-4">
        <nav class="hidden md:flex space-x-6">
          <router-link 
            v-for="(item, index) in navItems" 
            :key="index" 
            :to="item.path" 
            class="text-starlight-300 relative py-1 overflow-hidden group"
          >
            <span class="relative z-10 group-hover:text-starlight-50 transition-colors duration-300">{{ item.name }}</span>
            <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-secondary-400 to-secondary-600 group-hover:w-full transition-all duration-300"></span>
          </router-link>
        </nav>
        
        <button class="theme-toggle p-2 rounded-full bg-cosmic-700/60 hover:bg-cosmic-600/80 text-starlight-200 transition-colors" @click="toggleTheme">
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
        <button class="md:hidden p-2 rounded-full bg-cosmic-700/60 hover:bg-cosmic-600/80 text-starlight-200 transition-colors" @click="toggleMobileMenu">
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
      <nav class="px-4 py-4 space-y-3 bg-cosmic-800/90 backdrop-blur-md border-t border-cosmic-600/40">
        <router-link 
          v-for="(item, index) in navItems" 
          :key="index" 
          :to="item.path" 
          class="block py-2 text-starlight-300 hover:text-starlight-100"
          @click="mobileMenuOpen = false"
        >
          {{ item.name }}
        </router-link>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const mobileMenuOpen = ref(false);
const isDark = ref(false);

// 导航项目数组
const navItems = [
  { name: '人物', path: '/category/characters' },
  { name: '地点', path: '/category/locations' },
  { name: '事件', path: '/category/events' },
  { name: '概念', path: '/category/concepts' }
];

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
