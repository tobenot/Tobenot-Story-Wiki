<template>
  <span 
    :class="[
      'inline-flex items-center px-2.5 py-0.5 text-xs font-medium transition-colors border border-slate-900',
      colorClasses,
      clickable ? 'cursor-pointer hover:bg-opacity-80' : ''
    ]"
    @click="handleClick"
  >
    <slot>{{ text }}</slot>
  </span>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  text: {
    type: String,
    default: ''
  },
  color: {
    type: String,
    default: 'gray'
  },
  clickable: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['click']);

const colorClasses = computed(() => {
  const colorMap = {
    gray: 'bg-gray-100 text-gray-800',
    primary: 'bg-primary-100 text-primary-800',
    secondary: 'bg-secondary-100 text-secondary-800',
    accent: 'bg-accent-100 text-accent-800',
    starlight: 'bg-starlight-100 text-starlight-800',
  };
  
  return colorMap[props.color] || colorMap.gray;
});

const handleClick = (event) => {
  if (props.clickable) {
    emit('click', event);
  }
};
</script>