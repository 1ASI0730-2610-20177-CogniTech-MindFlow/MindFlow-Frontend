<template>
  <div class="kpi-grid" v-if="kpis && kpis.length > 0">
    <div v-for="(kpi, index) in localizedKpis" :key="index" class="premium-card kpi-card theme-transition">
      <div class="kpi-header">
        <span class="status-dot" :style="dotStyle(kpi.colorClass)"></span>
        <span class="kpi-label theme-transition">{{ kpi.localizedLabel }}</span>
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
    return { background: 'var(--global-green)' }
  }

  if (colorClass.includes('orange')) {
    return { background: 'var(--global-orange)' }
  }

  return { background: 'var(--global-blue)' }
}
</script>

<style scoped>
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.premium-card {
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
  padding: 28px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
  overflow: hidden;
}

.premium-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.1), transparent);
  transition: left 0.6s ease;
  pointer-events: none;
}

.premium-card::after {
  content: '';
  position: absolute;
  top: 0;
  left: 24px;
  right: 24px;
  height: 3px;
  background: linear-gradient(90deg, var(--accent-primary), var(--accent-hover));
  border-radius: 0 0 3px 3px;
}

.premium-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.12);
  border-color: rgba(99, 102, 241, 0.2);
}

.premium-card:active {
  transform: translateY(-2px) scale(0.98);
}

.premium-card:hover::before {
  left: 100%;
}

.kpi-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 24px;
  position: relative;
  z-index: 1;
}

.kpi-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-secondary);
  letter-spacing: 0.05em;
  text-transform: uppercase;
  transition: color 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.kpi-value {
  font-size: 32px;
  color: var(--text-primary);
  margin: 0;
  font-weight: 700;
  letter-spacing: -0.05em;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
  z-index: 1;
}

.premium-card:hover .kpi-value {
  color: var(--accent-primary);
}

@media (max-width: 1024px) {
  .kpi-grid {
    gap: 16px;
  }
  .premium-card {
    padding: 20px;
  }
  .kpi-value {
    font-size: 28px;
  }
}

@media (max-width: 768px) {
  .kpi-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .kpi-grid {
    grid-template-columns: 1fr;
  }
}
</style>