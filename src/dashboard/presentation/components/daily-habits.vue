<template>
  <div class="dashboard-card theme-transition">
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
          <i class="pi pi-bolt"></i> {{ habit.streak }} {{ t('dashboard.dailyHabits.days') }}
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
  gap: 10px;
  margin-top: 16px;
}

.habit-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  padding: 12px 16px;
  border-radius: 14px;
  background: var(--bg-surface-secondary);
  border: 1px solid var(--border-color);
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
  overflow: hidden;
}

.habit-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  border-radius: 14px 0 0 14px;
  background: var(--accent-primary);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.habit-item:hover {
  transform: translateX(4px);
  border-color: transparent;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.06);
  background: rgba(99, 102, 241, 0.04);
}

.habit-item:hover::before {
  opacity: 1;
}

.habit-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.custom-checkbox {
  width: 24px;
  height: 24px;
  border: 2px solid var(--border-color);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  background: var(--bg-surface);
  flex-shrink: 0;
}

.custom-checkbox:hover {
  border-color: rgba(99, 102, 241, 0.3);
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.05);
}

.custom-checkbox.checked {
  background: var(--accent-primary);
  border-color: var(--accent-primary);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
  animation: checkBounce 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes checkBounce {
  0% { transform: scale(0.8); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

.custom-checkbox i {
  color: white;
  font-size: 12px;
  font-weight: 700;
}

.habit-title {
  font-size: 14px;
  color: var(--text-primary);
  transition: all 0.3s ease;
  font-weight: 500;
}

.habit-item:hover .habit-title:not(.text-strikethrough) {
  color: var(--accent-primary);
  font-weight: 600;
}

.text-strikethrough {
  text-decoration: line-through;
  color: var(--text-muted);
}

.streak-badge {
  background: var(--bg-surface);
  color: #d97706;
  font-size: 12px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 4px;
  border: 1px solid var(--border-color);
  letter-spacing: 0.02em;
  transition: all 0.3s ease;
}

.habit-item:hover .streak-badge {
  background: var(--bg-surface-secondary);
  border-color: rgba(217, 119, 6, 0.2);
  transform: translateY(-2px);
}
</style>