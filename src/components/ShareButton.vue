<template>
  <div ref="root" class="share-root relative">
    <!-- 触发按钮 -->
    <button
      type="button"
      class="btn share-trigger flex items-center"
      :aria-expanded="isOpen"
      aria-haspopup="menu"
      @click="toggle"
    >
      <ShareIcon class="h-4 w-4 mr-2" />
      <span>分享</span>
      <ChevronDownIcon
        class="h-3.5 w-3.5 ml-1.5 transition-transform duration-200"
        :class="{ 'rotate-180': isOpen }"
      />
    </button>

    <!-- 遮罩（仅手机端底部抽屉时） -->
    <transition name="fade">
      <div v-if="isOpen && isMobile" class="share-backdrop" @click="close"></div>
    </transition>

    <!-- 弹出菜单：桌面端为右上角下拉卡片，手机端为底部抽屉 -->
    <transition :name="isMobile ? 'sheet' : 'pop'">
      <div
        v-if="isOpen"
        :class="isMobile
          ? 'fixed inset-x-0 bottom-0 z-50 bg-white border-2 border-slate-900 border-b-0 shadow-brutal-lg p-4 pb-6 share-menu share-sheet'
          : 'absolute right-0 bottom-full mb-2 w-72 z-50 bg-white border-2 border-slate-900 shadow-brutal-lg p-3 share-menu'"
        "
        role="menu"
      >
        <!-- 微信二维码子面板 -->
        <div v-if="wechatOpen" class="flex flex-col items-center text-center">
          <div class="w-full flex justify-between items-center mb-3">
            <button type="button" class="flex items-center text-sm font-medium text-slate-600 hover:text-slate-900" @click="wechatOpen = false">
              <ArrowLeftIcon class="h-4 w-4 mr-1" />
              返回
            </button>
            <button type="button" class="text-slate-400 hover:text-slate-900" @click="close" aria-label="关闭">
              <XMarkIcon class="h-4 w-4" />
            </button>
          </div>
          <p class="text-sm font-bold text-slate-900 mb-2">微信扫一扫 / 长按识别</p>
          <div class="w-44 h-44 border-2 border-slate-900 bg-slate-50 flex items-center justify-center overflow-hidden">
            <div v-if="qrError" class="text-xs text-slate-500 px-3 text-center leading-relaxed">
              二维码加载失败<br />请使用「复制链接」
            </div>
            <img
              v-else
              :src="qrUrl"
              alt="页面二维码"
              class="w-full h-full object-contain"
              loading="lazy"
              @error="qrError = true"
            />
          </div>
          <button type="button" class="mt-3 w-full share-row" @click="copyLink">
            <LinkIcon class="h-4 w-4" />
            <span>{{ copied ? '已复制 ✓' : '复制链接' }}</span>
          </button>
        </div>

        <!-- 主面板 -->
        <div v-else class="flex flex-col">
          <div class="flex justify-between items-center mb-2">
            <span class="text-sm font-bold text-slate-900">分享到</span>
            <button type="button" class="text-slate-400 hover:text-slate-900 transition-colors" @click="close" aria-label="关闭">
              <XMarkIcon class="h-4 w-4" />
            </button>
          </div>

          <div class="h-px w-full bg-slate-200 mb-2"></div>

          <!-- 微信内浏览器引导：微信会拦截 navigator.share，提示用右上角菜单 -->
          <div v-if="isWeChat" class="mb-2 p-2.5 border-2 border-green-700 bg-green-50 text-green-900 text-xs leading-relaxed font-medium">
            在微信内打开时，请点击右上角 <span class="font-bold">···</span> → 选择「发送给朋友 / 分享到朋友圈」。
          </div>

          <!-- 系统分享（仅支持 navigator.share 时显示，置顶） -->
          <button
            v-if="canNativeShare"
            type="button"
            class="share-row bg-slate-900 text-white mb-2"
            @click="nativeShare"
          >
            <DevicePhoneMobileIcon class="h-4 w-4" />
            <span>系统分享…</span>
          </button>

          <!-- 微信 -->
          <button type="button" class="share-row" @click="wechatOpen = true">
            <svg class="h-4 w-4 text-green-600" viewBox="0 0 24 24" fill="currentColor"><path d="M8.69 4C4.99 4 2 6.46 2 9.5c0 1.74.99 3.29 2.54 4.31L4 16l2.13-1.15c.81.22 1.66.34 2.56.34h.24a5.5 5.5 0 0 1-.18-1.4c0-3.04 2.95-5.5 6.59-5.5.17 0 .34.01.5.02C15.9 5.86 12.6 4 8.69 4Zm-2.6 3.3a.95.95 0 1 1 0-1.9.95.95 0 0 1 0 1.9Zm5.2 0a.95.95 0 1 1 0-1.9.95.95 0 0 1 0 1.9Z M15.34 9.2c-3.06 0-5.54 2.05-5.54 4.58 0 2.53 2.48 4.58 5.54 4.58.63 0 1.23-.09 1.79-.25L18.8 19l-.37-1.45c1.2-.84 1.97-2.06 1.97-3.42 0-2.53-2.48-4.58-5.54-4.58Zm-1.7 3.6a.78.78 0 1 1 0-1.56.78.78 0 0 1 0 1.56Zm3.4 0a.78.78 0 1 1 0-1.56.78.78 0 0 1 0 1.56Z"/></svg>
            <span>微信（二维码）</span>
          </button>

          <!-- 微博 -->
          <button type="button" class="share-row" @click="shareToWeibo">
            <svg class="h-4 w-4 text-red-600" viewBox="0 0 24 24" fill="currentColor"><path d="M10.1 20.32c-3.98 0-7.22-1.94-7.22-4.33 0-1.27.81-2.7 2.19-4.05 1.85-1.81 4.03-2.66 4.86-1.81.37.37.2 1.31-.16 2.29-.18.5.05.56.39.21.33-.35 1.66-1.45 2.34-2.35.39-.64.35-1.35-.01-1.7-1.83-1.8-8.28.21-8.28-3.16 0-1.73 2.66-3.94 9.07-3.94 4.43 0 9.14 1.9 9.14 5.33 0 2.16-2.25 3.77-4.42 4.15-.53.09-.94.16-.94-.12 0-.27.32-.7.32-1.19 0-.7-.91-.78-1.16-.78-1.3 0-2.7 1.33-2.7 2.95 0 1.03.44 1.44 1.26 1.44.82 0 1.59-.27 2.35-.76.72.32 1.07 1.92-1.28 3.13-1.26.64-3.5 1.7-5.75 1.7Zm7.02-16.94c-.18-.52-.91-.57-1.16-.07-.25.5 0 1.03.44 1.25.44.22.91 0 1.09-.5.18-.5-.2-.34-.37-.68Z"/></svg>
            <span>微博</span>
          </button>

          <!-- QQ -->
          <button type="button" class="share-row" @click="shareToQQ">
            <svg class="h-4 w-4 text-blue-600" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c-2.27 0-6.29 1.81-6.2 7.48.06 2.4-.42 4.86-.12 5.4.45.77.9 1.05 1.48 1.21.97.26 1.17-.73 1.28-1.24.12-.56.24-1.05.46-1.08.55-.09 1.03 1.01 1.66 1.73.13.15.33.33.62.33.5 0 1.09-.24 1.52-.6.2-.17.43-.31.4-.57-.11-.93-.28-1.17-.81-1.63-.7-.62-1.79-1.68-1.84-2.41-.01-.18.11-.36.28-.49.22-.15.92-.47 1.35-.66 1.16-.5 1.18-1.32.22-1.58-1.17-.32-4.47-.97-3.68-1.88.16-.17.62-.68 1.14-.68.52 0 1.68.39 2.05.62.39.23 1.1.23 1.53 0 .42-.23 1.58-.62 2.05-.62.52 0 .98.51 1.14.68.8.91-2.51 1.56-3.68 1.88-.96.26-.94 1.08.22 1.58.44.19 1.14.51 1.35.66.17.12.29.31.28.48-.04.73-1.13 1.79-1.84 2.41-.52.46-.69.7-.8 1.63-.3.26.2.4.4.57.42.36 1.01.6 1.51.6.28 0 .49-.18.62-.33.63-.72 1.11-1.82 1.66-1.73.22.04.34.52.46 1.08.11.51.31 1.5 1.28 1.24.58-.16 1.03-.44 1.48-1.21.3-.54-.18-2.99-.12-5.4C18.29 3.81 14.27 2 12 2Z"/></svg>
            <span>QQ</span>
          </button>

          <!-- X / Twitter -->
          <button type="button" class="share-row" @click="shareToTwitter">
            <svg class="h-4 w-4 text-slate-900" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.656l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z"/></svg>
            <span>X（Twitter）</span>
          </button>

          <!-- Telegram -->
          <button type="button" class="share-row" @click="shareToTelegram">
            <svg class="h-4 w-4 text-sky-500" viewBox="0 0 24 24" fill="currentColor"><path d="M21.94 4.5 18.6 20.2c-.25 1.1-.9 1.38-1.83.86l-5.05-3.72-2.44 2.35c-.27.27-.5.5-1.02.5l.36-5.13L17.97 6.6c.4-.36-.09-.56-.63-.2L6.36 13.4l-4.9-1.53c-1.07-.33-1.09-1.07.22-1.58L20.55 2.9c.89-.33 1.67.2 1.39 1.6Z"/></svg>
            <span>Telegram</span>
          </button>

          <!-- 邮件 -->
          <button type="button" class="share-row" @click="shareToEmail">
            <EnvelopeIcon class="h-4 w-4 text-slate-700" />
            <span>邮件</span>
          </button>

          <div class="h-px w-full bg-slate-200 my-2"></div>

          <!-- 复制链接 -->
          <button type="button" class="share-row" @click="copyLink">
            <LinkIcon class="h-4 w-4" />
            <span>{{ copied ? '已复制 ✓' : '复制链接' }}</span>
          </button>

          <!-- 复制结果 / 失败提示 -->
          <transition name="fade">
            <div v-if="copyMsg" class="mt-2 text-center text-xs font-medium" :class="copyOk ? 'text-green-700' : 'text-red-600'">
              {{ copyMsg }}
            </div>
          </transition>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import {
  ShareIcon,
  ChevronDownIcon,
  XMarkIcon,
  LinkIcon,
  ArrowLeftIcon,
  EnvelopeIcon,
  DevicePhoneMobileIcon,
} from '@heroicons/vue/24/outline';

