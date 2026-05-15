<template>
  <section class="progress-card">
    <div class="progress-header">
      <h3>Progreso Diario</h3>
      <span class="progress-label">{{ progress.percent }}% Completado ({{ progress.completed }}/{{ progress.total }})</span>
    </div>
    <div class="progress-track">
      <div class="progress-fill" :style="{ width: `${progress.percent}%` }" />
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
  background: #fff;
  border: 1px solid #edf0f5;
  border-radius: 14px;
  padding: 18px 20px;
  margin-bottom: 20px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02);
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
  color: #1e293b;
}

.progress-label {
  font-size: 13px;
  color: #64748b;
}

.progress-track {
  height: 10px;
  background: #ecfdf5;
  border-radius: 999px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #22c55e, #16a34a);
  border-radius: 999px;
  transition: width 0.25s ease;
}
</style>
