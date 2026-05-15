<template>
  <Layout>
    <div class="high-end-analytics-page">
      <div class="optical-grid-bg"></div>

      <header class="hero-header hero-reveal">
        <div class="header-content">
          <h1 class="gradient-title">{{ $t('analytics.title') }}</h1>

          <div class="iot-telemetry-badge">
            <span class="telemetry-led"></span>
            <span class="typewriter-text">{{ $t('analytics.telemetry') }}</span>
          </div>
        </div>
      </header>

      <div v-if="analyticsStore.isLoading" class="premium-loading-state hero-reveal">
        <div class="organic-spinner">
          <svg viewBox="0 0 50 50">
            <circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="2"></circle>
          </svg>
        </div>
        <span class="loading-narrative">{{ $t('analytics.loading') }}</span>
      </div>

      <template v-else>
        <div class="asymmetric-content-wrapper">
          <div class="panel-reveal delay-1 w-summary-offset">
            <WeeklySummary :data="analyticsStore.summary" />
          </div>

          <div class="panel-reveal delay-2">
            <KpiCards :kpis="analyticsStore.kpis" />
          </div>

          <div class="asymmetric-grid">
            <div class="panel-reveal delay-3 grid-main deep-shadow-panel">
              <MoodFluctuationChart
                  :chartData="analyticsStore.fluctuationData"
                  :chartOptions="analyticsStore.fluctuationOptions"
              />
            </div>

            <div class="panel-reveal delay-4 grid-sidebar floating-sidebar">
              <WordCloud />
            </div>
          </div>

          <div class="panel-reveal delay-5 deep-shadow-panel">
            <MoodTrendChart
                :chartData="analyticsStore.trendData"
                :chartOptions="analyticsStore.trendOptions"
            />
          </div>

          <div class="panel-reveal delay-6 cta-offset">
            <ExportBanner />
          </div>
        </div>
      </template>
    </div>
  </Layout>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAnalyticsStore } from '@/analytics/application/analytics.store'
import Layout from '@/shared/presentation/components/layout.vue'

import WeeklySummary from '../components/weekly-summary.vue'
import KpiCards from '../components/kpi-cards.vue'
import MoodFluctuationChart from '../components/mood-fluctuation-chart.vue'
import WordCloud from '../components/word-cloud.vue'
import MoodTrendChart from '../components/mood-trend-chart.vue'
import ExportBanner from '../components/export-banner.vue'

const analyticsStore = useAnalyticsStore()

onMounted(() => {
  analyticsStore.fetchDashboardData()
})
</script>

<style scoped>
.high-end-analytics-page {
  --bg-color: #f8fafc;
  --text-dark: #0f172a;
  --text-muted: #64748b;
  --global-blue: #3b82f6;
  --global-green: #34d399;

  background-color: var(--bg-color);
  color: var(--text-dark);
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 80px 48px;
  min-height: 100vh;
  overflow-x: hidden;
  z-index: 1;
}

.optical-grid-bg {
  position: fixed;
  top: 0; left: 0; width: 100vw; height: 100vh;
  pointer-events: none;
  z-index: -1;
  background-image: radial-gradient(circle at center, rgba(15, 23, 42, 0.03) 1px, transparent 1px);
  background-size: 32px 32px;
  opacity: 0.8;
}

.hero-header { margin-bottom: 56px; display: flex; justify-content: space-between; align-items: flex-end; position: relative; padding-left: 24px; }
.hero-header::before { content: ''; position: absolute; left: 0; top: 10%; height: 80%; width: 3px; background: var(--global-blue); border-radius: 4px; }
.header-content { display: flex; flex-direction: column; gap: 16px; }

.gradient-title {
  font-size: 52px; font-weight: 700; letter-spacing: -0.02em; margin: 0;
  background: linear-gradient(120deg, var(--text-dark) 40%, var(--global-blue) 70%, var(--text-dark) 100%);
  background-size: 200% auto; color: transparent; -webkit-background-clip: text; background-clip: text;
  animation: shine 6s linear infinite;
}
@keyframes shine { to { background-position: 200% center; } }

