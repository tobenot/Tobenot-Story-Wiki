<template>
  <div>
    <!-- 导航栏 -->
    <Header />
    
    <main class="wiki-container">
      <div v-if="loading" class="flex justify-center items-center py-20">
        <svg class="animate-spin h-8 w-8 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span class="ml-3 text-slate-600 dark:text-slate-400">加载中...</span>
      </div>
      
      <div v-else-if="!entry" class="text-center py-20">
        <div class="mb-4 text-slate-400 dark:text-slate-500">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 class="text-xl font-medium text-slate-700 dark:text-slate-300 mb-4">未找到该条目信息</h3>
        <router-link to="/" class="btn btn-primary">返回首页</router-link>
      </div>
      
      <div v-else>
        <!-- 面包屑导航 -->
        <nav class="flex text-sm mb-6">
          <router-link to="/" class="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200">首页</router-link>
          <span class="mx-2 text-slate-400">/</span>
          <router-link :to="`/category/${categoryType}`" class="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200">
            {{ categoryTitle }}
          </router-link>
          <span class="mx-2 text-slate-400">/</span>
          <span class="text-slate-700 dark:text-slate-300">{{ entry.title }}</span>
        </nav>
        
        <!-- 条目内容卡片 -->
        <article class="wiki-card mb-8">
          <h1 class="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white">{{ entry.title }}</h1>
          
          <div class="flex flex-wrap gap-2 mb-6" v-if="entry.tags && entry.tags.length > 0">
            <Tag 
              v-for="tag in entry.tags" 
              :key="tag" 
              :text="tag" 
              color="primary"
              :clickable="true"
              @click="handleTagClick(tag)"
            />
          </div>
          
          <!-- 剧透控制 -->
          <div class="mb-8 flex justify-end">
            <button @click="showAllSpoilers = !showAllSpoilers" 
              class="btn"
              :class="showAllSpoilers ? 'btn-secondary' : 'btn-primary'"
            >
              {{ showAllSpoilers ? '隐藏所有剧透' : '我不怕剧透' }}
            </button>
          </div>
          
          <!-- 条目主体内容 -->
          <div 
            class="prose prose-slate dark:prose-invert max-w-none" 
            v-html="parsedContent"
            @click="handleEntryBodyClick"
          ></div>
          
          <!-- 相关条目 -->
          <div class="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700" v-if="entry.related && entry.related.length > 0">
            <h3 class="text-lg font-bold mb-4 text-slate-900 dark:text-white">相关条目</h3>
            <ul class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <li v-for="item in entry.related" :key="item" class="flex items-center">
                <span class="mr-2 text-primary-600 dark:text-primary-400">•</span>
                <a href="#" class="text-slate-700 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400">{{ item }}</a>
              </li>
            </ul>
          </div>
        </article>
        
        <!-- 底部导航 -->
        <div class="flex justify-between mt-8">
          <router-link :to="`/category/${categoryType}`" class="btn btn-secondary">
            返回{{ categoryTitle }}列表
          </router-link>
          
          <!-- 分享按钮 -->
          <button class="btn btn-secondary flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            <span>分享</span>
          </button>
        </div>
      </div>
    </main>
    
    <!-- 页脚 -->
    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { loadContentEntry, renderContent } from '../services/contentService';
import Header from '../components/layout/Header.vue';
import Footer from '../components/layout/Footer.vue';
import Tag from '../components/ui/Tag.vue';

const route = useRoute();
const router = useRouter();
const loading = ref(true);
const showAllSpoilers = ref(false);
const entry = ref(null);
const parsedContent = ref('');

// 处理标签点击
const handleTagClick = (tag) => {
  // 这里可以根据需要实现标签点击的逻辑
  // 例如：跳转到标签搜索页面
  router.push({
    path: `/category/${categoryType.value}`,
    query: { tag }
  });
};

// 类型和ID计算属性
const categoryType = computed(() => route.params.type);
const entryId = computed(() => route.params.id);

