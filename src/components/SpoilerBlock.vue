<template>
  <div 
    class="spoiler" 
    :class="{ 'revealed': isRevealed || globallyRevealed }"
    :data-source="source"
    @click="reveal"
  >
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'SpoilerBlock',
  props: {
    source: {
      type: String,
      required: true,
      default: '未知来源'
    },
    globallyRevealed: {
      type: Boolean,
      default: false
    }
  },
  setup() {
    const isRevealed = ref(false)
    
    const reveal = () => {
      isRevealed.value = true
    }
    
    return {
      isRevealed,
      reveal
    }
  }
})
</script>

<style scoped>
.spoiler {
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

.spoiler::before {
  content: attr(data-source);
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  padding: 0.5rem;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  font-size: 0.9rem;
  text-align: center;
  opacity: 0;
  transition: opacity 0.3s;
  border-radius: 4px 4px 0 0;
  pointer-events: none;
}

.spoiler:hover::before {
  opacity: 1;
}

.spoiler:hover {
  filter: blur(3px);
}

.spoiler.revealed {
  filter: blur(0);
  user-select: auto;
  cursor: default;
}

.spoiler.revealed::before {
  opacity: 0;
}
</style> 