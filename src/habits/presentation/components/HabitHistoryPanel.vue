<template>
  <div class="history-panel">
    <p v-if="weeks.length === 0" class="empty">{{ $t('habits.history.empty') }}</p>

    <article v-for="week in weeks" :key="week.weekLabel" class="week-card">
      <header class="week-header">
        <div>
          <h3>{{ week.weekLabel }}</h3>
          <span class="week-meta">
            {{ week.totalCompleted }}/{{ week.totalTracked }} {{ $t('habits.history.daysCompleted') }}
          </span>
        </div>
        <span class="week-percent">{{ week.overallPercent }}%</span>
      </header>

      <div class="week-bar">
        <div class="week-bar-fill" :style="{ width: `${week.overallPercent}%` }" />
      </div>

      <ul class="habit-stats">
        <li v-for="habit in week.habits" :key="`${week.weekLabel}-${habit.habitId}`">
          <div class="habit-info">
            <span class="habit-name">{{ habit.habitName }}</span>
            <span class="habit-category">{{ habit.category }}</span>
          </div>
          <div class="habit-metrics">
            <span class="compliance">{{ habit.completedDays }}/{{ habit.trackedDays }} {{ $t('habits.history.days') }}</span>
            <span class="streak">
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
</script>

<style scoped>
.history-panel {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.empty {
  text-align: center;
  color: #64748b;
  padding: 32px;
  background: #fff;
  border-radius: 14px;
  border: 1px solid #edf0f5;
}

.week-card {
  background: #fff;
  border: 1px solid #edf0f5;
  border-radius: 14px;
  padding: 20px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02);
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
  color: #1e293b;
}

.week-meta {
  font-size: 13px;
  color: #64748b;
}

.week-percent {
  font-size: 20px;
  font-weight: 700;
  color: #16a34a;
}

.week-bar {
  height: 8px;
  background: #ecfdf5;
  border-radius: 999px;
  overflow: hidden;
  margin-bottom: 16px;
}

.week-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #22c55e, #16a34a);
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
  background: #f8fafc;
  border-radius: 10px;
}

.habit-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.habit-name {
  font-size: 14px;
  font-weight: 500;
  color: #1e293b;
}

.habit-category {
  font-size: 12px;
  color: #64748b;
}

.habit-metrics {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
  font-size: 12px;
}

.compliance {
  color: #475569;
  font-weight: 500;
}

.streak {
  color: #d97706;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
</style>