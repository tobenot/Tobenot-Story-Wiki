<template>
  <div class="wiki-container">
    <h1 class="text-3xl md:text-4xl font-bold mb-8 bg-gradient-to-r from-starlight-500 to-starlight-600 text-transparent bg-clip-text">作品索引</h1>
    <div v-if="loading" class="py-12 text-center text-gray-600">加载中...</div>
    <div v-else-if="works.length === 0" class="py-12 text-center text-gray-600">暂无作品</div>
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <router-link
        v-for="w in works"
        :key="w.workId"
        :to="`/works/${w.workId}`"
        class="wiki-card p-5 flex flex-col justify-between group"
      >
        <div>
          <h2 class="text-2xl font-bold text-gray-800 group-hover:text-starlight-700 transition-colors">{{ w.title || w.workId }}</h2>
          <p v-if="w.description" class="text-gray-600 mt-3 line-clamp-3">{{ w.description }}</p>
          <div v-if="w.tags && w.tags.length" class="flex flex-wrap gap-2 mt-4">
            <span v-for="t in w.tags" :key="t" class="text-xs px-2 py-1 bg-starlight-100 text-starlight-700">#{{ t }}</span>
          </div>
        </div>
        <div class="mt-6 text-sm text-gray-500">共 {{ w.parts?.length || 0 }} 篇章</div>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getWorks } from '../services/contentService';

const loading = ref(true);
const works = ref([]);

onMounted(async () => {
  loading.value = true;
  try {
    works.value = await getWorks();
  } finally {
    loading.value = false;
  }
});
</script>