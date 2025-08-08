<template>
  <div class="wiki-container">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-3xl md:text-4xl font-bold bg-gradient-to-r from-starlight-500 to-starlight-600 text-transparent bg-clip-text">{{ title }}</h1>
      <router-link :to="`/works/${workId}`" class="btn btn-secondary">返回作品</router-link>
    </div>

    <div v-if="loading" class="py-12 text-center text-gray-600">加载中...</div>
    <div v-else-if="!part" class="py-12 text-center text-gray-600">未找到该篇章</div>

    <div v-else>
      <p v-if="part.description" class="text-gray-700 mb-8">{{ part.description }}</p>

      <div v-for="type in orderedTypes" :key="type" class="mb-10">
        <h2 class="text-xl font-bold mb-4 text-gray-800">{{ typeTitle(type) }}</h2>
        <div v-if="!part.entriesByType[type] || part.entriesByType[type].length === 0" class="text-gray-500">暂无</div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <router-link
            v-for="entry in part.entriesByType[type]"
            :key="entry.id"
            :to="`/entry/${type}/${entry.id}`"
            class="wiki-card p-5 group"
          >
            <h3 class="text-lg font-semibold text-gray-800 group-hover:text-starlight-700">{{ entry.title }}</h3>
            <p v-if="entry.description" class="text-gray-600 mt-2 line-clamp-3">{{ entry.description }}</p>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { getPart } from '../services/contentService';

const route = useRoute();
const workId = computed(() => route.params.workId);
const partId = computed(() => route.params.partId);
const loading = ref(true);
const part = ref(null);

const orderedTypes = computed(() => {
  if (!part.value) return [];
  const keys = Object.keys(part.value.entriesByType || {});
  const order = ['characters', 'locations', 'events', 'items', 'concepts'];
  return keys.sort((a, b) => (order.indexOf(a) === -1 ? 999 : order.indexOf(a)) - (order.indexOf(b) === -1 ? 999 : order.indexOf(b)));
});

const typeTitle = (t) => ({
  characters: '人物',
  locations: '地点',
  events: '事件',
  items: '物品',
  concepts: '概念',
}[t] || t);

const title = computed(() => part.value?.title || partId.value);

onMounted(async () => {
  loading.value = true;
  try {
    part.value = await getPart(workId.value, partId.value);
  } finally {
    loading.value = false;
  }
});
</script>