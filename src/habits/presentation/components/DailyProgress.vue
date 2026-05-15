<template>
  <section class="progress-card theme-transition">
    <div class="progress-header">
      <h3 class="theme-transition">Progreso Diario</h3>
      <span class="progress-label theme-transition">{{ progress.percent }}% Completado ({{ progress.completed }}/{{ progress.total }})</span>
    </div>
    <div class="progress-track theme-transition">
      <div class="progress-fill theme-transition" :style="{ width: `${progress.percent}%` }" />
    </div>
  </section>
</template>

<script setup>
defineProps({
  progress: {
    type: Object,
    required: true
  }
})
</script>

<style scoped>
.progress-card {
  background: var(--bg-surface);
  border: 1px solid var(--border-light);
  border-radius: 14px;
  padding: 18px 20px;
  margin-bottom: 20px;
  box-shadow: var(--shadow-sm);
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.progress-header h3 {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
}

.progress-label {
  font-size: 13px;
  color: var(--text-secondary);
}

.progress-track {
  height: 10px;
  background: var(--bg-surface-secondary);
  border-radius: 999px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--accent-success), #16a34a);
  border-radius: 999px;
  transition: width 0.25s ease;
}
</style>