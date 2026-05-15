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
  gap: 12px;
}

.btn-outline {
  width: 100%;
  background: white;
  border: 1px solid #bfdbfe;
  color: #3b82f6;
  padding: 12px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-outline:hover {
  background: #eff6ff;
  border-color: #93c5fd;
}
</style>