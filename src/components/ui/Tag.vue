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
  // 根据颜色类型返回对应的类名
  const colors = {
    default: {
      light: 'bg-cosmic-100 text-cosmic-800 border border-cosmic-200 hover:border-cosmic-300',
      dark: 'dark:bg-cosmic-700/40 dark:text-starlight-300 dark:border dark:border-cosmic-600/40 dark:hover:border-cosmic-500/50'
    },
    primary: {
      light: 'bg-primary-50 text-primary-800 border border-primary-200 hover:border-primary-300',
      dark: 'dark:bg-primary-900/30 dark:text-primary-300 dark:border dark:border-primary-700/40 dark:hover:border-primary-600/50'
    },
    secondary: {
      light: 'bg-secondary-50 text-secondary-800 border border-secondary-200 hover:border-secondary-300',
      dark: 'dark:bg-secondary-900/30 dark:text-secondary-300 dark:border dark:border-secondary-700/40 dark:hover:border-secondary-600/50'
    },
    accent: {
      light: 'bg-accent-50 text-accent-800 border border-accent-200 hover:border-accent-300',
      dark: 'dark:bg-accent-900/30 dark:text-accent-300 dark:border dark:border-accent-700/40 dark:hover:border-accent-600/50'
    },
    success: {
      light: 'bg-green-50 text-green-800 border border-green-200 hover:border-green-300',
      dark: 'dark:bg-green-900/30 dark:text-green-300 dark:border dark:border-green-700/40 dark:hover:border-green-600/50'
    },
    warning: {
      light: 'bg-yellow-50 text-yellow-800 border border-yellow-200 hover:border-yellow-300',
      dark: 'dark:bg-yellow-900/30 dark:text-yellow-300 dark:border dark:border-yellow-700/40 dark:hover:border-yellow-600/50'
    },
    danger: {
      light: 'bg-red-50 text-red-800 border border-red-200 hover:border-red-300',
      dark: 'dark:bg-red-900/30 dark:text-red-300 dark:border dark:border-red-700/40 dark:hover:border-red-600/50'
    }
  };
  
  const selectedColor = colors[props.color] || colors.default;
  return `${selectedColor.light} ${selectedColor.dark}`;
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