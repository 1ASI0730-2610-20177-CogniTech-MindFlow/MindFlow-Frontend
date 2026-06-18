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
        <Chart v-if="ready && translatedChartData" type="bar" :data="translatedChartData" :options="chartOptions" style="height: 100%; width: 100%;" />
      </div>
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

  return {
    ...props.chartData,
    labels: (props.chartData.labelsKeys?.length ? props.chartData.labelsKeys : props.chartData.labels || []).map((item, index) => {
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
.transparent-chart-container {
  padding: 36px; display: flex; flex-direction: column; height: 380px;
  background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: 24px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.04);
  transition: box-shadow 0.3s ease, transform 0.3s ease;
}
.transparent-chart-container:hover {
  box-shadow: 0 8px 32px rgba(0,0,0,0.08);
  transform: translateY(-2px);
}

.card-header { margin-bottom: 24px; display: flex; justify-content: space-between; align-items: flex-start; }
.title-group { display: flex; flex-direction: column; gap: 4px; }
.card-title {
  font-size: 18px; color: var(--text-primary); margin: 0; font-weight: 700;
  padding-left: 12px; border-left: 3px solid var(--global-blue);
}
.mono-subtitle { font-size: 9px; font-weight: 600; color: var(--text-muted); letter-spacing: 0.1em; text-transform: uppercase; }

.chart-status {
  display: flex; align-items: center; gap: 6px; font-size: 10px; font-weight: 600; color: var(--global-blue);
  letter-spacing: 0.1em; background: rgba(59, 130, 246, 0.1); padding: 4px 10px; border-radius: 50px;
  backdrop-filter: blur(8px);
}

.live-dot { width: 6px; height: 6px; background: var(--global-blue); border-radius: 50%; animation: pulse 2s infinite; box-shadow: 0 0 8px var(--global-blue); }
@keyframes pulse { 0% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(1.2); } 100% { opacity: 1; transform: scale(1); } }

.chart-content { flex: 1; display: flex; position: relative; }

.chart-y-label {
  writing-mode: vertical-rl; transform: rotate(180deg); font-size: 10px; font-weight: 600;
  color: var(--text-muted); letter-spacing: 0.12em; text-align: center; margin-right: 12px; padding-bottom: 20px;
  opacity: 0.7; border-right: 1px solid var(--border-color); padding-right: 10px;
}

.chart-wrapper { flex: 1; position: relative; min-height: 200px; border-radius: 12px; overflow: hidden; }
</style>