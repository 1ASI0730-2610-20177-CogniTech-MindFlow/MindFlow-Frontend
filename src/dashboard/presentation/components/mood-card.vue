<template>
  <div class="card mood-card" :class="moodClass">
    <div v-if="store.isMoodLoading" class="skeleton">
      <div class="skeleton-line"></div>
      <div class="skeleton-line short"></div>
    </div>

    <div v-else-if="store.moodError" class="error-state">
      <i class="pi pi-exclamation-circle"></i>
      <p>Error al cargar el estado de ánimo</p>
    </div>

    <div v-else-if="!store.currentMood" class="empty-state">
      <span class="mood-icon">😊</span>
      <h3>¿Cómo te sientes hoy?</h3>
      <p>Registra tu estado de ánimo</p>
    </div>

    <div v-else class="mood-content">
      <div class="mood-header">
        <span class="mood-icon">{{ moodEmoji }}</span>
        <div>
          <h3>{{ store.currentMood.sentimentLabel }}</h3>
          <p class="mood-date">{{ formattedDate }}</p>
        </div>
      </div>
      <p class="ai-message">{{ store.currentMood.aiMessage }}</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useDashboardStore } from '../../infrastructure/dashboard-store'

const store = useDashboardStore()

const moodEmoji = computed(() => {
  if (!store.currentMood) return '😊'
  const score = store.currentMood.moodScore
  if (score >= 7) return '😊'
  if (score >= 4) return '😐'
  return '😔'
})

const moodClass = computed(() => {
  if (!store.currentMood) return ''
  const score = store.currentMood.moodScore
  if (score >= 7) return 'mood-positive'
  if (score >= 4) return 'mood-neutral'
  return 'mood-negative'
})

const formattedDate = computed(() => {
  return new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  })
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

.card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.mood-card.mood-positive { border-left: 4px solid #6ED3A3; }
.mood-card.mood-neutral  { border-left: 4px solid #94a3b8; }
.mood-card.mood-negative { border-left: 4px solid #f97316; }

.mood-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.mood-icon { font-size: 48px; }

.mood-header h3 {
  font-size: 20px;
  font-weight: 600;
  color: #0f172a;
  margin: 0 0 4px 0;
}

.mood-date {
  font-size: 13px;
  color: #64748b;
  margin: 0;
}

.ai-message {
  color: #475569;
  font-size: 14px;
  line-height: 1.6;
  margin: 0;
}

.empty-state {
  text-align: center;
  padding: 20px 0;
}

.empty-state .mood-icon {
  font-size: 64px;
  display: block;
  margin-bottom: 16px;
}

.empty-state h3 {
  font-size: 18px;
  color: #0f172a;
  margin: 0 0 8px 0;
}

.empty-state p {
  color: #64748b;
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

.error-state i {
  font-size: 32px;
  margin-bottom: 8px;
}

.error-state p {
  font-size: 14px;
  margin: 0;
}
</style>
