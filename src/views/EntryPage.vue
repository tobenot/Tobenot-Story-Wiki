<template>
  <div class="entry-page">
    <div v-if="loading" class="loading">
      加载中...
    </div>
    
    <div v-else-if="!entry" class="not-found">
      未找到该条目信息
      <router-link to="/" class="back-link">返回首页</router-link>
    </div>
    
    <div v-else class="entry-content">
      <h1>{{ entry.title }}</h1>
      
      <div class="tags" v-if="entry.tags && entry.tags.length > 0">
        <span class="tag" v-for="tag in entry.tags" :key="tag">{{ tag }}</span>
      </div>
      
      <div class="spoiler-controls">
        <button @click="showAllSpoilers = !showAllSpoilers" class="spoiler-toggle">
          {{ showAllSpoilers ? '隐藏所有剧透' : '我不怕剧透' }}
        </button>
      </div>
      
      <div 
        class="entry-body" 
        v-html="parsedContent"
        @click="handleEntryBodyClick"
        @mouseover="handleEntryBodyHover"
      ></div>
      
      <div class="related" v-if="entry.related && entry.related.length > 0">
        <h3>相关条目</h3>
        <ul>
          <li v-for="item in entry.related" :key="item">{{ item }}</li>
        </ul>
      </div>
      
      <div class="navigation">
        <router-link :to="`/category/${categoryType}`" class="back-link">
          返回{{ categoryTitle }}列表
        </router-link>
      </div>
      
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { loadContentEntry, renderContent } from '../services/contentService'
import type { ContentEntry } from '../services/contentService'

export default defineComponent({
  name: 'EntryPage',
  setup() {
    const route = useRoute()
    const loading = ref(true)
    const showAllSpoilers = ref(false)
    const entry = ref<ContentEntry | null>(null)
    const parsedContent = ref('')
    
    // We no longer need to track the active spoiler element
    
    const categoryType = computed(() => route.params.type as string)
    const entryId = computed(() => route.params.id as string)
    
    const categoryTitle = computed(() => {
      switch(categoryType.value) {
        case 'characters': return '人物'
        case 'locations': return '地点'
        case 'events': return '事件'
        default: return '未知分类'
      }
    })
    
    // 剧透链接配置映射
    const spoilerLinksMap = ref<Record<string, string>>({
      // 从示例文件添加的配置
      '《创世纪》第一章': '/works/genesis-chapter-1',
    })
    
    // 更新渲染内容的逻辑
    const updateParsedContent = () => {
      if (!entry.value) {
        parsedContent.value = ''
        return
      }
      // 先渲染Markdown内容
      let renderedContent = renderContent(entry.value.content, showAllSpoilers.value)
      
      // 为所有剧透块添加按钮和来源
      const parser = new DOMParser()
      const doc = parser.parseFromString(renderedContent, 'text/html')
      
      doc.querySelectorAll('.spoiler').forEach((spoiler) => {
        const source = spoiler.getAttribute('data-source') || '剧透内容'
        
        // 创建来源标签
        const sourceDiv = document.createElement('div')
        sourceDiv.className = 'spoiler-source'
        sourceDiv.textContent = '出自：' + source
        spoiler.appendChild(sourceDiv)
        
        // 将剧透内容包装到一个 div 中以应用模糊效果
        const contentDiv = document.createElement('div')
        contentDiv.className = 'spoiler-content'
        // 将所有子元素移动到新的内容 div 中
        while (spoiler.firstChild && spoiler.firstChild !== sourceDiv) {
          contentDiv.appendChild(spoiler.firstChild)
        }
        spoiler.appendChild(contentDiv)
        
        // 创建操作按钮容器
        const actionsDiv = document.createElement('div')
        actionsDiv.className = 'spoiler-actions'
        
        // 创建查看剧透按钮
        const revealBtn = document.createElement('button')
        revealBtn.className = 'spoiler-btn view-spoiler'
        revealBtn.textContent = '点击查看剧透'
        revealBtn.onclick = (e) => {
          e.stopPropagation()
          spoiler.classList.add('revealed')
        }
        actionsDiv.appendChild(revealBtn)
        
        // 检查是否有对应的链接配置
        const link = spoilerLinksMap.value[source] || ''
        if (link) {
          // 创建前往原作按钮
          const sourceBtn = document.createElement('a')
          sourceBtn.className = 'spoiler-btn goto-source'
          sourceBtn.textContent = '前往原作'
          sourceBtn.href = link
          actionsDiv.appendChild(sourceBtn)
        } else {
          // 创建敬请催更按钮
          const pendingBtn = document.createElement('button')
          pendingBtn.className = 'spoiler-btn pending-source'
          pendingBtn.textContent = '敬请催更'
          pendingBtn.onclick = (e) => {
            e.stopPropagation()
          }
          actionsDiv.appendChild(pendingBtn)
        }
        
        spoiler.appendChild(actionsDiv)
      })
      
      parsedContent.value = doc.body.innerHTML
    }

    // 加载数据的函数
    const loadData = async () => {
      loading.value = true
      try {
        const data = await loadContentEntry(categoryType.value, entryId.value)
        entry.value = data
        updateParsedContent() // 初始渲染
      } catch (error) {
        console.error('Failed to load entry', error)
      } finally {
        loading.value = false
      }
    }

    // 初始加载
    onMounted(loadData)

    // 监听路由参数变化，重新加载数据
    watch([() => route.params.type, () => route.params.id], ([newType, newId], [oldType, oldId]) => {
      if (newType !== oldType || newId !== oldId) {
        loadData()
      }
    })
    
    // 监听 showAllSpoilers 的变化，重新渲染内容
    watch(showAllSpoilers, () => {
      updateParsedContent()
    })
    
    // 事件委托处理函数
    const handleEntryBodyClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      
      // 查找被点击元素或其父元素中最近的 .spoiler 元素
      const spoilerElement = target.closest('.spoiler') as HTMLElement | null
      
      if (spoilerElement && !spoilerElement.classList.contains('revealed')) {
        // 如果点击的是未揭示的剧透块，手动添加 revealed 类
        spoilerElement.classList.add('revealed')
        // 不再需要调用关闭提示，因为现在按钮直接显示在剧透元素上
      }
    }
    
    // 处理鼠标悬停事件 - 保留但不再需要实际功能
    const handleEntryBodyHover = () => {
      // 不再需要处理悬停事件
    }
    
    // 处理显示剧透内容 - 直接在元素上操作
    const handleRevealSpoiler = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      const spoilerElement = target.closest('.spoiler') as HTMLElement | null
      
      if (spoilerElement) {
        // 给剧透元素添加 revealed 类
        spoilerElement.classList.add('revealed')
      }
    }
    
    return {
      categoryType,
      categoryTitle,
      loading,
      entry,
      parsedContent,
      showAllSpoilers,
      handleEntryBodyClick,
      handleEntryBodyHover,
      handleRevealSpoiler
    }
  }
})
</script>

