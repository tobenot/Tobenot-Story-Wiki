<template>
  <div class="wiki-container">
    <section class="text-center py-12 md:py-20">
      <h1 class="text-4xl md:text-5xl lg:text-6xl mb-6 text-slate-900 dark:text-white">托贝诺特世界观 Wiki</h1>
      <p class="text-lg md:text-xl text-slate-700 dark:text-slate-300 max-w-2xl mx-auto mb-12">
        欢迎来到世界观 Wiki，在这里你可以探索各种作品中的设定。
      </p>
      
      <div class="wiki-grid">
        <router-link to="/category/characters" class="wiki-card">
          <div class="p-4 flex flex-col items-center text-center">
            <!-- 图标组件 -->
            <div class="mb-4 p-3 rounded-full bg-primary-100 text-primary-600 dark:bg-primary-900/40 dark:text-primary-400">
              <!-- 人物图标 -->
            </div>
            <h2 class="text-xl font-bold mb-2">人物</h2>
            <p class="text-slate-600 dark:text-slate-400">探索各种作品中的角色</p>
          </div>
        </router-link>
        
        <router-link to="/category/locations" class="wiki-card">
          <div class="p-4 flex flex-col items-center text-center">
            <div class="mb-4 p-3 rounded-full bg-secondary-100 text-secondary-600 dark:bg-secondary-900/40 dark:text-secondary-400">
              <!-- 地点图标 -->
            </div>
            <h2 class="text-xl font-bold mb-2">地点</h2>
            <p class="text-slate-600 dark:text-slate-400">发现各种作品中的地点</p>
          </div>
        </router-link>
        
        <router-link to="/category/events" class="wiki-card">
          <div class="p-4 flex flex-col items-center text-center">
            <div class="mb-4 p-3 rounded-full bg-accent-100 text-accent-600 dark:bg-accent-900/40 dark:text-accent-400">
              <!-- 事件图标 -->
            </div>
            <h2 class="text-xl font-bold mb-2">事件</h2>
            <p class="text-slate-600 dark:text-slate-400">了解各种作品中的事件</p>
          </div>
        </router-link>
        
        <router-link to="/category/items" class="wiki-card">
          <div class="p-4 flex flex-col items-center text-center">
            <div class="mb-4 p-3 rounded-full bg-yellow-100 text-yellow-600 dark:bg-yellow-900/40 dark:text-yellow-400">
              <!-- 物品图标 -->
            </div>
            <h2 class="text-xl font-bold mb-2">物品</h2>
            <p class="text-slate-600 dark:text-slate-400">浏览各种作品中的物品</p>
          </div>
        </router-link>
        
        <router-link to="/category/concepts" class="wiki-card">
          <div class="p-4 flex flex-col items-center text-center">
            <div class="mb-4 p-3 rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400">
              <!-- 概念图标 -->
            </div>
            <h2 class="text-xl font-bold mb-2">概念</h2>
            <p class="text-slate-600 dark:text-slate-400">理解各种作品中的概念</p>
          </div>
        </router-link>
      </div>
    </section>
    
    <!-- 最近更新区块 -->
    <section class="mt-16 md:mt-24">
      <div class="flex items-baseline justify-between mb-8">
        <h2 class="text-2xl md:text-3xl font-bold">最近更新</h2>
        <a href="#" class="text-primary-600 dark:text-primary-400">查看全部</a>
      </div>
      
      <div class="space-y-4">
        <!-- 这里可以放置最近更新的条目列表 -->
      </div>
    </section>
  </div>
</template>