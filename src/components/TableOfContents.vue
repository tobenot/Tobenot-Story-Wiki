<template>
  <nav class="toc">
    <ul class="space-y-2">
      <li v-for="heading in headings" :key="heading.id" :class="{ 'ml-3': heading.level > 2 }">
        <a 
          :href="`#${heading.id}`" 
          :class="[
            'hover:text-starlight-100 py-1 transition-colors duration-150 border-l-2 pl-2',
            isActiveHeading(heading.id) 
              ? 'text-starlight-100 border-starlight-500 font-medium' 
              : 'text-starlight-300 border-transparent hover:border-starlight-500/50'
          ]"
          @click.prevent="scrollToHeading(heading.id)"
        >
          {{ heading.text }}
        </a>
      </li>
      <li v-if="headings.length === 0" class="text-starlight-400 text-sm py-1">
        无目录内容
      </li>
    </ul>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue';

const props = defineProps({
  headings: {
    type: Array,
    default: () => []
  }
});

const activeHeadingId = ref('');

// 监听滚动事件
const handleScroll = () => {
  if (props.headings.length === 0) return;
  
  // 拿到所有标题元素
  const headingElements = props.headings.map(heading => document.getElementById(heading.id));
  
  // 过滤掉不存在的元素
  const visibleHeadings = headingElements.filter(el => el !== null);
  
  // 如果没有可见的标题，直接返回
  if (visibleHeadings.length === 0) return;
  
  // 查找当前在视口中的标题
  const viewportHeight = window.innerHeight;
  let currentHeadingId = visibleHeadings[0].id;
  
  for (const headingEl of visibleHeadings) {
    const rect = headingEl.getBoundingClientRect();
    // 如果标题顶部在视口上方，但底部在视口下方，或者顶部在视口中，则认为是当前标题
    if ((rect.top <= 150 && rect.bottom > 150) || (rect.top > 0 && rect.top <= viewportHeight * 0.3)) {
      currentHeadingId = headingEl.id;
      break;
    }
  }
  
  activeHeadingId.value = currentHeadingId;
};

// 点击目录项跳转到对应标题
const scrollToHeading = (id) => {
  const headingElement = document.getElementById(id);
  if (headingElement) {
    // 计算要滚动到的位置：元素距顶部的距离减去一个偏移量（如导航栏高度）
    const scrollOffset = 120; // 可调整此值以匹配您的布局
    const elementPosition = headingElement.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementPosition - scrollOffset;
    
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
    
    // 等滚动结束后更新活动项
    nextTick(() => {
      activeHeadingId.value = id;
    });
  }
};

// 判断是否是当前活动标题
const isActiveHeading = (id) => {
  return id === activeHeadingId.value;
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
  // 初始调用一次以设置初始活动项
  handleScroll();
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
.toc {
  font-size: 0.9rem;
}

.toc ul {
  list-style-type: none;
  padding: 0;
}

.toc a {
  display: block;
  transition: all 0.15s ease;
  border-left-width: 2px;
  margin-bottom: 0.25rem;
}

.toc a:hover {
  transform: translateX(2px);
}
</style>