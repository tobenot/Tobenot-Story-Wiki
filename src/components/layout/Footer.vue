<template>
  <footer class="bg-cosmic-800/80 backdrop-blur-sm border-t border-cosmic-600/40 mt-12 relative overflow-hidden">
    <!-- 星空装饰元素 -->
    <div class="absolute inset-0 pointer-events-none">
      <div class="absolute bottom-10 left-10 w-32 h-32 bg-aurora rounded-full filter blur-3xl opacity-10 animate-pulse-slow"></div>
      <div class="absolute top-5 right-10 w-24 h-24 bg-aurora rounded-full filter blur-3xl opacity-10 animate-pulse-slow" style="animation-delay: 2s;"></div>
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
                <router-link :to="item.path" class="text-starlight-300 hover:text-starlight-100 transition-colors">
                  {{ item.name }}
                </router-link>
              </li>
            </ul>
          </div>
          
          <div class="space-y-3">
            <h3 class="font-medium text-starlight-100 mb-2">资源</h3>
            <ul class="space-y-2 text-sm">
              <li>
                <a href="https://github.com/tobenot/Tobenot-Story-Wiki" target="_blank" class="text-starlight-300 hover:text-starlight-100 transition-colors inline-flex items-center">
                  <svg class="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.6.11.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                  </svg>
                  GitHub 仓库
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
  { name: '概念', path: '/category/concepts' }
];
</script>