const props = defineProps({
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  image: { type: String, default: '' },
});

const root = ref(null);
const isOpen = ref(false);
const wechatOpen = ref(false);
const copied = ref(false);
const copyMsg = ref('');
const copyOk = ref(true);
const qrError = ref(false);
const isMobile = ref(false);

const canNativeShare = computed(() => typeof navigator !== 'undefined' && typeof navigator.share === 'function');
// 微信内置浏览器：会拦截 navigator.share，需引导用户用右上角菜单
const isWeChat = computed(() => typeof navigator !== 'undefined' && /MicroMessenger/i.test(navigator.userAgent));
// 手机端（触屏 + 窄屏）且非微信内 → 优先直接唤起原生分享面板
const preferNativeShare = computed(() => isMobile.value && canNativeShare.value && !isWeChat.value);

const shareTitle = computed(() => props.title || document.title);
const shareDesc = computed(() => props.description || '');
const currentUrl = () => window.location.href;

const resolvedImage = computed(() => {
  if (!props.image) return '';
  if (/^https?:\/\//i.test(props.image)) return props.image;
  const origin = window.location.origin;
  return props.image.startsWith('/') ? `${origin}${props.image}` : `${origin}/${props.image}`;
});

const qrUrl = computed(() => `https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=0&data=${encodeURIComponent(currentUrl())}`);

function vibrate(ms = 8) {
  try { navigator.vibrate && navigator.vibrate(ms); } catch (e) { /* ignore */ }
}

function toggle() {
  // 手机端（非微信内）原生分享可用时：一步直接弹系统面板（含微信/复制/短信等）。
  // 取消即回页面，不打扰；失败再回退到自定义菜单。
  if (preferNativeShare.value && !isOpen.value) {
    nativeShare();
    return;
  }
  isOpen.value = !isOpen.value;
  if (!isOpen.value) wechatOpen.value = false;
}

function close() {
  isOpen.value = false;
  wechatOpen.value = false;
}

async function nativeShare() {
  try {
    await navigator.share({
      title: shareTitle.value,
      text: shareDesc.value,
      url: currentUrl(),
    });
    close();
  } catch (e) {
    // 用户取消（AbortError）→ 不再展开菜单；其它失败 → 回退到自定义菜单
    if (e && e.name === 'AbortError') {
      close();
      return;
    }
    isOpen.value = true;
  }
}

function openShare(url) {
  window.open(url, '_blank', 'noopener,noreferrer');
  close();
}

function shareToWeibo() {
  const url = encodeURIComponent(currentUrl());
  const title = encodeURIComponent(shareTitle.value);
  const pic = resolvedImage.value ? `&pic=${encodeURIComponent(resolvedImage.value)}` : '';
  openShare(`https://service.weibo.com/share/share.php?url=${url}&title=${title}${pic}`);
}

function shareToQQ() {
  const url = encodeURIComponent(currentUrl());
  const title = encodeURIComponent(shareTitle.value);
  const summary = encodeURIComponent(shareDesc.value);
  const pics = resolvedImage.value ? `&pics=${encodeURIComponent(resolvedImage.value)}` : '';
  openShare(`https://connect.qq.com/widget/shareqq/index.html?url=${url}&title=${title}&summary=${summary}${pics}`);
}

function shareToTwitter() {
  const url = encodeURIComponent(currentUrl());
  const text = encodeURIComponent(shareTitle.value);
  openShare(`https://twitter.com/intent/tweet?url=${url}&text=${text}`);
}

function shareToTelegram() {
  const url = encodeURIComponent(currentUrl());
  const text = encodeURIComponent(shareTitle.value);
  openShare(`https://t.me/share/url?url=${url}&text=${text}`);
}

function shareToEmail() {
  const subject = encodeURIComponent(shareTitle.value);
  const body = encodeURIComponent(`${shareDesc.value}\n\n${currentUrl()}`);
  window.location.href = `mailto:?subject=${subject}&body=${body}`;
  close();
}

async function copyLink() {
  const url = currentUrl();
  copied.value = false;
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(url);
    } else {
      // 兜底：非安全上下文 / 旧浏览器 / 权限被拒
      const ta = document.createElement('textarea');
      ta.value = url;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(ta);
      if (!ok) throw new Error('execCommand failed');
    }
    copied.value = true;
    copyOk.value = true;
    copyMsg.value = '链接已复制到剪贴板';
    vibrate(12);
  } catch (e) {
    copyOk.value = false;
    copyMsg.value = '复制失败，请手动复制地址栏链接';
  }
  setTimeout(() => {
    copyMsg.value = '';
    if (copyOk.value) close();
  }, 1800);
}

