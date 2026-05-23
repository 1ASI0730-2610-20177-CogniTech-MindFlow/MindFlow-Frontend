<template>
  <div class="kpi-grid" v-if="kpis && kpis.length > 0">
    <div v-for="(kpi, index) in localizedKpis" :key="index" class="premium-card kpi-card theme-transition">
      <div class="kpi-header">
        <span class="kpi-label theme-transition">{{ kpi.localizedLabel }}</span>
        <div class="active-badge theme-transition">
          <span class="status-dot" :style="dotStyle(kpi.colorClass)"></span> {{ t('analytics.components.weeklySummary.active') }}
        </div>
      </div>
      <h2 class="kpi-value theme-transition">{{ kpi.localizedValue }}</h2>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps({ kpis: Array })

const { t, locale } = useI18n()

const translateIfNeeded = (key, fallback = '') => {
  if (!key) return fallback
  const translated = t(key)
  return translated === key ? fallback || key : translated
}

const resolvedValue = (kpi) => {
  const baseValue = translateIfNeeded(kpi.valueKey, kpi.value)
  const unit = translateIfNeeded(kpi.unitKey, kpi.unit)
  return unit ? `${baseValue} ${unit}`.trim() : baseValue
}

const localizedKpis = computed(() => {
  // Dependencia explícita para refrescar al cambiar idioma.
  const currentLocale = locale.value
  void currentLocale

  return (props.kpis || []).map((kpi) => ({
    ...kpi,
    localizedLabel: translateIfNeeded(kpi.labelKey, kpi.label),
    localizedValue: resolvedValue(kpi)
  }))
})

const dotStyle = (colorClass = '') => {
  if (colorClass.includes('green')) {
    return { background: 'var(--global-green)', boxShadow: '0 0 6px var(--global-green)' }
  }

  if (colorClass.includes('orange')) {
    return { background: '#f59e0b', boxShadow: '0 0 6px #f59e0b' }
  }

  return { background: 'var(--global-blue)', boxShadow: '0 0 6px var(--global-blue)' }
}
</script>

<style scoped>
.kpi-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }

.premium-card {
  background: var(--bg-surface);
  border: 1px solid var(--border-light);
  border-radius: 20px;
  box-shadow: var(--shadow-sm);
  padding: 28px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: all 0.4s ease;
}
.premium-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-md); }

.kpi-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
.kpi-label { font-size: 13px; font-weight: 700; color: var(--text-primary); letter-spacing: 0.02em; }

.active-badge { display: flex; align-items: center; gap: 6px; background: var(--bg-surface-secondary); border: 1px solid var(--border-color); padding: 4px 8px; border-radius: 99px; font-size: 9px; font-weight: 600; color: var(--text-muted); letter-spacing: 0.1em; }
.status-dot { width: 6px; height: 6px; border-radius: 50%; }

.kpi-value { font-size: 32px; color: var(--text-primary); margin: 0; font-weight: 600; letter-spacing: -0.05em; }

@media (max-width: 1024px) {
  .kpi-grid { gap: 16px; }
  .premium-card { padding: 20px; }
  .kpi-value { font-size: 28px; }
}
@media (max-width: 768px) {
  .kpi-grid { grid-template-columns: 1fr; }
}
</style>