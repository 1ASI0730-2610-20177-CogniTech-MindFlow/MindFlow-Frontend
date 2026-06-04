<template>
  <div class="premium-card summary-card theme-transition" v-if="data">
    <div class="summary-left">
      <div class="tech-pill theme-transition">{{ t('analytics.components.weeklySummary.logDateRange', { start: data.startDate, end: data.endDate }) }}</div>
      <div class="score-display">
        <h2 class="huge-score theme-transition">{{ data.score }}%</h2>
        <div class="score-details">
          <h4 class="theme-transition">{{ t('analytics.components.weeklySummary.stabilityIndex') }}</h4>
          <span class="trend-pill theme-transition">
            <i class="pi pi-arrow-up"></i> {{ t('analytics.components.weeklySummary.trendRange', { trend: data.trendPercentage }) }}
          </span>
        </div>
      </div>
    </div>

    <div class="summary-right">
      <div class="ai-tag theme-transition"><span class="ai-dot"></span> {{ t('analytics.components.weeklySummary.aiAnalysis') }}</div>
      <p class="ai-text theme-transition">{{ translatedInsight }}</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps({ data: Object })
const { t, locale } = useI18n()

const translatedInsight = computed(() => {
  if (!props.data) return ''

  const localized = props.data.aiInsightLocalized
  if (localized && typeof localized === 'object') {
    return localized[locale.value] || localized.es || localized.en || props.data.aiInsight || ''
  }

  return props.data.aiInsight || ''
})
</script>

<style scoped>
.premium-card {
  background: var(--bg-surface);
  border: 1px solid var(--border-light);
  border-radius: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  padding: 40px;
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
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
  transition: left 0.8s ease;
  pointer-events: none;
}

.premium-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.12);
  border-color: rgba(99, 102, 241, 0.2);
}

.premium-card:hover::before {
  left: 100%;
}

.summary-card {
  display: flex;
  justify-content: space-between;
  gap: 48px;
  position: relative;
  z-index: 1;
}

.summary-left {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  border-right: 1px solid rgba(99, 102, 241, 0.15);
  padding-right: 48px;
}

.tech-pill {
  background: var(--bg-surface-secondary);
  border: 1px solid var(--border-color);
  border-radius: 50px;
  font-size: 10px;
  color: var(--text-muted);
  padding: 8px 16px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  font-weight: 700;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.tech-pill:hover {
  border-color: var(--border-color);
  background: var(--bg-primary);
}

.score-display {
  margin-top: 32px;
}

.huge-score {
  font-size: 72px;
  color: var(--accent-primary);
  margin: 0;
  line-height: 1;
  font-weight: 800;
  letter-spacing: -0.03em;
  background: linear-gradient(135deg, var(--accent-primary), var(--accent-hover));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: scoreFloat 2s ease-in-out infinite;
}

@keyframes scoreFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}

.score-details h4 {
  font-size: 15px;
  color: var(--text-primary);
  margin: 20px 0 12px 0;
  font-weight: 700;
  transition: color 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.trend-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.12), rgba(59, 130, 246, 0.06));
  color: #3b82f6;
  font-size: 11px;
  font-weight: 700;
  padding: 6px 12px;
  border-radius: 8px;
  letter-spacing: 0.05em;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  border: 1px solid rgba(59, 130, 246, 0.2);
}

.trend-pill:hover {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(59, 130, 246, 0.1));
  border-color: rgba(59, 130, 246, 0.3);
}

.trend-pill i {
  animation: trendArrowBounce 1.5s ease-in-out infinite;
}

@keyframes trendArrowBounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-2px); }
}

.summary-right {
  flex: 1.5;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.ai-tag {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 10px;
  font-weight: 700;
  color: #3b82f6;
  margin-bottom: 20px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.ai-dot {
  width: 8px;
  height: 8px;
  background: #3b82f6;
  border-radius: 50%;
  box-shadow: 0 0 12px rgba(59, 130, 246, 0.6);
  animation: dotPulseBlue 2s ease-in-out infinite;
}

@keyframes dotPulseBlue {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.15); opacity: 0.8; }
}

.ai-text {
  font-size: 18px;
  color: var(--text-secondary);
  line-height: 1.8;
  font-style: italic;
  margin: 0;
  transition: color 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.premium-card:hover .ai-text {
  color: var(--text-primary);
}

@media (max-width: 768px) {
  .premium-card {
    padding: 28px;
  }

  .summary-card {
    flex-direction: column;
    gap: 28px;
  }

  .summary-left {
    border-right: none;
    border-bottom: 1px solid rgba(99, 102, 241, 0.15);
    padding-right: 0;
    padding-bottom: 28px;
    align-items: center;
    text-align: center;
    width: 100%;
  }

  .huge-score {
    font-size: 56px;
  }

  .ai-text {
    font-size: 16px;
    text-align: justify;
  }
}
</style>