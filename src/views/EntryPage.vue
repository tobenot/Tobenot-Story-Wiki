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
      
      <!-- 剧透提示元素 -->
      <div class="spoiler-tooltip" :style="tooltipStyle" v-show="showTooltip">
        <div class="tooltip-title">{{ tooltipText }}</div>
        <div class="tooltip-actions">
          <router-link 
            v-if="tooltipLink" 
            :to="tooltipLink" 
            class="tooltip-btn tooltip-link"
            @click.stop="handleTooltipLinkClick"
          >
            前往原作
          </router-link>
          <button 
            v-else
            class="tooltip-btn tooltip-pending"
            @click.stop="handleCloseTooltip"
          >
            敬请催更
          </button>
          <button 
            class="tooltip-btn tooltip-reveal"
            @click.stop="handleRevealSpoiler"
          >
            查看剧透
          </button>
        </div>
        <button class="tooltip-close" @click.stop="handleCloseTooltip">×</button>
      </div>
    </div>
    
    <!-- 点击其他区域关闭提示的遮罩层 -->
    <div class="overlay" v-if="showTooltip" @click="handleCloseTooltip"></div>
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
    
    // 提示相关状态
    const showTooltip = ref(false)
    const tooltipText = ref('')
    const tooltipLink = ref('')
    const tooltipStyle = ref({
      top: '0px',
      left: '0px'
    })
    
    // 记录当前激活的剧透元素
    const activeSpoilerElement = ref<HTMLElement | null>(null)
    
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
      parsedContent.value = renderContent(entry.value.content, showAllSpoilers.value)
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
        // 点击后关闭提示
        handleCloseTooltip()
      }
    }
    
    // 处理鼠标悬停事件
    const handleEntryBodyHover = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      const spoilerElement = target.closest('.spoiler') as HTMLElement | null
      
      if (spoilerElement && !spoilerElement.classList.contains('revealed')) {
        // 存储当前激活的剧透元素
        activeSpoilerElement.value = spoilerElement
        
        // 获取剧透内容来源
        const source = spoilerElement.getAttribute('data-source') || '剧透内容'
        tooltipText.value = source
        
        // 检查是否有对应的链接配置
        tooltipLink.value = spoilerLinksMap.value[source] || ''
        
        // 计算提示位置
        const rect = spoilerElement.getBoundingClientRect()
        tooltipStyle.value = {
          top: `${rect.top - 50}px`, // 略微抬高位置以适应更大的提示框
          left: `${rect.left + (rect.width / 2)}px`
        }
        
        showTooltip.value = true
      }
    }
    
    // 处理提示链接点击
    const handleTooltipLinkClick = () => {
      // 点击链接后关闭提示
      handleCloseTooltip()
    }
    
    // 处理显示剧透内容
    const handleRevealSpoiler = () => {
      if (activeSpoilerElement.value) {
        // 给当前激活的剧透元素添加 revealed 类
        activeSpoilerElement.value.classList.add('revealed')
        // 显示剧透后关闭提示
        handleCloseTooltip()
      }
    }
    
    // 关闭提示
    const handleCloseTooltip = () => {
      showTooltip.value = false
      activeSpoilerElement.value = null
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
      handleRevealSpoiler,
      handleCloseTooltip,
      handleTooltipLinkClick,
      showTooltip,
      tooltipText,
      tooltipLink,
      tooltipStyle
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
  padding: 1rem;
  margin: 1rem 0;
  border-radius: 4px;
  background-color: #f5f5f5;
  filter: blur(5px);
  user-select: none;
  transition: filter 0.3s;
  cursor: pointer;
}

/* 剧透提示样式 */
.spoiler-tooltip {
  position: fixed;
  background-color: rgba(0, 0, 0, 0.85);
  color: white;
  padding: 0.8rem 1rem;
  border-radius: 6px;
  font-size: 0.95rem;
  text-align: center;
  pointer-events: auto;
  z-index: 1000;
  transform: translateX(-50%);
  max-width: 400px; /* 扩大最大宽度以适应更长的文本 */
  width: auto;
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  box-shadow: 0 3px 15px rgba(0, 0, 0, 0.5);
}

.tooltip-title {
  font-weight: 500;
  max-width: 100%;
  word-wrap: break-word;
  padding: 0 15px; /* 为关闭按钮留出空间 */
}

.tooltip-actions {
  display: flex;
  justify-content: space-between;
  gap: 0.8rem;
  width: 100%;
}

.tooltip-btn {
  flex: 1;
  padding: 0.5rem;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  text-align: center;
  transition: all 0.2s;
  white-space: nowrap; /* 防止文本换行 */
  min-width: 80px; /* 设置最小宽度 */
}

/* 前往原作按钮样式 */
.tooltip-link {
  background-color: rgba(79, 195, 247, 0.2);
  color: #4fc3f7;
  text-decoration: none;
  font-weight: 500;
  border: 1px solid rgba(79, 195, 247, 0.3);
}

.tooltip-link:hover {
  background-color: rgba(79, 195, 247, 0.3);
  text-decoration: none;
}

/* 敬请催更按钮样式 */
.tooltip-pending {
  background-color: rgba(156, 39, 176, 0.2);
  color: #ce93d8;
  border: 1px solid rgba(156, 39, 176, 0.3);
  font-weight: 500;
}

.tooltip-pending:hover {
  background-color: rgba(156, 39, 176, 0.3);
}

/* 查看剧透按钮样式 */
.tooltip-reveal {
  background-color: rgba(255, 87, 34, 0.2);
  color: #ff9800;
  border: 1px solid rgba(255, 87, 34, 0.3);
  font-weight: 500;
}

.tooltip-reveal:hover {
  background-color: rgba(255, 87, 34, 0.3);
}

/* 提示框中的关闭按钮 */
.tooltip-close {
  position: absolute;
  top: 5px;
  right: 5px;
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.1rem;
  cursor: pointer;
  padding: 2px 6px;
  line-height: 1;
  border-radius: 50%;
}

.tooltip-close:hover {
  background-color: rgba(255, 255, 255, 0.15);
  color: white;
}

/* 点击其他区域关闭提示的遮罩层 */
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: transparent;
  z-index: 999;
}

:deep(.spoiler):hover {
  filter: blur(3px);
}

:deep(.spoiler.revealed),
:deep(.spoiler:active) {
  filter: blur(0);
  user-select: auto;
  cursor: text;
}
</style>