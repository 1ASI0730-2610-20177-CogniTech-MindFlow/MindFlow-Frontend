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
  margin-bottom: 16px;
}

.ai-status {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 600;
  color: var(--text-primary);
  background: rgba(255,255,255,0.02);
  padding: 4px 12px;
  border-radius: 99px;
}

.status-dot {
  width: 6px;
  height: 6px;
  background-color: #34d399;
  border-radius: 50%;
}

.journal-textarea {
  width: 100%;
  height: 120px;
  background: var(--bg-surface-secondary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 16px;
  font-family: inherit;
  font-size: 14px;
  color: var(--text-primary);
  resize: none;
  outline: none;
  transition: border-color 0.2s;
  margin-bottom: 16px;
}

.journal-textarea:focus {
  border-color: var(--border-light);
}

.journal-textarea::placeholder {
  color: var(--text-muted);
}

.input-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.tag-select {
  background: var(--bg-surface-secondary);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 13px;
  outline: none;
  cursor: pointer;
}

.btn-primary {
  background: #34d399;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-primary:hover:not(:disabled) {
  background: #10b981;
}

.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.ai-feedback-box {
  margin-top: 24px;
  background: var(--bg-surface);
  border-left: 4px solid #34d399;
  border-radius: 4px 8px 8px 4px;
  padding: 16px 20px;
}

.ai-feedback-header {
  color: var(--text-secondary);
  font-size: 13px;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.ai-feedback-text {
  margin: 0;
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 1.5;
}
</style>