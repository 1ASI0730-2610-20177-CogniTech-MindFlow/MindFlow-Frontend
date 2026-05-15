<template>
  <Layout>
    <div class="high-end-dashboard-page">
      <div class="optical-grid-bg"></div>

      <div class="dashboard-grid">
        <div class="main-column">
          <MoodInput />
          <RecentEntries />
          <WeeklySummaryWidget />
        </div>

        <div class="side-column">
          <QuickInterventions />
          <DailyHabits />
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import Layout from '@/shared/presentation/components/layout.vue'
import MoodInput from '../components/mood-input.vue'
import RecentEntries from '../components/recent-entries.vue'
import WeeklySummaryWidget from '../components/weekly-summary-widget.vue'
import QuickInterventions from '../components/quick-interventions.vue'
import DailyHabits from '../components/daily-habits.vue'
</script>

<style scoped>
.high-end-dashboard-page {
  position: relative;
  min-height: 100%;
  z-index: 1;
}

/* Patrón de fondo consistente con el módulo de analíticas */
.optical-grid-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: -1;
  background-image: radial-gradient(circle at center, rgba(15, 23, 42, 0.03) 1px, transparent 1px);
  background-size: 32px 32px;
  opacity: 0.8;
}

/* Distribución asimétrica de columnas basada en tu prototipo */
.dashboard-grid {
  display: grid;
  grid-template-columns: minmax(auto, 65%) 1fr;
  gap: 32px;
  align-items: start;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

.main-column,
.side-column {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

/* Estilo unificado para todas las tarjetas del dashboard mediante selectores profundos */
:deep(.dashboard-card) {
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.8);
  border-radius: 24px;
  box-shadow: 0 20px 40px -10px rgba(15, 23, 42, 0.05), 0 0 0 1px rgba(15, 23, 42, 0.02) inset;
  padding: 32px;
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

:deep(.dashboard-card:hover) {
  transform: translateY(-4px);
  box-shadow: 0 30px 60px -15px rgba(15, 23, 42, 0.08), 0 0 0 1px rgba(15, 23, 42, 0.03) inset;
}

:deep(.card-title) {
  font-size: 18px;
  color: #0f172a;
  margin: 0;
  font-weight: 700;
}

/* === DISEÑO RESPONSIVO (MOBILE FIRST) === */
@media (max-width: 1024px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .main-column,
  .side-column {
    gap: 24px;
  }
}
</style>