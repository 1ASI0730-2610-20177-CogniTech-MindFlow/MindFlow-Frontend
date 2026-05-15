<template>
  <Layout>
    <div class="habits-page">
      <header class="page-header animate-fade-in-down">
        <h1>{{ $t('habits.title') }}</h1>
      </header>

      <div class="animate-fade-in delay-1">
        <HabitTabs
            :model-value="store.activeTab"
            @update:model-value="store.setActiveTab"
        />
      </div>

      <Transition name="fade-slide" mode="out-in">
        <div :key="store.activeTab">
          <template v-if="store.activeTab === 'routines'">
            <AiStressAlert v-if="store.showAiAlert" class="animate-scale-in" />

            <div class="stagger-1">
              <DailyProgress :progress="store.dailyProgress" />
            </div>

            <div class="stagger-2">
              <AddHabitForm @create="store.createHabit" class="hover-lift" />
            </div>

            <div class="stagger-3">
              <HabitFilters
                  :search-query="store.searchQuery"
                  :status-filter="store.statusFilter"
                  @update:search-query="store.setSearchQuery"
                  @update:status-filter="store.setStatusFilter"
              />
            </div>

            <div class="stagger-4">
              <HabitList
                  :habits="store.filteredHabits"
                  @toggle="store.toggleHabit"
              />
            </div>
          </template>

          <section v-else-if="store.activeTab === 'suggestions'" class="placeholder-panel animate-fade-in-up">
            <div class="pulse-icon"><i class="pi pi-sparkles"></i></div>
            <h3>{{ $t('habits.placeholder.title') }}</h3>
            <p>{{ $t('habits.placeholder.desc') }}</p>
          </section>

          <HabitHistoryPanel
              v-else
              :weeks="store.weeklyHistory"
              class="animate-fade-in-up"
          />
        </div>
      </Transition>
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
/* Core Animations */
@keyframes fadeInDown {
  from { opacity: 0; transform: translateY(-15px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

@keyframes floatPulse {
  0%, 100% { transform: translateY(0) scale(1); opacity: 0.8; }
  50% { transform: translateY(-5px) scale(1.1); opacity: 1; color: #6366f1; }
}

/* Animation Classes */
.animate-fade-in-down {
  animation: fadeInDown 0.5s ease-out forwards;
}

.animate-fade-in-up {
  animation: fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.animate-fade-in {
  animation: fadeIn 0.5s ease-out forwards;
  opacity: 0;
}

.animate-scale-in {
  animation: scaleIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

/* Staggering Delays */
.delay-1 { animation-delay: 0.1s; }
.stagger-1 { animation: fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; animation-delay: 0.1s; }
.stagger-2 { animation: fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; animation-delay: 0.2s; }
.stagger-3 { animation: fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; animation-delay: 0.3s; }
.stagger-4 { animation: fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; animation-delay: 0.4s; }

/* Vue Transition Component (Tab switching) */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(10px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}

/* Interactive States */
.hover-lift {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.025);
}

.habits-page {
  font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  overflow-x: hidden;
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
  padding: 48px 32px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.pulse-icon {
  font-size: 32px;
  color: #94a3b8;
  margin-bottom: 16px;
  animation: floatPulse 3s ease-in-out infinite;
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
  max-width: 400px;
}
</style>