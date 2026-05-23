<template>
  <div class="dashboard-card">
    <h3 class="card-title">{{ t('dashboard.quickInterventions.title') }}</h3>
    <div class="action-buttons">
      <button class="btn-outline">{{ t('dashboard.quickInterventions.breathing') }}</button>
      <button class="btn-outline">{{ t('dashboard.quickInterventions.microMeditation') }}</button>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<style scoped>
.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-top: 16px;
}

.btn-outline {
  width: 100%;
  background: var(--bg-surface-secondary);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  padding: 14px 16px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-outline:hover {
  background: rgba(255, 255, 255, 0.04);
  border-color: var(--border-light);
}
</style>