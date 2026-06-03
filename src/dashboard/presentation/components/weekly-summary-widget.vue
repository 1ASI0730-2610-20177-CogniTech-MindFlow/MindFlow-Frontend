<template>
  <div class="dashboard-card">
    <div class="header-row">
      <div class="header-left">
        <h3 class="card-title">{{ t('dashboard.weeklySummary.title') }}</h3>
        <span v-if="trend" class="trend-badge" :class="trendDir">
          {{ trend }}
        </span>
      </div>
      <router-link to="/analytics" class="view-all">
        {{ t('dashboard.weeklySummary.viewAll') }}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
      </router-link>
    </div>

    <div v-if="hasData" class="chart-container">
      <div class="bars-row">
        <div class="bar-group" v-for="(item, index) in chartData" :key="index">
          <div class="bar-track">
            <div
              class="bar"
              :class="getBarColor(item)"
              :style="{ height: `${Math.max(0, Math.min(100, item * 10))}%`, animationDelay: `${index * 0.06}s` }"
            ></div>
          </div>
          <span class="day-label">{{ getDayLabel(index) }}</span>
        </div>
      </div>

      <div class="chart-footer">
        <div class="stat-item">
          <span class="stat-value">{{ average }}</span>
          <span class="stat-label">{{ t('dashboard.weeklySummary.average') }}</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <span class="stat-value">{{ peak }}</span>
          <span class="stat-label">{{ t('dashboard.weeklySummary.peak') }}</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <span class="stat-value">{{ low }}</span>
          <span class="stat-label">{{ t('dashboard.weeklySummary.low') }}</span>
        </div>
      </div>
    </div>

    <div v-else class="empty-state">
      <div class="empty-icon">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
      </div>
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
const dayLabelMap = { mon: 'L', tue: 'M', wed: 'X', thu: 'J', fri: 'V', sat: 'S', sun: 'D' }

const hasData = computed(() => {
  const weekly = dashboardStore.weeklySummary
  return !!(weekly && weekly.datasets && weekly.datasets[0] && Array.isArray(weekly.datasets[0].data) && weekly.datasets[0].data.length)
})

const chartData = computed(() => (hasData.value ? dashboardStore.weeklySummary.datasets[0].data : []))

const trend = computed(() => {
  if (!hasData.value) return null
  return dashboardStore.weeklySummary.trend_percentage || null
})

const trendDir = computed(() => {
  if (!trend.value) return ''
  const num = parseFloat(trend.value)
  if (num > 0) return 'up'
  if (num < 0) return 'down'
  return 'neutral'
})

const average = computed(() => {
  if (!chartData.value.length) return '-'
  return (chartData.value.reduce((a, b) => a + b, 0) / chartData.value.length).toFixed(1)
})

const peak = computed(() => {
  if (!chartData.value.length) return '-'
  return Math.max(...chartData.value).toFixed(1)
})

const low = computed(() => {
  if (!chartData.value.length) return '-'
  return Math.min(...chartData.value).toFixed(1)
})

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

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.trend-badge {
  display: inline-flex;
  align-items: center;
  padding: 2px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.02em;
}

.trend-badge.up {
  background: rgba(16, 185, 129, 0.1);
  color: var(--accent-success);
}

.trend-badge.up::before {
  content: '↑';
  margin-right: 3px;
}

.trend-badge.down {
  background: rgba(239, 68, 68, 0.1);
  color: var(--accent-danger);
}

.trend-badge.down::before {
  content: '↓';
  margin-right: 3px;
}

.trend-badge.neutral {
  background: rgba(99, 102, 241, 0.1);
  color: var(--accent-primary);
}

.trend-badge.neutral::before {
  content: '→';
  margin-right: 3px;
}

.view-all {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--accent-primary);
  text-decoration: none;
  font-weight: 500;
  padding: 6px 12px;
  border-radius: 8px;
  transition: background 0.2s;
}

.view-all:hover {
  background: rgba(99, 102, 241, 0.08);
}

.chart-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.bars-row {
  display: flex;
  align-items: flex-end;
  height: 140px;
  gap: 6px;
  padding-top: 8px;
}

.bar-group {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  height: 100%;
}

.bar-track {
  flex: 1;
  width: 100%;
  display: flex;
  align-items: flex-end;
  border-radius: 6px;
  background: var(--bg-surface-secondary);
  overflow: hidden;
  position: relative;
}

.bar {
  width: 100%;
  border-radius: 6px 6px 0 0;
  min-height: 4px;
  animation: barGrow 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
  transition: opacity 0.3s;
  position: relative;
}

.bar::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 50%;
  border-radius: 6px 6px 0 0;
  background: linear-gradient(180deg, rgba(255,255,255,0.25), transparent);
}

.color-green {
  background: linear-gradient(180deg, #34d399, #10b981);
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
}

.color-yellow {
  background: linear-gradient(180deg, #fbbf24, #f59e0b);
  box-shadow: 0 2px 8px rgba(245, 158, 11, 0.3);
}

.color-red {
  background: linear-gradient(180deg, #f87171, #ef4444);
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
}

.color-light {
  background: var(--bg-surface-secondary);
}

.day-label {
  font-size: 11px;
  font-weight: 500;
  color: var(--text-muted);
  flex-shrink: 0;
}

.chart-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
  padding: 16px 20px;
  background: var(--bg-surface-secondary);
  border-radius: 12px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.stat-value {
  font-size: 20px;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1;
  font-variant-numeric: tabular-nums;
}

.stat-label {
  font-size: 11px;
  color: var(--text-muted);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.stat-divider {
  width: 1px;
  height: 32px;
  background: var(--border-color);
}

.empty-state {
  height: 180px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: var(--text-muted);
  font-size: 13px;
}

.empty-icon {
  opacity: 0.4;
}

@keyframes barGrow {
  from {
    height: 0 !important;
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
