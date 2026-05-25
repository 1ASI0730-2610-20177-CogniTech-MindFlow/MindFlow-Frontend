<template>
  <div class="dashboard-card">
    <div class="input-header">
      <h3 class="card-title">{{ t('dashboard.moodInput.title') }}</h3>
      <div class="ai-status">
        <span class="status-dot"></span> {{ t('dashboard.moodInput.aiActive') }}
      </div>
    </div>

    <textarea
        v-model="journalText"
        :placeholder="t('dashboard.moodInput.placeholder')"
        class="journal-textarea"
    ></textarea>

    <div class="input-actions">
      <select v-model="selectedTag" class="tag-select">
        <option value="Estudios">{{ t('dashboard.moodInput.tags.studies') }}</option>
        <option value="Trabajo">{{ t('dashboard.moodInput.tags.work') }}</option>
        <option value="Familia">{{ t('dashboard.moodInput.tags.family') }}</option>
        <option value="Personal">{{ t('dashboard.moodInput.tags.personal') }}</option>
      </select>

      <button
          class="btn-primary"
          @click="saveEntry"
          :disabled="!journalText.trim() || dashboardStore.isAnalyzing"
      >
        {{ dashboardStore.isAnalyzing ? t('dashboard.moodInput.analyzing') : t('dashboard.moodInput.save') }}
      </button>
    </div>

    <div v-if="dashboardStore.isAnalyzing || dashboardStore.aiFeedback" class="ai-feedback-box">
      <div class="ai-feedback-header">
        <span class="sparkle">✨</span> <strong>MindFlow AI</strong>
      </div>
      <p class="ai-feedback-text">
        <span v-if="dashboardStore.isAnalyzing">{{ t('dashboard.moodInput.processing') }}</span>
        <span v-else>{{ dashboardStore.aiFeedback }}</span>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useDashboardStore } from '@/dashboard/application/dashboard.store'

const { t } = useI18n()
const dashboardStore = useDashboardStore()
const journalText = ref('')
const selectedTag = ref('Estudios')

const saveEntry = async () => {
  if (!journalText.value.trim()) return
  await dashboardStore.submitJournalEntry(journalText.value, selectedTag.value)
  journalText.value = '' // Limpiamos el texto después de enviar
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
  background: linear-gradient(135deg, rgba(52, 211, 153, 0.1), rgba(52, 211, 153, 0.05));
  padding: 6px 14px;
  border-radius: 50px;
  border: 1px solid rgba(52, 211, 153, 0.2);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.ai-status:hover {
  background: linear-gradient(135deg, rgba(52, 211, 153, 0.15), rgba(52, 211, 153, 0.1));
  border-color: rgba(52, 211, 153, 0.3);
}

.status-dot {
  width: 8px;
  height: 8px;
  background-color: #34d399;
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
  box-shadow: 0 0 10px rgba(52, 211, 153, 0.6);
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.2); opacity: 0.8; }
}

.journal-textarea {
  width: 100%;
  height: 120px;
  background: var(--bg-surface-secondary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 16px;
  font-family: inherit;
  font-size: 14px;
  color: var(--text-primary);
  resize: none;
  outline: none;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  margin-bottom: 16px;
}

.journal-textarea:hover {
  border-color: rgba(99, 102, 241, 0.2);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
}

.journal-textarea:focus {
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  transform: translateY(-2px);
}

.journal-textarea::placeholder {
  color: var(--text-muted);
  transition: color 0.3s ease;
}

.input-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.tag-select {
  background: var(--bg-surface-secondary);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  padding: 10px 14px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 500;
  outline: none;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.tag-select:hover {
  border-color: rgba(99, 102, 241, 0.2);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
}

.tag-select:focus {
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.btn-primary {
  background: linear-gradient(135deg, #34d399, #10b981);
  color: white;
  border: none;
  padding: 10px 24px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(52, 211, 153, 0.3);
}

.btn-primary::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: width 0.5s, height 0.5s;
}

.btn-primary:hover:not(:disabled)::before {
  width: 300px;
  height: 300px;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(52, 211, 153, 0.4);
}

.btn-primary:active:not(:disabled) {
  transform: translateY(0);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  box-shadow: 0 2px 6px rgba(52, 211, 153, 0.1);
}

.ai-feedback-box {
  margin-top: 20px;
  background: linear-gradient(135deg, rgba(52, 211, 153, 0.05), rgba(52, 211, 153, 0.02));
  border-left: 4px solid #34d399;
  border-radius: 0 12px 12px 0;
  padding: 16px 20px;
  animation: slideInLeft 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 4px 12px rgba(52, 211, 153, 0.1);
  border: 1px solid rgba(52, 211, 153, 0.15);
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-12px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
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