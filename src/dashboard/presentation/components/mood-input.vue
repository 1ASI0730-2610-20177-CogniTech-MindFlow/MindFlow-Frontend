<template>
  <div class="dashboard-card">
    <div class="input-header">
      <h3 class="card-title">¿Cómo te sientes en este momento?</h3>
      <div class="ai-status">
        <span class="status-dot"></span> MindFlow AI Activa
      </div>
    </div>

    <textarea
        v-model="journalText"
        placeholder="Escribe aquí tus pensamientos. Este es un espacio seguro y encriptado..."
        class="journal-textarea"
    ></textarea>

    <div class="input-actions">
      <select v-model="selectedTag" class="tag-select">
        <option value="Estudios">Estudios</option>
        <option value="Trabajo">Trabajo</option>
        <option value="Familia">Familia</option>
        <option value="Personal">Personal</option>
      </select>

      <button
          class="btn-primary"
          @click="saveEntry"
          :disabled="!journalText.trim() || dashboardStore.isAnalyzing"
      >
        {{ dashboardStore.isAnalyzing ? 'Analizando...' : 'Guardar Registro' }}
      </button>
    </div>

    <div v-if="dashboardStore.isAnalyzing || dashboardStore.aiFeedback" class="ai-feedback-box">
      <div class="ai-feedback-header">
        <span class="sparkle">✨</span> <strong>MindFlow AI</strong>
      </div>
      <p class="ai-feedback-text">
        <span v-if="dashboardStore.isAnalyzing">Procesando tus emociones y buscando los mejores consejos para ti...</span>
        <span v-else>{{ dashboardStore.aiFeedback }}</span>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useDashboardStore } from '@/dashboard/application/dashboard.store'

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
  color: #3b82f6;
  background: #eff6ff;
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
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 16px;
  font-family: inherit;
  font-size: 14px;
  color: #334155;
  resize: none;
  outline: none;
  transition: border-color 0.2s;
  margin-bottom: 16px;
}

.journal-textarea:focus {
  border-color: #94a3b8;
}

.journal-textarea::placeholder {
  color: #94a3b8;
}

.input-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.tag-select {
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  color: #475569;
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
  background: #f0fdf4;
  border-left: 4px solid #34d399;
  border-radius: 4px 8px 8px 4px;
  padding: 16px 20px;
}

.ai-feedback-header {
  color: #3b82f6;
  font-size: 13px;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.ai-feedback-text {
  margin: 0;
  color: #334155;
  font-size: 14px;
  line-height: 1.5;
}
</style>