// 点击外部 / Esc 关闭
function onDocClick(e) {
  if (isOpen.value && root.value && !root.value.contains(e.target)) {
    close();
  }
}
function onKeydown(e) {
  if (e.key === 'Escape' && isOpen.value) close();
}

onMounted(() => {
  // 触屏 + 窄屏视为手机端（排除触屏笔记本的大屏情况）
  isMobile.value = window.matchMedia('(pointer: coarse) and (max-width: 768px)').matches;
  document.addEventListener('click', onDocClick);
  document.addEventListener('keydown', onKeydown);
});
onUnmounted(() => {
  document.removeEventListener('click', onDocClick);
  document.removeEventListener('keydown', onKeydown);
});
</script>

<style scoped>
.share-root {
  display: inline-block;
}

/* 触发按钮：在全局 .btn 基础上叠 accent 金色 */
.share-trigger {
  background: #f5b800; /* accent-500 */
  color: #1f2937;
  border-color: #b8860b; /* accent-700 */
}
.share-trigger:hover {
  background: #e6ad00; /* accent-600 */
}
:global(.dark) .share-trigger {
  background: #e6ad00;
  color: #fff;
  border-color: #f5b800;
}
:global(.dark) .share-trigger:hover {
  background: #f5b800;
}

.share-menu {
  min-width: 12rem;
}

