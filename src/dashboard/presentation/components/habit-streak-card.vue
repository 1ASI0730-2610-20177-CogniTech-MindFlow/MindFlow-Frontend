<template>
  <div class="card streak-card">
    <div v-if="store.isStreakLoading" class="skeleton">
      <div class="skeleton-line"></div>
      <div class="skeleton-line short"></div>
    </div>

    <div v-else-if="store.streakError" class="error-state">
      <i class="pi pi-exclamation-circle"></i>
      <p>Error al cargar la racha</p>
    </div>

    <div v-else class="streak-content">
      <div class="streak-header">
        <i class="pi pi-bolt streak-icon"></i>
        <div>
          <h3>Racha de Hábitos</h3>
          <p class="streak-subtitle">Días consecutivos</p>
        </div>
      </div>

      <div class="streak-number">
        <span class="number">{{ store.habitStreak || 0 }}</span>
        <span class="label">días</span>
      </div>

      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: progressWidth }"></div>
      </div>

      <p v-if="store.habitStreak === 0" class="encouragement">¡Comienza tu racha hoy! 💪</p>
      <p v-else class="encouragement">¡Sigue así! Estás en racha 🔥</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useDashboardStore } from '../../infrastructure/dashboard-store'

const store = useDashboardStore()

const progressWidth = computed(() => {
  const streak = store.habitStreak || 0
  const percentage = Math.min((streak / 30) * 100, 100)
  return `${percentage}%`
})
</script>

<style scoped>
.card {
  background: #ffffff;
  border-radius: 12px;
  padding: 24px;
  border: 1px solid #e2e8f0;
  transition: box-shadow 0.2s;
}

.card:hover { box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08); }

.streak-card { border-left: 4px solid #4F8DF5; }

.streak-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.streak-icon {
  font-size: 24px;
  color: #4F8DF5;
}

.streak-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #0f172a;
  margin: 0 0 4px 0;
}

.streak-subtitle {
  font-size: 13px;
  color: #64748b;
  margin: 0;
}

.streak-number {
  text-align: center;
  margin: 24px 0;
}

.number {
  font-size: 56px;
  font-weight: 700;
  color: #4F8DF5;
  line-height: 1;
}

.label {
  display: block;
  font-size: 14px;
  color: #64748b;
  margin-top: 8px;
}

.progress-bar {
  height: 8px;
  background: #f1f5f9;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 16px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #4F8DF5, #6ED3A3);
  transition: width 0.3s ease;
}

.encouragement {
  text-align: center;
  color: #475569;
  font-size: 14px;
  margin: 0;
}

.skeleton { padding: 20px 0; }

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
