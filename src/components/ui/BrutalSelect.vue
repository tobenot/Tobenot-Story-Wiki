<template>
  <div class="brutal-select relative" ref="root">
    <button
      type="button"
      class="brutal-control w-full border-2 border-slate-900 bg-white/90 backdrop-blur-sm px-4 py-2.5 pr-8 focus:border-starlight-500 text-gray-700 cursor-pointer text-left flex items-center"
      :class="{ 'shadow-brutal-lg': open }"
      @click="toggle"
      @keydown.down.prevent="open ? move(1) : (open = true)"
      @keydown.up.prevent="open ? move(-1) : (open = true)"
      @keydown.esc="close"
    >
      <span class="flex-1 truncate">{{ currentLabel }}</span>
      <span class="absolute right-3 top-1/2 transform -translate-y-1/2 text-starlight-500 pointer-events-none">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 transition-transform" :class="{ 'rotate-180': open }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </span>
    </button>

    <transition
      enter-active-class="transition ease-out duration-150"
      enter-from-class="opacity-0 -translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-100"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-1"
    >
      <ul
        v-if="open"
        class="absolute z-50 mt-1 w-full bg-white border-2 border-slate-900 shadow-brutal max-h-72 overflow-y-auto"
      >
        <li
          v-for="(opt, i) in options"
          :key="opt.value"
          @click="choose(opt)"
          @mouseenter="hoverIndex = i"
          class="px-4 py-2.5 cursor-pointer text-left transition-colors border-b border-slate-100 last:border-0"
          :class="[
            opt.value === modelValue
              ? 'bg-starlight-100 text-starlight-800 font-bold'
              : hoverIndex === i
                ? 'bg-slate-100 text-slate-900'
                : 'text-slate-700'
          ]"
        >
          {{ opt.label }}
        </li>
      </ul>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';

const props = defineProps({
  modelValue: { type: [String, Number], default: '' },
  options: { type: Array, default: () => [] }, // [{ value, label }]
});
const emit = defineEmits(['update:modelValue', 'change']);

const root = ref(null);
const open = ref(false);
const hoverIndex = ref(0);

const currentLabel = computed(() => {
  const match = props.options.find(o => o.value === props.modelValue);
  return match ? match.label : '';
});

const toggle = () => {
  open.value = !open.value;
  if (open.value) syncHover();
};

const close = () => { open.value = false; };

const syncHover = () => {
  const i = props.options.findIndex(o => o.value === props.modelValue);
  hoverIndex.value = i >= 0 ? i : 0;
};

const move = (dir) => {
  const n = props.options.length;
  if (!n) return;
  hoverIndex.value = (hoverIndex.value + dir + n) % n;
};

const choose = (opt) => {
  emit('update:modelValue', opt.value);
  emit('change', opt.value);
  close();
};

const onClickOutside = (e) => {
  if (root.value && !root.value.contains(e.target)) close();
};

watch(open, (v) => { if (v) syncHover(); });

onMounted(() => document.addEventListener('click', onClickOutside));
onBeforeUnmount(() => document.removeEventListener('click', onClickOutside));
</script>

<style scoped>
.brutal-control {
  @apply shadow-brutal transition-all duration-200;
}
.brutal-control:hover {
  @apply shadow-brutal-lg -translate-y-0.5;
}
.brutal-control:focus {
  outline: none;
}
.brutal-control:active {
  transform: translate(2px, 2px);
  box-shadow: 4px 4px 0 0 rgba(15, 23, 42, 0.9);
}
</style>
