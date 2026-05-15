<template>
  <div class="premium-card summary-card" v-if="data">
    <div class="summary-left">
      <div class="tech-pill">LOG_DATE: {{ data.startDate }} - {{ data.endDate }}</div>
      <div class="score-display">
        <h2 class="huge-score">{{ data.score }}%</h2>
        <div class="score-details">
          <h4>{{ $t('analytics.components.weeklySummary.stabilityIndex') }}</h4>
          <span class="trend-pill">
            <i class="pi pi-arrow-up"></i> {{ data.trendPercentage }} (7D)
          </span>
        </div>
      </div>
    </div>

    <div class="summary-right">
      <div class="ai-tag"><span class="ai-dot"></span> NEXUS_AI_ANALYSIS</div>
      <p class="ai-text">{{ data.aiInsight }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps({ data: Object })
</script>

<style scoped>
.premium-card {
  background: rgba(255, 255, 255, 0.6); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.8);
  border-radius: 24px; box-shadow: 0 20px 40px -10px rgba(15, 23, 42, 0.05), 0 0 0 1px rgba(15, 23, 42, 0.02) inset;
  padding: 36px; transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}
.premium-card:hover { transform: translateY(-4px); box-shadow: 0 30px 60px -15px rgba(15, 23, 42, 0.08), 0 0 0 1px rgba(15, 23, 42, 0.03) inset; }

.summary-card { display: flex; justify-content: space-between; gap: 40px; }
.summary-left { flex: 1; display: flex; flex-direction: column; align-items: flex-start; border-right: 1px dashed rgba(15, 23, 42, 0.1); padding-right: 40px; }

.tech-pill { background: rgba(248, 250, 252, 0.8); border: 1px solid rgba(226, 232, 240, 0.8); border-radius: 99px; font-size: 10px; color: var(--text-muted); padding: 6px 14px; letter-spacing: 0.1em; text-transform: uppercase; font-weight: 600; }
.score-display { margin-top: 28px; }
.huge-score { font-size: 72px; color: var(--text-dark); margin: 0; line-height: 1; font-weight: 600; letter-spacing: -0.03em; }
.score-details h4 { font-size: 15px; color: var(--text-dark); margin: 16px 0 10px 0; font-weight: 600; }
.trend-pill { display: inline-flex; align-items: center; gap: 6px; background: rgba(59, 130, 246, 0.1); color: var(--global-blue); font-size: 11px; font-weight: 600; padding: 4px 10px; border-radius: 6px; letter-spacing: 0.05em; }

.summary-right { flex: 1.5; display: flex; flex-direction: column; justify-content: center; }
.ai-tag { display: flex; align-items: center; gap: 8px; font-size: 10px; font-weight: 600; color: var(--global-blue); margin-bottom: 20px; letter-spacing: 0.1em; }
.ai-dot { width: 6px; height: 6px; background: var(--global-blue); box-shadow: 0 0 8px rgba(59, 130, 246, 0.5); }
.ai-text { font-size: 18px; color: var(--text-muted); line-height: 1.7; font-style: italic; margin: 0; }

/* === RESPONSIVE === */
@media (max-width: 768px) {
  .summary-card { flex-direction: column; gap: 24px; padding: 24px; }
  .summary-left { border-right: none; border-bottom: 1px dashed rgba(15, 23, 42, 0.1); padding-right: 0; padding-bottom: 24px; align-items: center; text-align: center; }
  .score-display { display: flex; flex-direction: column; align-items: center; }
  .huge-score { font-size: 56px; }
  .ai-text { font-size: 16px; text-align: justify; }
}
</style>