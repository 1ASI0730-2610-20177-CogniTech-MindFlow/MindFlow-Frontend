<template>
  <div class="history-panel theme-transition">
    <p v-if="weeks.length === 0" class="empty theme-transition">{{ $t('habits.history.empty') }}</p>

    <article v-for="week in weeks" :key="week.weekLabel" class="week-card theme-transition">
      <header class="week-header">
        <div>
          <h3 class="theme-transition">{{ week.weekLabel }}</h3>
          <span class="week-meta theme-transition">
            {{ week.totalCompleted }}/{{ week.totalTracked }} {{ $t('habits.history.daysCompleted') }}
          </span>
        </div>
        <span class="week-percent theme-transition">{{ week.overallPercent }}%</span>
      </header>

      <div class="week-bar theme-transition">
        <div class="week-bar-fill theme-transition" :style="{ width: `${week.overallPercent}%` }" />
      </div>

      <ul class="habit-stats">
        <li
          v-for="habit in week.habits"
          :key="`${week.weekLabel}-${habit.habitId}`"
          class="habit-stat-row theme-transition"
          @click="$emit('view-habit', habit.habitId)"
        >
          <div class="habit-info">
            <span class="habit-name theme-transition">{{ habit.habitName }}</span>
            <span class="habit-category theme-transition">{{ habit.category }}</span>
          </div>
          <div class="habit-metrics">
            <span class="compliance theme-transition">{{ habit.completedDays }}/{{ habit.trackedDays }} {{ $t('habits.history.days') }}</span>
            <span class="streak theme-transition">
              <i class="pi pi-bolt"></i> {{ $t('habits.history.streak') }} {{ habit.weekStreak }} {{ $t('habits.history.days') }}
            </span>
          </div>
        </li>
      </ul>
    </article>
  </div>
</template>

<script setup>
defineProps({
  weeks: { type: Array, default: () => [] }
})

defineEmits(['view-habit'])
</script>

<style scoped>
.history-panel {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.empty {
  text-align: center;
  color: var(--text-secondary);
  padding: 32px;
  background: var(--bg-surface);
  border-radius: 14px;
  border: 1px solid var(--border-light);
}

.week-card {
  background: var(--bg-surface);
  border: 1px solid var(--border-light);
  border-radius: 14px;
  padding: 20px;
  box-shadow: var(--shadow-sm);
}

.week-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.week-header h3 {
  margin: 0 0 4px;
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

.week-meta {
  font-size: 13px;
  color: var(--text-secondary);
}

.week-percent {
  font-size: 20px;
  font-weight: 700;
  color: var(--accent-success);
}

.week-bar {
  height: 8px;
  background: var(--bg-surface-secondary);
  border-radius: 999px;
  overflow: hidden;
  margin-bottom: 16px;
}

.week-bar-fill {
  height: 100%;
  background: var(--accent-success);
  border-radius: 999px;
}

.habit-stats {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.habit-stats li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding: 10px 12px;
  background: var(--bg-surface-secondary);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.habit-stats li:hover {
  background: rgba(99, 102, 241, 0.04);
  transform: translateX(3px);
}

.habit-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.habit-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
}

.habit-category {
  font-size: 12px;
  color: var(--text-secondary);
}

.habit-metrics {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
  font-size: 12px;
}

.compliance {
  color: var(--text-primary);
  font-weight: 500;
}

.streak {
  color: var(--accent-warning);
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
</style>