/* 菜单内每一行按钮：统一粗野风格 + 按压反馈 */
.share-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 0.75rem;
  min-height: 2.75rem; /* 44px 触控目标 */
  width: 100%;
  font-size: 0.95rem;
  font-weight: 600;
  color: #1e293b; /* slate-800 */
  text-align: left;
  border: 2px solid #0f172a; /* slate-900 */
  background: #ffffff;
  box-shadow: 3px 3px 0 0 rgba(15, 23, 42, 0.9);
  transition: transform 0.12s ease, box-shadow 0.12s ease, background-color 0.12s ease;
  cursor: pointer;
  margin-bottom: 0.375rem;
}
.share-row:last-child {
  margin-bottom: 0;
}
.share-row:hover {
  background: #f1f5f9; /* slate-100 */
  transform: translate(-1px, -1px);
  box-shadow: 4px 4px 0 0 rgba(15, 23, 42, 0.9);
}
.share-row:active {
  transform: translate(2px, 2px);
  box-shadow: 0 0 0 0 rgba(15, 23, 42, 0.9);
}

/* 手机端底部抽屉 */
.share-sheet {
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  max-width: 100%;
  margin: 0 auto;
}
.share-backdrop {
  position: fixed;
  inset: 0;
  z-index: 49;
  background: rgba(15, 23, 42, 0.45);
  backdrop-filter: blur(1px);
}

/* 桌面端：下拉卡片 scale/opacity */
.pop-enter-active,
.pop-leave-active {
  transition: transform 0.15s ease, opacity 0.15s ease;
}
.pop-enter-from,
.pop-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(4px);
}
/* 手机端：底部抽屉上滑 */
.sheet-enter-active,
.sheet-leave-active {
  transition: transform 0.22s ease;
}
.sheet-enter-from,
.sheet-leave-to {
  transform: translateY(100%);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
