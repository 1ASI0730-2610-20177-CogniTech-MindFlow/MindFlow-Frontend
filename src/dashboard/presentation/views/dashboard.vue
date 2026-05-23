<template>
  <Layout>
    <div class="high-end-dashboard-page">
      <div class="optical-grid-bg"></div>

      <div class="dashboard-grid">
        <div class="main-column">
          <div class="widget animate-fade-in-up" style="animation-delay: 0s">
            <MoodInput />
          </div>

          <div class="widget animate-fade-in-up" style="animation-delay: 0.12s">
            <RecentEntries />
          </div>

          <div class="widget animate-fade-in-up" style="animation-delay: 0.24s">
            <WeeklySummaryWidget />
          </div>
        </div>

        <div class="side-column">
          <div class="widget animate-fade-in-up" style="animation-delay: 0.08s">
            <QuickInterventions />
          </div>

          <div class="widget animate-fade-in-up" style="animation-delay: 0.2s">
            <DailyHabits />
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { onMounted } from 'vue'
import Layout from '@/shared/presentation/components/layout.vue'
import MoodInput from '../components/mood-input.vue'
import RecentEntries from '../components/recent-entries.vue'
import WeeklySummaryWidget from '../components/weekly-summary-widget.vue'
import QuickInterventions from '../components/quick-interventions.vue'
import DailyHabits from '../components/daily-habits.vue'
import { useDashboardStore } from '@/dashboard/application/dashboard.store'

const dashboardStore = useDashboardStore()

onMounted(() => {
  dashboardStore.fetchDashboardData()
})
</script>

<style scoped>
.high-end-dashboard-page {
  position: relative;
  min-height: 100%;
  z-index: 1;
}

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

.dashboard-grid {
  display: grid;
  grid-template-columns: minmax(auto, 65%) 1fr;
  gap: 32px;
  align-items: start;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

/* Animaciones de entrada */
@keyframes dfadeInUp {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in-up {
  animation: dfadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
  opacity: 0;
}

.widget {
  will-change: transform, opacity;
}

.optical-grid-bg {
  transition: opacity 0.6s ease, transform 0.8s ease;
  transform: translateZ(0);
}

.main-column,
.side-column {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

:deep(.dashboard-card) {
  background: var(--bg-surface);
  backdrop-filter: blur(12px);
  border: 1px solid var(--border-color);
  border-radius: 24px;
  box-shadow: var(--shadow-md);
  padding: 32px;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

:deep(.dashboard-card:hover) {
  transform: translateY(-4px);
  box-shadow: 0 30px 60px -15px rgba(15, 23, 42, 0.08), 0 0 0 1px rgba(15, 23, 42, 0.03) inset;
}

:deep(.card-title) {
  font-size: 18px;
  color: var(--text-primary);
  margin: 0;
  font-weight: 700;
}

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