<style scoped>
.entry-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.loading, .not-found {
  margin: 3rem 0;
  font-size: 1.2rem;
  color: #666;
}

.entry-content {
  background-color: #fff;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  position: relative; /* 为提示定位添加相对定位 */
}

.entry-body {
  text-align: left; /* 确保内容左对齐 */
  line-height: 1.6;
}

/* 处理文本格式 */
.entry-body h1,
.entry-body h2,
.entry-body h3,
.entry-body h4,
.entry-body h5,
.entry-body h6 {
  margin: 1.5em 0 0.8em;
  line-height: 1.4;
}

.entry-body p {
  margin: 0.8em 0;
}

.entry-body ul,
.entry-body ol {
  margin: 0.8em 0;
  padding-left: 2em;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 1rem 0;
}

.tag {
  background-color: #f0f0f0;
  color: #555;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.85rem;
}

.spoiler-controls {
  margin: 1rem 0 2rem;
  text-align: right;
}

.spoiler-toggle {
  background-color: #f0f0f0;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.spoiler-toggle:hover {
  background-color: #e0e0e0;
}

.related {
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
}

.related h3 {
  font-size: 1.2rem;
  margin-bottom: 0.8rem;
}

.related ul {
  padding-left: 1.5rem;
}

.navigation {
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
}

.back-link {
  color: #0066cc;
  text-decoration: none;
}

.back-link:hover {
  text-decoration: underline;
}

h1 {
  font-size: 2.2rem;
  margin-bottom: 1rem;
}

/* 处理剧透样式 */
:deep(.spoiler) {
  position: relative;
  padding: 2.5rem 1rem 3rem;
  margin: 1rem 0;
  border-radius: 4px;
  background-color: #f5f5f5;
  user-select: none;
  cursor: pointer;
  overflow: hidden;
}

:deep(.spoiler .spoiler-content) {
  filter: blur(5px);
  transition: filter 0.3s;
}

/* 添加剧透来源样式 */
:deep(.spoiler) .spoiler-source {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  padding: 5px 10px;
  font-size: 0.9rem;
  border-radius: 4px 4px 0 0;
  z-index: 10;
  text-align: center;
  font-weight: 500;
  color: #606060;
}

/* 添加按钮样式 */
:deep(.spoiler .spoiler-actions) {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  gap: 8px;
  padding: 5px;
  border-radius: 0 0 4px 4px;
  z-index: 10;
}

:deep(.spoiler .spoiler-btn) {
  padding: 5px 12px;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
  background-color: #f0f0f0;
  color: #505050;
  border: 1px solid #ddd;
}

:deep(.spoiler .view-spoiler) {
  background-color: #fff4e6;
  color: #ff6b00;
  border: 1px solid #ffd0a1;
}

:deep(.spoiler .goto-source) {
  background-color: #e6f7ff;
  color: #0078d4;
  border: 1px solid #a1d6ff;
  text-decoration: none;
}

:deep(.spoiler .goto-source:hover) {
  text-decoration: none;
  background-color: #cceeff;
}

:deep(.spoiler .pending-source) {
  background-color: #f3e6ff;
  color: #9c27b0;
  border: 1px solid #d8a1ff;
}

:deep(.spoiler):hover .spoiler-content {
  filter: blur(3px);
}

:deep(.spoiler.revealed) .spoiler-content,
:deep(.spoiler:active) .spoiler-content {
  filter: blur(0);
}

:deep(.spoiler.revealed) {
  user-select: auto;
  cursor: text;
}
</style>