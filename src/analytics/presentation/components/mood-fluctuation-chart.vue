<template>
  <div class="transparent-chart-container">
    <div class="card-header">
      <div class="title-group">
        <h3 class="card-title">{{ $t('analytics.components.fluctuationChart.title') }}</h3>
        <span class="mono-subtitle">FREQ_DISTRIBUTION</span>
      </div>
      <div class="chart-status">
        <span class="live-dot"></span> LIVE
      </div>
    </div>

    <div class="chart-content">
      <div class="chart-y-label">{{ $t('analytics.components.fluctuationChart.yLabel') }}</div>
      <div class="chart-wrapper">
        <Chart v-if="chartData" type="bar" :data="chartData" :options="chartOptions" class="h-full w-full" />
      </div>
    </div>
  </div>
</template>

<script setup>
import Chart from 'primevue/chart'
defineProps({ chartData: Object, chartOptions: Object })
</script>

<style scoped>
.transparent-chart-container { padding: 36px; display: flex; flex-direction: column; height: 380px; }

.card-header { margin-bottom: 24px; display: flex; justify-content: space-between; align-items: flex-start; }
.card-title { font-size: 18px; color: var(--text-dark); margin: 0 0 4px 0; font-weight: 700; }
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
  color: var(--text-muted); letter-spacing: 0.1em; text-align: center; margin-right: 16px; padding-bottom: 24px;
}

.chart-wrapper { flex: 1; position: relative; }
</style>