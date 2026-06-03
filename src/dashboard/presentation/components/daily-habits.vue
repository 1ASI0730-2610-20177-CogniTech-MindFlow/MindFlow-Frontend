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
  gap: 12px;
}

.habit-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  padding: 10px 12px;
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  animation: slideInHabit 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes slideInHabit {
  from {
    opacity: 0;
    transform: translateX(-8px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.habit-item:hover {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(99, 102, 241, 0.03));
  transform: translateX(4px);
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
  position: relative;
  cursor: pointer;
}

.custom-checkbox:hover {
  border-color: rgba(99, 102, 241, 0.3);
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.05);
}

.custom-checkbox.checked {
  background: linear-gradient(135deg, #34d399, #10b981);
  border-color: #34d399;
  box-shadow: 0 4px 12px rgba(52, 211, 153, 0.3);
  animation: checkBounce 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes checkBounce {
  0% {
    transform: scale(0.8);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

.custom-checkbox i {
  color: white;
  font-size: 12px;
  font-weight: 700;
}

.habit-title {
  font-size: 14px;
  color: var(--text-primary);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
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
  background: linear-gradient(135deg, rgba(217, 119, 6, 0.15), rgba(217, 119, 6, 0.08));
  color: #d97706;
  font-size: 12px;
  font-weight: 700;
  padding: 6px 10px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  border: 1px solid rgba(217, 119, 6, 0.2);
  letter-spacing: 0.02em;
}

.habit-item:hover .streak-badge {
  background: linear-gradient(135deg, rgba(217, 119, 6, 0.2), rgba(217, 119, 6, 0.12));
  border-color: rgba(217, 119, 6, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(217, 119, 6, 0.15);
}
</style>