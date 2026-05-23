<template>
  <div class="dashboard-card">
    <div class="header-row">
      <h3 class="card-title">{{ t('dashboard.weeklySummary.title') }}</h3>
      <router-link to="/analytics" class="view-all">{{ t('dashboard.weeklySummary.viewAll') }}</router-link>
    </div>

    <div v-if="hasData" class="mock-bar-chart">
      <div class="bar-group" v-for="(item, index) in chartData" :key="index">
        <div class="bar" :class="getBarColor(item)" :style="{ height: `${Math.max(0, Math.min(100, item * 10))}%` }"></div>
        <span class="day-label">{{ getDayLabel(index) }}</span>
      </div>
    </div>

    <div v-else class="empty-state">
      <p v-if="dashboardStore.isLoading">{{ t('dashboard.weeklySummary.loading') }}</p>
      <p v-else>{{ t('dashboard.weeklySummary.empty') }}</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useDashboardStore } from '@/dashboard/application/dashboard.store'

const dashboardStore = useDashboardStore()
const { t } = useI18n()

const defaultLabels = ['L', 'M', 'X', 'J', 'V', 'S', 'D']
const dayLabelMap = {
  mon: 'L',
  tue: 'M',
  wed: 'X',
  thu: 'J',
  fri: 'V',
  sat: 'S',
  sun: 'D'
}

const hasData = computed(() => {
  const weekly = dashboardStore.weeklySummary
  return !!(weekly && weekly.datasets && weekly.datasets[0] && Array.isArray(weekly.datasets[0].data) && weekly.datasets[0].data.length)
})

const chartData = computed(() => (hasData.value ? dashboardStore.weeklySummary.datasets[0].data : []))

const getBarColor = (value) => {
  if (value > 7) return 'color-green'
  if (value > 4) return 'color-yellow'
  if (value > 0) return 'color-red'
  return 'color-light'
}

const getDayLabel = (index) => {
  const key = dashboardStore.weeklySummary?.labels_keys?.[index] || ''
  if (!key) return defaultLabels[index] || ''

  const translated = t(key)
  if (translated && translated !== key) {
    return translated.slice(0, 1).toUpperCase()
  }

  const suffix = key.split('.').pop()?.toLowerCase()
  if (!suffix) return defaultLabels[index] || ''
  return dayLabelMap[suffix] || suffix.slice(0, 1).toUpperCase()
}
</script>

<style scoped>
.header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.view-all {
  font-size: 12px;
  color: var(--text-secondary);
  text-decoration: none;
  font-weight: 500;
}

.mock-bar-chart {
  display: flex;
  align-items: flex-end;
  height: 120px;
  gap: 2px;
  padding-top: 20px;
}

.bar-group {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  height: 100%;
}

.bar {
  width: 100%;
  border-radius: 4px 4px 0 0;
}

.color-yellow { background: #fcd34d; }
.color-red { background: #f87171; }
.color-green { background: #6ee7b7; }
.color-light { background: var(--bg-surface-secondary); }

.empty-state {
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  font-size: 13px;
}

.day-label {
  font-size: 10px;
  color: var(--text-muted);
  margin-top: 12px;
}
</style>