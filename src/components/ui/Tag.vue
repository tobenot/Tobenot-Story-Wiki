<template>
  <span 
    class="inline-block px-3 py-1 rounded-full text-sm font-medium transition-colors"
    :class="[`bg-${color}-100 text-${color}-800 dark:bg-${color}-900 dark:text-${color}-200`, { 'cursor-pointer hover:bg-opacity-75': clickable }]"
    @click="handleClick"
  >
    <slot>{{ text }}</slot>
  </span>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  text: {
    type: String,
    default: ''
  },
  color: {
    type: String,
    default: 'primary'
  },
  clickable: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['click']);

const handleClick = (event) => {
  if (props.clickable) {
    emit('click', event);
  }
};
</script>