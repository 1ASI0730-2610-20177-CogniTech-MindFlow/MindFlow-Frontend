<template>
  <div class="dashboard-card theme-transition">
    <div class="header-row">
      <h3 class="card-title">{{ t('dashboard.recentEntries.title') }}</h3>
    </div>

    <div v-if="store.savedConversation" class="entry-item" @click="resumeConversation">
      <div class="conversation-preview">
        <div class="preview-header">
          <div class="preview-title">
            <i class="pi pi-sparkles ai-icon"></i>
            <span>MindFlow AI</span>
          </div>
          <span class="message-count">{{ store.savedConversation.count }} {{ store.savedConversation.count === 1 ? 'mensaje' : 'mensajes' }}</span>
        </div>

        <div class="last-exchange">
          <p class="last-user"><strong>{{ t('dashboard.recentEntries.you') }}:</strong> {{ lastUserMessage }}</p>
          <p v-if="lastAiResponse" class="last-ai"><strong>AI:</strong> {{ lastAiResponse }}</p>
        </div>

        <span class="entry-time">{{ store.savedConversation.time }}</span>
      </div>
    </div>

    <div v-else class="empty-state">
      <i class="pi pi-comments"></i>
      <p>{{ t('dashboard.recentEntries.empty') }}</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useDashboardStore } from '@/dashboard/application/dashboard.store'

const emit = defineEmits(['openChat'])

const { t } = useI18n()
const store = useDashboardStore()

const lastUserMessage = computed(() => {
  const msgs = store.savedConversation?.messages
  return msgs?.[0]?.text || ''
})

const lastAiResponse = computed(() => {
  const msgs = store.savedConversation?.messages
  return msgs?.[0]?.aiResponse || null
})

function resumeConversation() {
  store.conversations = [...store.savedConversation.messages]
  store.aiFeedback = store.conversations[0]?.aiResponse || null
  emit('openChat')
}
</script>

<style scoped>
.header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.entry-item {
  padding: 16px;
  border-radius: 14px;
  background: var(--bg-surface-secondary);
  border: 1px solid var(--border-color);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
  overflow: hidden;
}

.entry-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  border-radius: 14px 0 0 14px;
  background: var(--accent-primary);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.entry-item:hover {
  transform: translateX(4px);
  border-color: transparent;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.06);
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.04), transparent);
}

.entry-item:hover::before {
  opacity: 1;
}

.entry-item:active {
  transform: translateX(2px) scale(0.99);
}

.conversation-preview {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.preview-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 700;
  color: var(--accent-primary);
}

.ai-icon {
  font-size: 14px;
}

.message-count {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-muted);
  background: var(--bg-surface);
  padding: 3px 10px;
  border-radius: 8px;
  border: 1px solid var(--border-color);
}

.last-exchange {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.last-user,
.last-ai {
  margin: 0;
  font-size: 13px;
  line-height: 1.5;
  color: var(--text-secondary);
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.last-user strong,
.last-ai strong {
  color: var(--text-primary);
  font-weight: 600;
}

.entry-time {
  font-size: 11px;
  color: var(--text-muted);
  font-weight: 500;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 24px;
  color: var(--text-muted);
}

.empty-state i {
  font-size: 24px;
  opacity: 0.5;
}

.empty-state p {
  margin: 0;
  font-size: 14px;
}
</style>
