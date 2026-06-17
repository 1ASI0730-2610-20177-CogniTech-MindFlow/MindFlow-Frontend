<template>
  <div class="dashboard-card theme-transition">
    <div class="input-header">
      <h3 class="card-title">{{ t('dashboard.moodInput.title') }}</h3>
      <div class="ai-status">
        <span class="status-dot"></span> {{ t('dashboard.moodInput.aiActive') }}
      </div>
    </div>

    <div class="fake-textarea" @click="startNewChat">
      <span class="placeholder-text">{{ t('dashboard.moodInput.placeholder') }}</span>
    </div>

    <div v-if="dashboardStore.aiFeedback" class="ai-feedback-box">
      <div class="ai-feedback-header">
        <i class="pi pi-sparkles sparkle"></i> <strong>MindFlow AI</strong>
      </div>
      <p class="ai-feedback-text">{{ dashboardStore.aiFeedback }}</p>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { useDashboardStore } from '@/dashboard/application/dashboard.store'

const emit = defineEmits(['openChat'])

const { t } = useI18n()
const dashboardStore = useDashboardStore()

function startNewChat() {
  dashboardStore.conversations = []
  dashboardStore.aiFeedback = null
  dashboardStore.aiRating = 0
  dashboardStore.ratingSubmitted = false
  emit('openChat')
}
</script>

<style scoped>
.input-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
}

.ai-status {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 600;
  color: var(--text-primary);
  background: var(--bg-surface-secondary);
  padding: 6px 14px;
  border-radius: 50px;
  border: 1px solid var(--border-color);
}

.status-dot {
  width: 8px;
  height: 8px;
  background-color: var(--accent-primary);
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
  box-shadow: 0 0 10px rgba(99, 102, 241, 0.5);
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.2); opacity: 0.8; }
}

.fake-textarea {
  width: 100%;
  min-height: 80px;
  background: var(--bg-surface-secondary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  display: flex;
  align-items: flex-start;
}

.fake-textarea:hover {
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  transform: translateY(-2px);
}

.placeholder-text {
  color: var(--text-muted);
  font-size: 14px;
}

.ai-feedback-box {
  margin-top: 20px;
  background: var(--bg-surface-secondary);
  border-left: 4px solid var(--accent-primary);
  border-radius: 0 12px 12px 0;
  padding: 16px 20px;
  border: 1px solid var(--border-color);
}

.ai-feedback-header {
  color: var(--text-primary);
  font-size: 13px;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 600;
}

.sparkle {
  font-size: 16px;
  animation: sparkleFloat 2s ease-in-out infinite;
}

@keyframes sparkleFloat {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-4px) rotate(10deg); }
}

.ai-feedback-text {
  margin: 0;
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 1.5;
}
</style>
