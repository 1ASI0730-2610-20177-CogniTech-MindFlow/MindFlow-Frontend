<template>
  <div class="dashboard-card">
    <h3 class="card-title">{{ t('dashboard.dailyHabits.title') }}</h3>

    <div class="habits-list">
      <div
          v-for="habit in dashboardStore.habits"
          :key="habit.id"
          class="habit-item"
          @click="dashboardStore.toggleHabit(habit.id)"
      >
        <div class="habit-left">
          <div :class="['custom-checkbox', { 'checked': habit.completed }]">
            <i v-if="habit.completed" class="pi pi-check text-white text-xs"></i>
          </div>
          <span :class="['habit-title', { 'text-strikethrough': habit.completed }]">
            {{ habit.title }}
          </span>
        </div>

        <div v-if="habit.streak > 0" class="streak-badge">
          🔥 {{ habit.streak }} {{ t('dashboard.dailyHabits.days') }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { useDashboardStore } from '@/dashboard/application/dashboard.store'

const { t } = useI18n()
const dashboardStore = useDashboardStore()
</script>

<style scoped>
.habits-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.habit-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  padding: 4px 0;
}

.habit-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.custom-checkbox {
  width: 20px;
  height: 20px;
  border: 2px solid var(--border-color);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.custom-checkbox.checked {
  background-color: #34d399;
  border-color: #34d399;
}

.habit-title {
  font-size: 14px;
  color: var(--text-primary);
  transition: color 0.2s;
}

.text-strikethrough {
  text-decoration: line-through;
  color: var(--text-muted);
}

.streak-badge {
  background: rgba(217,119,6,0.08);
  color: #d97706;
  font-size: 11px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 4px;
}
</style>