<template>
  <div class="wiki-container">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-3xl md:text-4xl font-bold bg-gradient-to-r from-starlight-500 to-starlight-600 text-transparent bg-clip-text">主题聚合</h1>
      <router-link to="/" class="btn btn-secondary">返回首页</router-link>
    </div>

    <div v-if="loading" class="py-12 text-center text-gray-600">加载中...</div>
    <div v-else-if="themes.length === 0" class="py-12 text-center text-gray-600">暂无主题</div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <router-link
        v-for="t in themes"
        :key="t.themeId"
        :to="`/theme/${t.themeId}`"
        class="wiki-card p-5 group"
      >
        <h2 class="text-xl font-semibold text-gray-800 group-hover:text-starlight-700">{{ t.title || t.themeId }}</h2>
        <p v-if="t.description" class="text-gray-600 mt-2 line-clamp-3">{{ t.description }}</p>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getThemes } from '../services/contentService';

const loading = ref(true);
const themes = ref([]);

onMounted(async () => {
  loading.value = true;
  try {
    themes.value = await getThemes();
  } finally {
    loading.value = false;
  }
});
</script>