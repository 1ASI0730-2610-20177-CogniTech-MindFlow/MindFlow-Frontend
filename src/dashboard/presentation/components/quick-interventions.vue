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
  gap: 12px;
  margin-top: 18px;
}

.btn-outline {
  width: 100%;
  background: linear-gradient(135deg, var(--bg-surface-secondary), var(--bg-primary));
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  padding: 14px 16px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  letter-spacing: 0.02em;
}

.btn-outline::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.1), transparent);
  transition: left 0.6s ease;
  pointer-events: none;
}

.btn-outline:hover {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(99, 102, 241, 0.04));
  border-color: rgba(99, 102, 241, 0.2);
  transform: translateY(-3px);
  box-shadow: 0 8px 16px rgba(99, 102, 241, 0.15);
}

.btn-outline:hover::before {
  left: 100%;
}

.btn-outline:active {
  transform: translateY(-1px);
}
</style>