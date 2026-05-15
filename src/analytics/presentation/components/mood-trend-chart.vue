<template>
  <div class="transparent-chart-container large-chart">
    <div class="card-header">
      <h3 class="card-title">{{ $t('analytics.components.trendChart.title') }}</h3>
      <div class="chart-legend">
        <span class="legend-item"><span class="box bg-light"></span> {{ $t('analytics.components.trendChart.legend.wellbeing') }}</span>
        <span class="legend-item"><span class="box bg-blue"></span> {{ $t('analytics.components.trendChart.legend.stress') }}</span>
      </div>
    </div>
    <div class="chart-wrapper">
      <Chart v-if="chartData" type="line" :data="chartData" :options="chartOptions" class="h-full w-full" />
    </div>
  </div>
</template>

<script setup>
import Chart from 'primevue/chart'
defineProps({ chartData: Object, chartOptions: Object })
</script>

<style scoped>
.transparent-chart-container { padding: 36px; display: flex; flex-direction: column; }
.large-chart { height: 420px; }

.card-header { margin-bottom: 32px; display: flex; flex-direction: column; gap: 12px; }
.card-title { font-size: 18px; color: var(--text-dark); margin: 0; font-weight: 700; }

.chart-legend { display: flex; gap: 16px; font-size: 12px; color: var(--text-muted); font-weight: 500; }
.legend-item { display: flex; align-items: center; gap: 6px; }
.box { width: 12px; height: 12px; border-radius: 2px; }
.bg-light { background: #e2e8f0; }
.bg-blue { background: var(--global-blue); }

.chart-wrapper { flex: 1; position: relative; }
</style>