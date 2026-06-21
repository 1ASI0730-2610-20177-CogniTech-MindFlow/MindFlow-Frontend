<template>
  <div class="transparent-chart-container large-chart theme-transition">
    <div class="card-header">
      <h3 class="card-title">{{ t('analytics.components.trendChart.title') }}</h3>
      <div v-if="translatedChartData?.datasets?.length" class="chart-legend">
        <span v-for="ds in translatedChartData.datasets" :key="ds.label" class="legend-item">
          <span class="box" :style="{ background: ds.borderColor || ds.backgroundColor }"></span> {{ ds.label }}
        </span>
      </div>
    </div>
    <div class="chart-wrapper">
      <Chart v-if="ready && translatedChartData" type="line" :data="translatedChartData" :options="chartOptions" style="height: 100%; width: 100%;" />
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import Chart from 'primevue/chart'

const props = defineProps({ chartData: Object, chartOptions: Object })
const { t } = useI18n()
const ready = ref(false)
onMounted(() => { setTimeout(() => { ready.value = true }, 800) })

const translateIfNeeded = (key, fallback = '') => {
  if (!key) return fallback
  const translated = t(key)
  return translated === key ? fallback || key : translated
}

const translatedChartData = computed(() => {
  if (!props.chartData?.datasets?.length) return null

  const rawLabels = props.chartData.labelsKeys?.length
    ? props.chartData.labelsKeys
    : props.chartData.labels || []

  const labels = rawLabels.map((item, index) => {
    if (typeof item === 'string') {
      return translateIfNeeded(item, props.chartData.labels?.[index] || item)
    }
    return translateIfNeeded(item?.key, item?.fallback || '')
  })

  const datasets = (props.chartData.datasets || []).map((dataset) => ({
    ...dataset,
    label: translateIfNeeded(dataset.labelKey, dataset.label)
  }))

  return { ...props.chartData, labels, datasets }
})
</script>

<style scoped>
.transparent-chart-container {
  padding: 36px; display: flex; flex-direction: column;
  background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: 24px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.04);
  transition: box-shadow 0.3s ease, transform 0.3s ease;
}
.transparent-chart-container:hover {
  box-shadow: 0 8px 32px rgba(0,0,0,0.08);
  transform: translateY(-2px);
}
.large-chart { height: 420px; }

.card-header { margin-bottom: 28px; display: flex; flex-direction: column; gap: 10px; }
.card-title {
  font-size: 18px; color: var(--text-primary); margin: 0; font-weight: 700;
  padding-left: 12px; border-left: 3px solid var(--global-blue);
}

.chart-legend {
  display: flex; gap: 20px; font-size: 12px; color: var(--text-muted); font-weight: 500;
  background: var(--bg-surface-secondary); padding: 8px 16px; border-radius: 50px;
  align-self: flex-start;
}
.legend-item { display: flex; align-items: center; gap: 8px; }
.box { width: 10px; height: 10px; border-radius: 50%; }
.bg-light { background: var(--text-muted); }
.bg-blue { background: var(--global-blue); }

.chart-wrapper { flex: 1; position: relative; min-height: 200px; border-radius: 12px; overflow: hidden; }

@media (max-width: 768px) {
  .large-chart { height: 320px; }
  .transparent-chart-container { padding: 20px; border-radius: 16px; }
  .card-header { margin-bottom: 16px; }
  .card-title { font-size: 15px; }
  .chart-legend { padding: 6px 12px; gap: 12px; font-size: 11px; }
}

@media (max-width: 480px) {
  .large-chart { height: 280px; }
  .transparent-chart-container { padding: 16px; }
  .chart-wrapper { min-height: 160px; }
}
</style>