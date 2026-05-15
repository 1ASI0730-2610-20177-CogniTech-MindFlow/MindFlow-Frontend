<template>
  <Layout>
    <div class="habits-page">
      <header class="page-header">
        <h1>Hábitos</h1>
      </header>

      <HabitTabs
          :model-value="store.activeTab"
          @update:model-value="store.setActiveTab"
      />

      <template v-if="store.activeTab === 'routines'">
        <AiStressAlert v-if="store.showAiAlert" />
        <DailyProgress :progress="store.dailyProgress" />
        <AddHabitForm @create="store.createHabit" />
        <HabitFilters
            :search-query="store.searchQuery"
            :status-filter="store.statusFilter"
            @update:search-query="store.setSearchQuery"
            @update:status-filter="store.setStatusFilter"
        />
        <HabitList
            :habits="store.filteredHabits"
            @toggle="store.toggleHabit"
        />
      </template>

      <section v-else-if="store.activeTab === 'suggestions'" class="placeholder-panel">
        <h3>Sugerencias de IA</h3>
        <p>Próximamente: hábitos recomendados según tu estado emocional y rutinas actuales.</p>
      </section>

      <HabitHistoryPanel
          v-else
          :weeks="store.weeklyHistory"
      />
    </div>
  </Layout>
</template>

<script setup>
import { onMounted } from 'vue'
import Layout from '../../../shared/presentation/components/layout.vue'
import { useHabitsStore } from '../../application/habits.store.js'
import HabitTabs from '../components/HabitTabs.vue'
import AiStressAlert from '../components/AiStressAlert.vue'
import DailyProgress from '../components/DailyProgress.vue'
import AddHabitForm from '../components/AddHabitForm.vue'
import HabitFilters from '../components/HabitFilters.vue'
import HabitList from '../components/HabitList.vue'
import HabitHistoryPanel from '../components/HabitHistoryPanel.vue'

const store = useHabitsStore()

onMounted(() => {
  store.loadHabits()
})
</script>

<style scoped>
.habits-page {
  font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.page-header {
  margin-bottom: 22px;
}

.page-header h1 {
  margin: 0;
  font-size: 22px;
  font-weight: 700;
  color: #0f172a;
}

.placeholder-panel {
  background: #fff;
  border: 1px solid #edf0f5;
  border-radius: 14px;
  padding: 32px;
  text-align: center;
}

.placeholder-panel h3 {
  margin: 0 0 8px;
  font-size: 18px;
  color: #1e293b;
}

.placeholder-panel p {
  margin: 0;
  color: #64748b;
  font-size: 14px;
}
</style>
