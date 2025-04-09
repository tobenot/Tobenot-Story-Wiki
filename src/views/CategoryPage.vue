<template>
  <div class="category-page">
    <h1>{{ categoryTitle }}</h1>
    
    <div v-if="loading" class="loading">
      加载中...
    </div>
    
    <div v-else-if="entries.length === 0" class="no-entries">
      暂无{{ categoryTitle }}内容，敬请期待！
    </div>
    
    <div v-else class="entry-grid">
      <router-link 
        v-for="entry in entries" 
        :key="entry.id" 
        :to="`/entry/${categoryType}/${entry.id}`"
        class="entry-card"
      >
        <h2>{{ entry.title }}</h2>
        <div class="tags" v-if="entry.tags && entry.tags.length > 0">
          <span class="tag" v-for="tag in entry.tags" :key="tag">{{ tag }}</span>
        </div>
        <p v-if="entry.description">{{ entry.description }}</p>
      </router-link>
    </div>
    
    <router-link to="/" class="back-link">返回首页</router-link>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { loadContentList } from '../services/contentService'
import type { ContentEntry } from '../services/contentService'

export default defineComponent({
  name: 'CategoryPage',
  setup() {
    const route = useRoute()
    const loading = ref(true)
    const entries = ref<ContentEntry[]>([])
    
    const categoryType = computed(() => route.params.type as string)
    
    const categoryTitle = computed(() => {
      switch(categoryType.value) {
        case 'characters': return '人物'
        case 'locations': return '地点'
        case 'events': return '事件'
        default: return '未知分类'
      }
    })
    
    // 加载数据的函数
    const loadData = async () => {
      loading.value = true
      try {
        const data = await loadContentList(categoryType.value)
        entries.value = data
      } catch (error) {
        console.error('Failed to load entries', error)
      } finally {
        loading.value = false
      }
    }
    
    // 初始加载
    onMounted(loadData)
    
    // 监听路由参数变化，重新加载数据
    watch(() => route.params.type, (newType, oldType) => {
      if (newType !== oldType) {
        loadData()
      }
    })
    
    return {
      categoryType,
      categoryTitle,
      loading,
      entries
    }
  }
})
</script>

<style scoped>
.category-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.entry-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin: 2rem 0;
}

.entry-card {
  background-color: #f5f5f5;
  border-radius: 8px;
  padding: 1.5rem;
  text-decoration: none;
  color: inherit;
  transition: transform 0.2s, box-shadow 0.2s;
}

.entry-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 0.5rem 0;
}

.tag {
  background-color: rgba(0, 0, 0, 0.05);
  color: #555;
  padding: 0.2rem 0.6rem;
  border-radius: 20px;
  font-size: 0.75rem;
}

.loading, .no-entries {
  text-align: center;
  margin: 3rem 0;
  font-size: 1.2rem;
  color: #666;
}

.back-link {
  display: inline-block;
  margin-top: 2rem;
  color: #0066cc;
  text-decoration: none;
}

.back-link:hover {
  text-decoration: underline;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

h2 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}
</style> 