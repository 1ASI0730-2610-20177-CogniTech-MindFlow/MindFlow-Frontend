<template>
  <Layout>
    <div class="dashboard-container">
      <header class="dashboard-header">
        <h1>Dashboard</h1>
        <p>Bienvenido de nuevo a MindFlow</p>
      </header>
      
      <div class="dashboard-grid">
        <div class="main-column">
          <MoodCard />
          <MoodTrendCard />
          <TodayHabitsCard />
        </div>
        <div class="side-column">
          <WeeklySummaryCard />
          <HabitStreakCard />
          <JournalCta />
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { onMounted } from 'vue'
import Layout from '../../../shared/presentation/components/layout.vue'
import HabitStreakCard from '../components/habit-streak-card.vue'
import JournalCta from '../components/journal-cta.vue'
import MoodCard from '../components/mood-card.vue'
import TodayHabitsCard from '../components/today-habits-card.vue'
import WeeklySummaryCard from '../components/weekly-summary-card.vue'
import MoodTrendCard from '../components/mood-trend-card.vue'
import { useDashboardStore } from '../../infrastructure/dashboard-store'

const store = useDashboardStore()

onMounted(() => {
  store.loadDashboardData()
})
</script>

<style scoped>
.dashboard-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.dashboard-header h1 {
  font-size: 28px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 8px 0;
}

.dashboard-header p {
  font-size: 16px;
  color: #64748b;
  margin: 0;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
}

.main-column {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.side-column {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

@media (max-width: 1024px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}
</style>