const categoryTitle = computed(() => {
  switch(categoryType.value) {
    case 'characters': return '人物';
    case 'locations': return '地点';
    case 'events': return '事件';
    default: return '未知分类';
  }
});

// 剧透链接配置映射
const spoilerLinksMap = ref({
  // 从示例文件添加的配置
  '《创世纪》第一章': '/works/genesis-chapter-1',
});

// 更新渲染内容的逻辑
const updateParsedContent = () => {
  if (!entry.value) {
    parsedContent.value = '';
    return;
  }
  // 先渲染Markdown内容
  let renderedContent = renderContent(entry.value.content, showAllSpoilers.value);
  
  // 为所有剧透块添加按钮和来源
  const parser = new DOMParser();
  const doc = parser.parseFromString(renderedContent, 'text/html');
  
  doc.querySelectorAll('.spoiler').forEach((spoiler) => {
    const source = spoiler.getAttribute('data-source') || '剧透内容';
    
    // 创建来源标签
    const sourceDiv = document.createElement('div');
    sourceDiv.className = 'spoiler-source';
    sourceDiv.textContent = '出自：' + source;
    spoiler.appendChild(sourceDiv);
    
    // 将剧透内容包装到一个 div 中以应用模糊效果
    const contentDiv = document.createElement('div');
    contentDiv.className = 'spoiler-content';
    // 将所有子元素移动到新的内容 div 中
    while (spoiler.firstChild && spoiler.firstChild !== sourceDiv) {
      contentDiv.appendChild(spoiler.firstChild);
    }
    spoiler.appendChild(contentDiv);
    
    // 创建操作按钮容器
    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'spoiler-actions';
    
    // 创建查看剧透按钮
    const revealBtn = document.createElement('button');
    revealBtn.className = 'spoiler-btn view-spoiler';
    revealBtn.textContent = '点击查看剧透';
    revealBtn.onclick = (e) => {
      e.stopPropagation();
      spoiler.classList.add('revealed');
    };
    actionsDiv.appendChild(revealBtn);
    
    // 检查是否有对应的链接配置
    const link = spoilerLinksMap.value[source] || '';
    if (link) {
      // 创建前往原作按钮
      const sourceBtn = document.createElement('a');
      sourceBtn.className = 'spoiler-btn goto-source';
      sourceBtn.textContent = '前往原作';
      sourceBtn.href = link;
      actionsDiv.appendChild(sourceBtn);
    } else {
      // 创建敬请催更按钮
      const pendingBtn = document.createElement('button');
      pendingBtn.className = 'spoiler-btn pending-source';
      pendingBtn.textContent = '敬请催更';
      pendingBtn.onclick = (e) => {
        e.stopPropagation();
      };
      actionsDiv.appendChild(pendingBtn);
    }
    
    spoiler.appendChild(actionsDiv);
  });
  
  parsedContent.value = doc.body.innerHTML;
};

// 加载数据的函数
const loadData = async () => {
  loading.value = true;
  try {
    const data = await loadContentEntry(categoryType.value, entryId.value);
    entry.value = data;
    updateParsedContent(); // 初始渲染
  } catch (error) {
    console.error('Failed to load entry', error);
  } finally {
    loading.value = false;
  }
};

// 初始加载
onMounted(loadData);

// 监听路由参数变化，重新加载数据
watch([() => route.params.type, () => route.params.id], ([newType, newId], [oldType, oldId]) => {
  if (newType !== oldType || newId !== oldId) {
    loadData();
  }
});

// 监听 showAllSpoilers 的变化，重新渲染内容
watch(showAllSpoilers, () => {
  updateParsedContent();
});

// 事件委托处理函数
const handleEntryBodyClick = (event) => {
  const target = event.target;
  
  // 查找被点击元素或其父元素中最近的 .spoiler 元素
  const spoilerElement = target.closest('.spoiler');
  
  if (spoilerElement && !spoilerElement.classList.contains('revealed')) {
    // 如果点击的是未揭示的剧透块，手动添加 revealed 类
    spoilerElement.classList.add('revealed');
  }
};
</script>