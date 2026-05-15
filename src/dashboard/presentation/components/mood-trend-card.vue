<template>
  <div class="card trend-card">
    <div class="trend-header">
      <h3>Tendencia de Ánimo</h3>
      <p class="subtitle">Últimos 7 días</p>
    </div>

    <div v-if="store.isTrendLoading" class="skeleton">
      <div class="skeleton-chart"></div>
    </div>

    <div v-else-if="store.trendError" class="error-state">
      <i class="pi pi-exclamation-circle"></i>
      <p>Error al cargar la tendencia</p>
    </div>

    <div v-else class="chart-container">
      <div class="bars">
        <div 
          v-for="(item, index) in store.trendData" 
          :key="index" 
          class="bar-wrapper"
        >
          <div class="bar-bg">
            <div 
              class="bar-fill" 
              :style="{ height: `${(item.moodScore / 10) * 100}%` }"
              :class="getMoodColorClass(item.moodScore)"
            ></div>
          </div>
          <span class="day-label">{{ item.dayLabel }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useDashboardStore } from '../../infrastructure/dashboard-store'

const store = useDashboardStore()

const getMoodColorClass = (score) => {
  if (score >= 7) return 'fill-positive'
  if (score >= 4) return 'fill-neutral'
  return 'fill-negative'
}
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

.trend-header {
  margin-bottom: 24px;
}

.trend-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #0f172a;
  margin: 0 0 4px 0;
}

.subtitle {
  font-size: 13px;
  color: #64748b;
  margin: 0;
}

.chart-container {
  height: 160px;
  display: flex;
  align-items: flex-end;
}

.bars {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  width: 100%;
  height: 100%;
}

.bar-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  height: 100%;
}

.bar-bg {
  flex: 1;
  width: 24px;
  background: #f1f5f9;
  border-radius: 12px;
  position: relative;
  overflow: hidden;
}

.bar-fill {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  border-radius: 12px;
  transition: height 0.5s ease;
}

.fill-positive { background: #6ED3A3; }
.fill-neutral { background: #94a3b8; }
.fill-negative { background: #f97316; }

.day-label {
  font-size: 12px;
  color: #64748b;
  font-weight: 500;
}

.skeleton-chart {
  height: 160px;
  background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 8px;
}

@keyframes loading {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.error-state {
  text-align: center;
  padding: 40px 0;
  color: #ef4444;
}
.error-state i { font-size: 32px; margin-bottom: 8px; }
.error-state p { font-size: 14px; margin: 0; }
</style>
