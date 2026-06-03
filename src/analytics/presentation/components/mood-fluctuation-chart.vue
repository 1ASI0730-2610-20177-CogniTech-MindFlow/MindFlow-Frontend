<template>
  <div class="transparent-chart-container theme-transition">
    <div class="card-header">
      <div class="title-group">
        <h3 class="card-title">{{ $t('analytics.components.fluctuationChart.title') }}</h3>
        <span class="mono-subtitle">{{ $t('analytics.components.fluctuationChart.subtitle') }}</span>
      </div>
      <div class="chart-status">
        <span class="live-dot"></span> {{ $t('analytics.components.fluctuationChart.live') }}
      </div>
    </div>

    <div class="chart-content">
      <div class="chart-y-label">{{ t('analytics.components.fluctuationChart.yLabel') }}</div>
      <div class="chart-wrapper">
        <Chart v-if="translatedChartData" type="bar" :data="translatedChartData" :options="chartOptions" style="height: 100%; width: 100%;" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import Chart from 'primevue/chart'

const props = defineProps({ chartData: Object, chartOptions: Object })
const { t } = useI18n()

const translateIfNeeded = (key, fallback = '') => {
  if (!key) return fallback
  const translated = t(key)
  return translated === key ? fallback || key : translated
}

const translatedChartData = computed(() => {
  if (!props.chartData) return null

  return {
    ...props.chartData,
    labels: (props.chartData.labelsKeys || props.chartData.labels || []).map((item, index) => {
      if (typeof item === 'string') {
        return translateIfNeeded(item, props.chartData.labels?.[index] || item)
      }

      return translateIfNeeded(item?.key, item?.fallback || '')
    }),
    datasets: (props.chartData.datasets || []).map((dataset) => ({
      ...dataset,
      label: translateIfNeeded(dataset.labelKey, dataset.label)
    }))
  }
})
</script>

<style scoped>
.transparent-chart-container { padding: 36px; display: flex; flex-direction: column; height: 380px; }

.card-header { margin-bottom: 24px; display: flex; justify-content: space-between; align-items: flex-start; }
.title-group { display: flex; flex-direction: column; gap: 4px; }
.card-title { font-size: 18px; color: var(--text-dark); margin: 0; font-weight: 700; }
.mono-subtitle { font-size: 9px; font-weight: 600; color: var(--text-muted); letter-spacing: 0.1em; text-transform: uppercase; }

.chart-status {
  display: flex; align-items: center; gap: 6px; font-size: 10px; font-weight: 600; color: var(--global-blue);
  letter-spacing: 0.1em; background: rgba(59, 130, 246, 0.1); padding: 4px 8px; border-radius: 4px;
}

.live-dot { width: 6px; height: 6px; background: var(--global-blue); border-radius: 50%; animation: pulse 2s infinite; }
@keyframes pulse { 0% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(1.2); } 100% { opacity: 1; transform: scale(1); } }

.chart-content { flex: 1; display: flex; position: relative; }

.chart-y-label {
  writing-mode: vertical-rl; transform: rotate(180deg); font-size: 10px; font-weight: 600;
  color: var(--text-muted); letter-spacing: 0.12em; text-align: center; margin-right: 12px; padding-bottom: 20px;
  opacity: 0.7;
}

.chart-wrapper { flex: 1; position: relative; }
</style>