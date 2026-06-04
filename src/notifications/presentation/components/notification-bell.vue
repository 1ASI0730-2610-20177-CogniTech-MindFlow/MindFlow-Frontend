<template>
  <div class="notification-bell" ref="bellContainer">
    <button class="bell-btn theme-transition" @click="toggleDropdown" :title="$t('notifications.title')">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
      <span v-if="unreadCount > 0" class="dot"></span>
    </button>

    <transition name="dropdown">
      <div v-if="isOpen" class="dropdown theme-transition">
        <header class="dropdown-header">
          <h4>{{ $t('notifications.title') }}</h4>
          <button
            v-if="unreadCount > 0"
            class="mark-read-btn"
            @click="markAllRead"
            :disabled="isMarkingAll"
          >
            {{ isMarkingAll ? '...' : $t('notifications.markAllRead') }}
          </button>
        </header>

        <div class="dropdown-body">
          <div v-if="notifications.length === 0" class="empty">
            {{ $t('notifications.empty') }}
          </div>

          <div
            v-for="notification in notifications"
            :key="notification.id"
            class="notification-item"
            :class="{ unread: notification.isUnread }"
            @click="handleClick(notification)"
          >
            <div class="item-icon">
              <span v-if="notification.isAiAlert">🧠</span>
              <span v-else>⏰</span>
            </div>
            <div class="item-body">
              <p class="item-title">{{ notification.title }}</p>
              <p class="item-message">{{ notification.message }}</p>
              <span class="item-time">{{ timeAgo(notification.sentAt) }}</span>
            </div>
            <button class="item-dismiss" @click.stop="$emit('dismiss', notification.id)">✕</button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  notifications: { type: Array, default: () => [] },
  unreadCount: { type: Number, default: 0 }
})

const emit = defineEmits(['markRead', 'markAllRead', 'dismiss'])

const isOpen = ref(false)
const isMarkingAll = ref(false)
const bellContainer = ref(null)

function toggleDropdown() {
  isOpen.value = !isOpen.value
}

function handleClick(notification) {
  if (notification.isUnread) {
    emit('markRead', notification.id)
  }
}

async function markAllRead() {
  isMarkingAll.value = true
  emit('markAllRead')
  isOpen.value = false
  isMarkingAll.value = false
}

function timeAgo(date) {
  if (!date) return ''
  const now = new Date()
  const diff = now - new Date(date)
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Ahora'
  if (mins < 60) return `hace ${mins} min`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `hace ${hours}h`
  const days = Math.floor(hours / 24)
  return `hace ${days}d`
}

function handleClickOutside(e) {
  if (bellContainer.value && !bellContainer.value.contains(e.target)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.notification-bell {
  position: relative;
}

.bell-btn {
  position: relative;
  width: 44px;
  height: 44px;
  border-radius: 50px;
  background: var(--bg-surface-secondary);
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.bell-btn:hover {
  background: var(--bg-primary);
  border-color: rgba(99, 102, 241, 0.2);
  color: var(--text-primary);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.06);
}

.bell-btn:active {
  transform: translateY(0px);
}

.dot {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--accent-danger);
  border: 2px solid var(--bg-surface-secondary);
}

.dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 360px;
  max-height: 480px;
  border-radius: 12px;
  background: var(--bg-surface);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  border: 1px solid var(--border-color);
  overflow: hidden;
  z-index: 100;
}

.dropdown-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  border-bottom: 1px solid var(--border-color);
}

.dropdown-header h4 {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.mark-read-btn {
  background: none;
  border: none;
  font-size: 12px;
  color: var(--accent-primary);
  cursor: pointer;
  font-weight: 500;
  padding: 4px 8px;
  border-radius: 6px;
  transition: background 0.2s;
}

.mark-read-btn:hover:not(:disabled) {
  background: rgba(99, 102, 241, 0.08);
}

.mark-read-btn:disabled {
  opacity: 0.5;
  cursor: default;
}

.dropdown-body {
  overflow-y: auto;
  max-height: 400px;
}

.empty {
  text-align: center;
  padding: 32px 16px;
  color: var(--text-muted);
  font-size: 13px;
}

.notification-item {
  display: flex;
  gap: 12px;
  padding: 12px 16px;
  cursor: pointer;
  transition: background 0.2s;
  border-bottom: 1px solid var(--border-color);
}

.notification-item:last-child {
  border-bottom: none;
}

.notification-item:hover {
  background: var(--bg-surface-secondary);
}

.notification-item.unread {
  background: rgba(99, 102, 241, 0.03);
  position: relative;
}

.notification-item.unread::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 24px;
  border-radius: 0 2px 2px 0;
  background: var(--accent-primary);
}

.item-icon {
  flex-shrink: 0;
  font-size: 18px;
  line-height: 1;
  margin-top: 1px;
}

.item-body {
  flex: 1;
  min-width: 0;
}

.item-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 2px;
}

.item-message {
  font-size: 12px;
  color: var(--text-secondary);
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.item-time {
  display: block;
  font-size: 11px;
  color: var(--text-muted);
  margin-top: 4px;
}

.item-dismiss {
  flex-shrink: 0;
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  font-size: 12px;
  padding: 4px;
  border-radius: 4px;
  opacity: 0;
  transition: opacity 0.2s, background 0.2s;
  align-self: flex-start;
}

.notification-item:hover .item-dismiss {
  opacity: 1;
}

.item-dismiss:hover {
  color: var(--text-primary);
  background: var(--bg-surface-secondary);
}

.dropdown-enter-active {
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.dropdown-leave-active {
  transition: all 0.15s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

:global(.dark-mode) .bell-btn {
  color: var(--text-secondary);
}

:global(.dark-mode) .bell-btn:hover {
  color: var(--text-primary);
}
</style>
