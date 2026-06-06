<template>
  <div class="transparent-chart-container large-chart theme-transition">
    <div class="card-header">
      <h3 class="card-title">{{ t('analytics.components.trendChart.title') }}</h3>
      <div class="chart-legend">
        <span class="legend-item"><span class="box bg-light"></span> {{ t('analytics.components.trendChart.legend.wellbeing') }}</span>
        <span class="legend-item"><span class="box bg-blue"></span> {{ t('analytics.components.trendChart.legend.stress') }}</span>
      </div>
    </div>
    <div class="chart-wrapper">
      <Chart v-if="translatedChartData" type="line" :data="translatedChartData" :options="chartOptions" style="height: 100%; width: 100%;" />
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
.transparent-chart-container { padding: 36px; display: flex; flex-direction: column; }
.large-chart { height: 420px; }

.card-header { margin-bottom: 28px; display: flex; flex-direction: column; gap: 10px; }
.card-title { font-size: 18px; color: var(--text-dark); margin: 0; font-weight: 700; }

.chart-legend { display: flex; gap: 20px; font-size: 12px; color: var(--text-muted); font-weight: 500; }
.legend-item { display: flex; align-items: center; gap: 8px; }
.box { width: 10px; height: 10px; border-radius: 3px; }
.bg-light { background: #e2e8f0; }
.bg-blue { background: var(--global-blue); }

.chart-wrapper { flex: 1; position: relative; min-height: 200px; }
</style>