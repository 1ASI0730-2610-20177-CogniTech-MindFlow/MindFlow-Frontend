<template>
  <transition name="toast-slide">
    <div v-if="visible" class="toast theme-transition" :class="[type, { entering: isEntering }]">
      <div class="toast-icon">
        <i v-if="type === 'ai_alert'" class="pi pi-cog"></i>
        <i v-else class="pi pi-clock"></i>
      </div>
      <div class="toast-body">
        <p class="toast-title">{{ notification.title }}</p>
        <p class="toast-message">{{ notification.message }}</p>
      </div>
      <div class="toast-actions">
        <button class="toast-close" @click="$emit('dismiss', notification.id)"><i class="pi pi-times"></i></button>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, watch, onBeforeUnmount } from 'vue'

const props = defineProps({
  notification: { type: Object, required: true },
  visible: { type: Boolean, default: false },
  type: { type: String, default: 'reminder' }
})

defineEmits(['dismiss'])

const isEntering = ref(false)
let autoHideTimer = null

watch(() => props.visible, (val) => {
  if (val) {
    isEntering.value = true
    autoHideTimer = setTimeout(() => {
      isEntering.value = false
    }, 5000)
  } else {
    clearTimeout(autoHideTimer)
  }
})

onBeforeUnmount(() => {
  clearTimeout(autoHideTimer)
})
</script>

<style scoped>
.toast {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 1000;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  max-width: 380px;
  padding: 16px;
  border-radius: 12px;
  background: var(--bg-surface);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  border: 1px solid var(--border-color);
}

.toast.ai_alert {
  border-left: 4px solid var(--accent-primary);
}

.toast.reminder {
  border-left: 4px solid var(--accent-success);
}

.toast-icon {
  flex-shrink: 0;
  font-size: 18px;
  line-height: 1;
  width: 24px;
  text-align: center;
}

.toast-body {
  flex: 1;
  min-width: 0;
}

.toast-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.toast-message {
  font-size: 12px;
  color: var(--text-secondary);
  line-height: 1.4;
}

.toast-actions {
  flex-shrink: 0;
}

.toast-close {
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  font-size: 14px;
  padding: 2px;
  line-height: 1;
  opacity: 0.6;
  transition: opacity 0.2s;
}

.toast-close:hover {
  opacity: 1;
}

.toast-slide-enter-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.toast-slide-leave-active {
  transition: all 0.3s ease;
}

.toast-slide-enter-from {
  transform: translateX(120%);
  opacity: 0;
}

.toast-slide-leave-to {
  transform: translateX(120%);
  opacity: 0;
}
</style>
