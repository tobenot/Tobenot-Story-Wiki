<template>
  <div class="wiki-container">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-3xl md:text-4xl font-bold bg-gradient-to-r from-starlight-500 to-starlight-600 text-transparent bg-clip-text">{{ work?.title || workId }}</h1>
      <router-link to="/works" class="btn btn-secondary">返回作品索引</router-link>
    </div>
    <div v-if="loading" class="py-12 text-center text-gray-600">加载中...</div>
    <div v-else-if="!work" class="py-12 text-center text-gray-600">未找到该作品</div>

    <div v-else>
      <p v-if="work.description" class="text-gray-700 mb-8">{{ work.description }}</p>
      <h2 class="text-xl font-bold mb-4 text-gray-800">篇章</h2>
      <div v-if="!work.parts || work.parts.length === 0" class="text-gray-600">暂无篇章</div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <router-link
          v-for="p in work.parts"
          :key="p.partId"
          :to="`/works/${workId}/parts/${p.partId}`"
          class="wiki-card p-5 group"
        >
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-semibold text-gray-800 group-hover:text-starlight-700">{{ p.title || p.partId }}</h3>
            <span class="text-gray-500 text-sm">序号: {{ p.order ?? 0 }}</span>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { getWork } from '../services/contentService';

const route = useRoute();
const workId = computed(() => route.params.workId);
const loading = ref(true);
const work = ref(null);

onMounted(async () => {
  loading.value = true;
  try {
    work.value = await getWork(workId.value);
  } finally {
    loading.value = false;
  }
});
</script>