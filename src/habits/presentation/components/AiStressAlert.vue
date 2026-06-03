<template>
  <div class="ai-alert theme-transition" role="status">
    <span class="alert-icon"><i class="pi pi-exclamation-triangle"></i></span>
    <p>
      <strong>{{ $t('habits.alerts.stressTitle') }}</strong>{{ $t('habits.alerts.stressMessage') }}
    </p>
  </div>
</template>

<style scoped>
.ai-alert {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  background: rgba(245, 158, 11, 0.08);
  border: 1px solid rgba(245, 158, 11, 0.22);
  border-radius: 12px;
  padding: 14px 16px;
  margin-bottom: 20px;
}

.alert-icon {
  color: var(--accent-warning);
  font-size: 18px;
  line-height: 1;
  margin-top: 2px;
}

.ai-alert p {
  margin: 0;
  font-size: 13px;
  line-height: 1.55;
  color: var(--text-secondary);
}

.ai-alert strong {
  color: var(--text-primary);
}
</style>