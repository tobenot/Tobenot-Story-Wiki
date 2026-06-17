<template>
  <footer class="bg-cosmic-800/80 backdrop-blur-sm border-t border-cosmic-600/40 mt-12 relative overflow-hidden">
    <!-- 星空装饰元素 -->
    <div class="absolute inset-0 pointer-events-none">
      <div class="absolute bottom-10 left-10 w-32 h-32 bg-aurora filter blur-3xl opacity-10 animate-pulse-slow"></div>
      <div class="absolute top-5 right-10 w-24 h-24 bg-aurora filter blur-3xl opacity-10 animate-pulse-slow" style="animation-delay: 2s;"></div>
    </div>

    <div class="container mx-auto px-4 py-10 relative z-10">
      <div class="flex flex-col md:flex-row justify-between items-center">
        <div class="mb-6 md:mb-0 text-center md:text-left">
          <div class="inline-block">
            <span class="font-serif text-xl font-bold bg-gradient-to-r from-starlight-200 to-starlight-400 bg-clip-text text-transparent">托贝诺特Wiki</span>
            <div class="h-px w-full bg-gradient-to-r from-transparent via-starlight-500 to-transparent mt-1"></div>
          </div>
          <p class="text-sm text-starlight-300 mt-3">探索不同作品中的同一个世界观</p>
        </div>
        
        <div class="flex flex-col sm:flex-row gap-10">
          <div class="space-y-3">
            <h3 class="font-medium text-starlight-100 mb-2">导航</h3>
            <ul class="space-y-2 text-sm">
              <li v-for="(item, index) in navItems" :key="index">
                <a
                  v-if="item.external"
                  :href="item.href"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-starlight-300 hover:text-starlight-100 transition-colors"
                >
                  {{ item.name }}
                </a>
                <router-link v-else :to="item.path" class="text-starlight-300 hover:text-starlight-100 transition-colors">
                  {{ item.name }}
                </router-link>
              </li>
            </ul>
          </div>
          
          <div class="space-y-3">
            <h3 class="font-medium text-starlight-100 mb-2">资源</h3>
            <ul class="space-y-2 text-sm">
              <li>
                <a href="https://e.tobenot.top/" target="_blank" rel="noopener noreferrer" class="text-starlight-300 hover:text-starlight-100 transition-colors">
                  墓志铭 · 作品集
                </a>
              </li>
              <li>
                <a href="https://tobenot.top/" target="_blank" rel="noopener noreferrer" class="text-starlight-300 hover:text-starlight-100 transition-colors inline-flex items-center">
                  <svg class="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5 4.802 5 2.5 6.12 2.5 7.5v9C2.5 17.88 4.802 19 7.5 19c1.746 0 3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c2.698 0 5 1.12 5 2.5v9c0 1.38-2.302 2.5-5 2.5-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  博客
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      <div class="border-t border-cosmic-600/30 mt-8 pt-6 text-center">
        <p class="text-sm text-starlight-400">&copy; {{ currentYear }} 托贝诺特Wiki. 保留所有权利。</p>
        
        <div class="mt-4 text-xs text-starlight-500 max-w-lg mx-auto leading-relaxed">
          <q>祝你旅途愉快。</q>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue';

const currentYear = computed(() => new Date().getFullYear());

const navItems = [
  { name: '首页', path: '/' },
  { name: '人物', path: '/category/characters' },
  { name: '地点', path: '/category/locations' },
  { name: '事件', path: '/category/events' },
  { name: '概念', path: '/category/concepts' },
  { name: '作品集', href: 'https://e.tobenot.top/', external: true }
];
</script>
