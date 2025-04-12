<template>
  <div 
    class="spoiler" 
    :class="{ 'revealed': isRevealed || globallyRevealed }"
    :data-source="source"
    @click="reveal"
  >
    <div class="spoiler-source">出自：{{ source }}</div>
    
    <div class="spoiler-content" :class="{ 'blur-md': !isRevealed && !globallyRevealed }">
      <slot></slot>
    </div>
    
    <div class="spoiler-actions" v-if="!isRevealed && !globallyRevealed">
      <button @click.stop="reveal" class="spoiler-btn view-spoiler">
        点击查看剧透
      </button>
      
      <a v-if="sourceLink" :href="sourceLink" class="spoiler-btn goto-source">
        前往原作
      </a>
      <button v-else class="spoiler-btn pending-source">
        敬请催更
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  source: {
    type: String,
    required: true,
    default: '未知来源'
  },
  globallyRevealed: {
    type: Boolean,
    default: false
  },
  sourceLink: {
    type: String,
    default: ''
  }
});

const isRevealed = ref(false);

const reveal = () => {
  isRevealed.value = true;
};
</script>