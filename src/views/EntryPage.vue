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
import { ref, computed, onMounted, watch, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { loadContentEntry, renderContent, getSpoilerLink } from '../services/contentService';
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

const pendingSourceLink = 'https://github.com/tobenot/tobenot.github.io/issues';

// 更新渲染内容的逻辑
const updateParsedContent = () => {
  console.log('%cupdateParsedContent START. showAllSpoilers:', 'color: green;', showAllSpoilers.value); // Log function start and state
  if (!entry.value || !entry.value.content) {
    console.log('updateParsedContent: No entry or content, returning.'); // Log exit condition
    parsedContent.value = '';
    return;
  }
  parsedContent.value = renderContent(entry.value.content);
  console.log('updateParsedContent: Content rendered.'); // Log content rendering

  // Use nextTick to ensure the DOM is updated with parsedContent
  nextTick(() => {
    console.log('%cupdateParsedContent: nextTick START.', 'color: orange;'); // Log nextTick start
    const container = document.querySelector('.prose');
    if (!container) {
        console.error('Content container .prose not found after nextTick');
        return;
    }
    console.log('updateParsedContent: Container found.'); // Log container found

    const spoilers = container.querySelectorAll('.spoiler');
    console.log(`updateParsedContent: Found ${spoilers.length} spoilers.`); // Log spoiler count

    spoilers.forEach((spoiler, index) => {
      console.log(`Processing spoiler ${index}...`); // Log each spoiler
      const source = spoiler.getAttribute('data-source') || '未知来源';

      // --- 1. Ensure Structure --- 
      let sourceDiv = spoiler.querySelector('.spoiler-source');
      if (!sourceDiv) {
          console.log(`Spoiler ${index}: Creating sourceDiv.`);
          sourceDiv = document.createElement('div');
          sourceDiv.className = 'spoiler-source';
          spoiler.insertBefore(sourceDiv, spoiler.firstChild);
      } else {
          console.log(`Spoiler ${index}: Found existing sourceDiv.`);
      }
      sourceDiv.textContent = '出自：' + source;

      let contentDiv = spoiler.querySelector('.spoiler-content');
      if (!contentDiv) {
          console.log(`Spoiler ${index}: Creating contentDiv.`);
          contentDiv = document.createElement('div');
          contentDiv.className = 'spoiler-content';
          let currentActionsDiv = spoiler.querySelector('.spoiler-actions');
          const nodesToMove = [];
          let currentNode = sourceDiv.nextSibling;
          // Carefully iterate and collect nodes between source and actions (or end)
          while (currentNode && currentNode !== currentActionsDiv) {
              nodesToMove.push(currentNode);
              currentNode = currentNode.nextSibling;
          }
          console.log(`Spoiler ${index}: Moving ${nodesToMove.length} nodes into contentDiv.`);
          nodesToMove.forEach(node => contentDiv.appendChild(node));
          sourceDiv.insertAdjacentElement('afterend', contentDiv);
      } else {
         console.log(`Spoiler ${index}: Found existing contentDiv.`);
      }

      let actionsDiv = spoiler.querySelector('.spoiler-actions');
      if (!actionsDiv) {
        console.log(`Spoiler ${index}: Creating actionsDiv.`);
        actionsDiv = document.createElement('div');
        actionsDiv.className = 'spoiler-actions';
        spoiler.appendChild(actionsDiv);
      } else {
        console.log(`Spoiler ${index}: Clearing existing actionsDiv.`);
        actionsDiv.innerHTML = ''; // Clear old buttons
      }
      console.log(`Spoiler ${index}: Structure ensured.`);
      
      // --- 2. Apply Global State --- 
      const isGloballyRevealed = showAllSpoilers.value;
      console.log(`Spoiler ${index}: Applying global state. isGloballyRevealed = ${isGloballyRevealed}`); // Log state application
      spoiler.classList.toggle('revealed', isGloballyRevealed);
      console.log(`Spoiler ${index}: classList after toggle = ${spoiler.className}`); // Log class list

      // --- 3. Create Buttons --- 
      // a) Toggle Button
      console.log(`Spoiler ${index}: Creating revealBtn.`);
      const revealBtn = document.createElement('button');
      revealBtn.className = 'spoiler-btn view-spoiler';
      revealBtn.textContent = isGloballyRevealed ? '收起剧透' : '点击查看剧透';

      revealBtn.onclick = (e) => {
        e.stopPropagation();
        console.log(`Spoiler ${index}: revealBtn clicked. showAllSpoilers = ${showAllSpoilers.value}`);
        if (!showAllSpoilers.value) { 
            const shouldBeRevealedNow = !spoiler.classList.contains('revealed');
            console.log(`Spoiler ${index}: Toggling individual state to ${shouldBeRevealedNow}`);
            spoiler.classList.toggle('revealed', shouldBeRevealedNow);
            revealBtn.textContent = shouldBeRevealedNow ? '收起剧透' : '点击查看剧透';
        } else {
             console.log(`Spoiler ${index}: Global reveal is active. Use the main toggle first.`);
        }
      };
      actionsDiv.appendChild(revealBtn);

      // b) Link/Pending Button
      const link = getSpoilerLink(source);
      if (link) {
        console.log(`Spoiler ${index}: Creating source link button.`);
        const sourceLinkEl = document.createElement('a');
        sourceLinkEl.className = 'spoiler-btn goto-source';
        sourceLinkEl.textContent = '前往原作';
        sourceLinkEl.href = link;
        sourceLinkEl.target = '_blank';
        sourceLinkEl.rel = 'noopener noreferrer';
        actionsDiv.appendChild(sourceLinkEl);
      } else {
        console.log(`Spoiler ${index}: Creating pending link button.`);
        const pendingLinkEl = document.createElement('a'); 
        pendingLinkEl.className = 'spoiler-btn pending-source';
        pendingLinkEl.textContent = '敬请催更';
        pendingLinkEl.href = pendingSourceLink;
        pendingLinkEl.target = '_blank'; 
        pendingLinkEl.rel = 'noopener noreferrer';
        actionsDiv.appendChild(pendingLinkEl);
      }
      console.log(`Spoiler ${index}: Processing complete.`); // Log spoiler completion
    });
    console.log('%cupdateParsedContent: nextTick END.', 'color: orange; font-weight: bold;'); // Log nextTick end
  });
  console.log('%cupdateParsedContent END.', 'color: green; font-weight: bold;'); // Log function end
};

// Watcher remains the same: triggers re-run of updateParsedContent
watch(showAllSpoilers, (newValue) => {
  console.log('%cWATCH showAllSpoilers triggered. New value:', 'color: blue; font-weight: bold;', newValue); // Log global toggle watch
  updateParsedContent();
});

watch(entry, (newEntry) => {
  console.log('%cWATCH entry triggered. New entry exists:', 'color: blue; font-weight: bold;', !!newEntry); // Log watch trigger
  if (newEntry) {
    updateParsedContent();
  } else {
    parsedContent.value = '';
  }
}, { immediate: true }); // Ensure it runs on initial load

// 加载数据的函数
const loadData = async () => {
  loading.value = true;
  entry.value = null; // Reset entry
  try {
    const data = await loadContentEntry(categoryType.value, entryId.value);
    entry.value = data;
    // Ensure updateParsedContent runs AFTER entry data is loaded
    // and the initial parsedContent is set in the DOM
    if (data) { 
      updateParsedContent(); // Setup spoilers after data load
    } else {
       console.error(`Entry data is null for ${categoryType.value}/${entryId.value}`);
    }
  } catch (error) {
    console.error(`Failed to load content entry for ${categoryType.value}/${entryId.value}:`, error);
  } finally {
    loading.value = false;
  }
};

// 初始加载
onMounted(loadData);

// 监听路由参数变化，重新加载数据
watch([categoryType, entryId], loadData);
</script>