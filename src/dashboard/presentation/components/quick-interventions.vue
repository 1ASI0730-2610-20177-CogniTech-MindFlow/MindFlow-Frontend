<template>
  <div class="dashboard-card">
    <h3 class="card-title">Intervenciones Rápidas</h3>
    <div class="action-buttons">
      <button class="btn-outline">Respiración 4-7-8</button>
      <button class="btn-outline">Micro-meditación (3 min)</button>
    </div>
  </div>
</template>

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