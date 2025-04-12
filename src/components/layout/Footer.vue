<template>
  <footer class="bg-white border-t border-slate-200 dark:bg-slate-800 dark:border-slate-700 mt-12">
    <div class="container mx-auto px-4 py-8">
      <div class="flex flex-col md:flex-row justify-between items-center">
        <div class="mb-4 md:mb-0">
          <span class="font-serif text-xl font-bold text-slate-800 dark:text-white">托贝诺特Wiki</span>
          <p class="text-sm text-slate-600 dark:text-slate-400 mt-2">探索不同作品中的世界观建设</p>
        </div>
        
        <div class="flex flex-col sm:flex-row gap-6">
          <div class="space-y-2">
            <h3 class="font-medium text-slate-900 dark:text-white">导航</h3>
            <ul class="space-y-2 text-sm">
              <li>
                <router-link to="/" class="text-slate-600 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400">首页</router-link>
              </li>
              <li>
                <router-link to="/category/characters" class="text-slate-600 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400">人物</router-link>
              </li>
              <li>
                <router-link to="/category/locations" class="text-slate-600 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400">地点</router-link>
              </li>
              <li>
                <router-link to="/category/events" class="text-slate-600 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400">事件</router-link>
              </li>
            </ul>
          </div>
          
          <div class="space-y-2">
            <h3 class="font-medium text-slate-900 dark:text-white">资源</h3>
            <ul class="space-y-2 text-sm">
              <li>
                <a href="https://github.com/tobenot/Tobenot-Story-Wiki" target="_blank" class="text-slate-600 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400">GitHub 仓库</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      <div class="border-t border-slate-200 dark:border-slate-700 mt-8 pt-6 text-center text-sm text-slate-600 dark:text-slate-400">
        <p>&copy; {{ currentYear }} 托贝诺特Wiki. 保留所有权利。</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue';

const currentYear = computed(() => new Date().getFullYear());
</script>
