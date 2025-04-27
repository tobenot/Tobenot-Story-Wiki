<template>
  <span 
    :class="[
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors',
      clickable ? 'cursor-pointer hover:scale-105 duration-200' : '',
      colorClasses
    ]"
    @click="handleClick"
  >
    {{ text }}
  </span>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  text: {
    type: String,
    required: true
  },
  color: {
    type: String,
    default: 'default'
  },
  clickable: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['click']);

const colorClasses = computed(() => {
  const colorMap = {
    default: 'bg-cosmic-700/40 text-starlight-300 border border-cosmic-600/40 hover:border-cosmic-500/50',
    primary: 'bg-primary-900/30 text-primary-300 border border-primary-700/40 hover:border-primary-600/50',
    secondary: 'bg-secondary-900/30 text-secondary-300 border border-secondary-700/40 hover:border-secondary-600/50',
    accent: 'bg-accent-900/30 text-accent-300 border border-accent-700/40 hover:border-accent-600/50',
    success: 'bg-green-900/30 text-green-300 border border-green-700/40 hover:border-green-600/50',
    warning: 'bg-yellow-900/30 text-yellow-300 border border-yellow-700/40 hover:border-yellow-600/50',
    danger: 'bg-red-900/30 text-red-300 border border-red-700/40 hover:border-red-600/50'
  };
  
  return colorMap[props.color] || colorMap.default;
});

const handleClick = (event) => {
  if (props.clickable) {
    emit('click', props.text);
    // Prevent click propagation if this is inside a link
    event.preventDefault();
    event.stopPropagation();
  }
};
</script>