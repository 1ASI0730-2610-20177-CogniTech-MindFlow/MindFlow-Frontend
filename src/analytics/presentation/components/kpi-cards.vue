<template>
  <div class="kpi-grid" v-if="kpis && kpis.length > 0">
    <div v-for="(kpi, index) in kpis" :key="index" class="premium-card kpi-card">
      <div class="kpi-header">
        <span class="kpi-label">{{ kpi.label }}</span>
        <div class="active-badge">
          <span :class="['status-dot', kpi.colorClass.replace('border', 'bg')]"></span> {{ $t('analytics.components.weeklySummary.active') }}
        </div>
      </div>
      <h2 class="kpi-value">{{ kpi.value }}</h2>
    </div>
  </div>
</template>

<script setup>
defineProps({ kpis: Array })
</script>

<style scoped>
.kpi-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }

.premium-card { background: rgba(255, 255, 255, 0.6); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.8); border-radius: 20px; box-shadow: 0 10px 30px -10px rgba(15, 23, 42, 0.04); padding: 28px; display: flex; flex-direction: column; justify-content: space-between; transition: all 0.4s ease; }
.premium-card:hover { transform: translateY(-4px); box-shadow: 0 20px 40px -10px rgba(15, 23, 42, 0.08); }

.kpi-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
.kpi-label { font-size: 13px; font-weight: 700; color: var(--text-dark); letter-spacing: 0.02em; }

.active-badge { display: flex; align-items: center; gap: 6px; background: rgba(248, 250, 252, 0.8); border: 1px solid rgba(226, 232, 240, 0.6); padding: 4px 8px; border-radius: 99px; font-size: 9px; font-weight: 600; color: var(--text-muted); letter-spacing: 0.1em; }
.status-dot { width: 6px; height: 6px; border-radius: 50%; }
.bg-blue { background: var(--global-blue); box-shadow: 0 0 6px var(--global-blue); }
.bg-green { background: var(--global-green); box-shadow: 0 0 6px var(--global-green); }
.bg-orange { background: #f59e0b; box-shadow: 0 0 6px #f59e0b; }

.kpi-value { font-size: 32px; color: var(--text-dark); margin: 0; font-weight: 600; letter-spacing: -0.05em; }

/* === RESPONSIVE === */
@media (max-width: 1024px) {
  .kpi-grid { gap: 16px; }
  .premium-card { padding: 20px; }
  .kpi-value { font-size: 28px; }
}
@media (max-width: 768px) {
  .kpi-grid { grid-template-columns: 1fr; }
}
</style>