.iot-telemetry-badge {
  display: inline-flex; align-items: center; gap: 12px; background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(8px); border: 1px solid rgba(15, 23, 42, 0.05); border-radius: 50px;
  padding: 8px 16px; box-shadow: 0 4px 12px rgba(15, 23, 42, 0.02); align-self: flex-start;
}
.telemetry-led {
  width: 8px; height: 8px; border-radius: 50%; background-color: var(--global-green);
  box-shadow: 0 0 12px rgba(52, 211, 153, 0.8); animation: dataPulse 2s infinite cubic-bezier(0.4, 0, 0.2, 1);
}
@keyframes dataPulse { 0% { transform: scale(0.95); opacity: 0.8; } 50% { transform: scale(1.2); opacity: 1; } 100% { transform: scale(0.95); opacity: 0.8; } }

.typewriter-text { font-size: 11px; color: var(--text-muted); letter-spacing: 0.15em; font-weight: 600; }

.asymmetric-content-wrapper { display: flex; flex-direction: column; gap: 56px; max-width: 1400px; margin: 0 auto; width: 100%; }
.w-summary-offset { transform: translateX(12px); }
.cta-offset { transform: translateX(-12px); }

.asymmetric-grid { display: grid; grid-template-columns: minmax(auto, 65%) 1fr; gap: 48px; align-items: center; }

.deep-shadow-panel {
  background: rgba(255, 255, 255, 0.4); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.8);
  border-radius: 24px; box-shadow: 0 20px 40px -10px rgba(15, 23, 42, 0.05), 0 0 0 1px rgba(15, 23, 42, 0.02) inset;
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}
.deep-shadow-panel:hover {
  transform: translateY(-8px) scale(1.01);
  box-shadow: 0 30px 60px -15px rgba(15, 23, 42, 0.08), 0 0 0 1px rgba(15, 23, 42, 0.03) inset;
}
.floating-sidebar { position: relative; top: -24px; }

.premium-loading-state { display: flex; flex-direction: column; justify-content: center; align-items: center; height: 50vh; gap: 24px; }
.organic-spinner { width: 50px; height: 50px; animation: rotate 2s linear infinite; }
.organic-spinner .path { stroke: var(--global-blue); stroke-linecap: round; animation: dash 1.5s ease-in-out infinite; }
@keyframes rotate { 100% { transform: rotate(360deg); } }
@keyframes dash { 0% { stroke-dasharray: 1, 150; stroke-dashoffset: 0; } 50% { stroke-dasharray: 90, 150; stroke-dashoffset: -35; } 100% { stroke-dasharray: 90, 150; stroke-dashoffset: -124; } }

.loading-narrative { font-size: 18px; color: var(--text-muted); font-style: italic; opacity: 0.8; animation: breathePulse 2s infinite ease-in-out; }
@keyframes breathePulse { 0%, 100% { opacity: 0.6; } 50% { opacity: 1; } }

@keyframes fluidAscent { 0% { opacity: 0; transform: translateY(40px) scale(0.98); } 100% { opacity: 1; transform: translateY(0) scale(1); } }
.hero-reveal { opacity: 0; animation: fluidAscent 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
.panel-reveal { opacity: 0; animation: fluidAscent 1.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
.delay-1 { animation-delay: 150ms; } .delay-2 { animation-delay: 300ms; } .delay-3 { animation-delay: 450ms; } .delay-4 { animation-delay: 600ms; } .delay-5 { animation-delay: 750ms; } .delay-6 { animation-delay: 900ms; }

/* === RESPONSIVE MEDIA QUERIES === */
@media (max-width: 1024px) {
  .high-end-analytics-page { padding: 40px 24px; }
  .asymmetric-grid { grid-template-columns: 1fr; gap: 32px; }
  .floating-sidebar { top: 0; }
  .w-summary-offset, .cta-offset { transform: none; }
  .gradient-title { font-size: 40px; }
}

@media (max-width: 768px) {
  .high-end-analytics-page { padding: 32px 16px; }
  .hero-header { padding-left: 16px; margin-bottom: 32px; }
  .gradient-title { font-size: 32px; }
  .asymmetric-content-wrapper { gap: 32px; }
  .deep-shadow-panel:hover { transform: none; } /* Desactivar hover en mobile */
}
</style>