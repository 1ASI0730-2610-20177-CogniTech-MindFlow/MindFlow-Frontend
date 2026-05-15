<template>
  <div class="card summary-card">
    <div v-if="store.isSummaryLoading" class="skeleton">
      <div class="skeleton-line"></div>
      <div class="skeleton-line"></div>
      <div class="skeleton-line short"></div>
    </div>

    <div v-else-if="store.summaryError" class="error-state">
      <i class="pi pi-exclamation-circle"></i>
      <p>Error al cargar el resumen semanal</p>
    </div>

    <div v-else class="summary-content">
      <div class="summary-header">
        <i class="pi pi-sparkles icon"></i>
        <h3>Resumen Semanal</h3>
      </div>
      <p class="summary-text">{{ store.weeklySummary }}</p>
    </div>
  </div>
</template>

<script setup>
import { useDashboardStore } from '../../infrastructure/dashboard-store'

const store = useDashboardStore()
</script>

<style scoped>
.card {
  background: #ffffff;
  border-radius: 12px;
  padding: 24px;
  border: 1px solid #e2e8f0;
  transition: box-shadow 0.2s;
}

.card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.summary-card {
  background: linear-gradient(to right bottom, #ffffff, #f8fafc);
  border-left: 4px solid #8b5cf6;
}

.summary-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.icon {
  font-size: 24px;
  color: #8b5cf6;
}

.summary-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #0f172a;
  margin: 0;
}

.summary-text {
  color: #475569;
  font-size: 15px;
  line-height: 1.6;
  margin: 0;
}

.skeleton { padding: 10px 0; }
.skeleton-line {
  height: 20px;
  background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 4px;
  margin-bottom: 12px;
}
.skeleton-line.short { width: 60%; }
@keyframes loading {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.error-state {
  text-align: center;
  padding: 20px 0;
  color: #ef4444;
}
.error-state i { font-size: 32px; margin-bottom: 8px; }
.error-state p { font-size: 14px; margin: 0; }
</style>
