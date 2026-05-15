<template>
  <div class="ai-alert" role="status">
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
  background: #fffbeb;
  border: 1px solid #fde68a;
  border-radius: 12px;
  padding: 14px 16px;
  margin-bottom: 20px;
}

.alert-icon {
  color: #d97706;
  font-size: 18px;
  line-height: 1;
  margin-top: 2px;
}

.ai-alert p {
  margin: 0;
  font-size: 13px;
  line-height: 1.55;
  color: #92400e;
}

.ai-alert strong {
  color: #78350f;
}
</style>