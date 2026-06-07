<template>
  <div class="dashboard-card theme-transition">
    <div class="header-row">
      <h3 class="card-title">{{ t('dashboard.quickInterventions.title') }}</h3>
      <span class="live-badge">● {{ t('dashboard.quickInterventions.live') }}</span>
    </div>

    <div class="interventions-list">
      <button class="intervention-card" @click="startBreathing">
        <div class="intervention-icon breathing-icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2a10 10 0 1 0 10 10"/>
            <path d="M12 6a6 6 0 1 0 6 6"/>
            <path d="M12 10a2 2 0 1 0 2 2"/>
          </svg>
        </div>
        <div class="intervention-body">
          <span class="intervention-title">{{ t('dashboard.quickInterventions.breathing') }}</span>
          <span class="intervention-desc">{{ t('dashboard.quickInterventions.breathingDesc') }}</span>
        </div>
        <div class="intervention-meta">
          <span class="duration-badge">4-7-8</span>
          <svg class="arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
        </div>
      </button>

      <button class="intervention-card" @click="startMeditation">
        <div class="intervention-icon meditation-icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446A9 9 0 1 1 12 2.992z"/>
            <path d="M17 10a3 3 0 0 0-3-3"/>
            <path d="M7 10a3 3 0 0 1 3-3"/>
          </svg>
        </div>
        <div class="intervention-body">
          <span class="intervention-title">{{ t('dashboard.quickInterventions.microMeditation') }}</span>
          <span class="intervention-desc">{{ t('dashboard.quickInterventions.microMeditationDesc') }}</span>
        </div>
        <div class="intervention-meta">
          <span class="duration-badge">3 min</span>
          <svg class="arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
        </div>
      </button>

      <button class="intervention-card" @click="startGrounding">
        <div class="intervention-icon grounding-icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M2 12h20"/>
            <path d="M12 2v20"/>
            <path d="m4.93 4.93 14.14 14.14"/>
            <path d="m19.07 4.93-14.14 14.14"/>
          </svg>
        </div>
        <div class="intervention-body">
          <span class="intervention-title">{{ t('dashboard.quickInterventions.grounding') }}</span>
          <span class="intervention-desc">{{ t('dashboard.quickInterventions.groundingDesc') }}</span>
        </div>
        <div class="intervention-meta">
          <span class="duration-badge">5-4-3-2-1</span>
          <svg class="arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
        </div>
      </button>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

function startBreathing() {
  // TODO: implement 4-7-8 breathing exercise
}

function startMeditation() {
  // TODO: implement micro-meditation
}

function startGrounding() {
  // TODO: implement 5-4-3-2-1 grounding technique
}
</script>

<style scoped>
.header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.live-badge {
  font-size: 11px;
  font-weight: 600;
  color: var(--accent-success);
  letter-spacing: 0.03em;
  animation: pulse 2s infinite;
}

.interventions-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.intervention-card {
  display: flex;
  align-items: center;
  gap: 14px;
  width: 100%;
  padding: 14px 16px;
  border-radius: 14px;
  background: var(--bg-surface-secondary);
  border: 1px solid var(--border-color);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  text-align: left;
  font: inherit;
  position: relative;
  overflow: hidden;
}

.intervention-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  border-radius: 14px 0 0 14px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.intervention-card:hover {
  transform: translateX(4px);
  border-color: transparent;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.06);
}

.intervention-card:hover::before {
  opacity: 1;
}

.intervention-card:hover .arrow {
  opacity: 1;
  transform: translateX(0);
}

.intervention-card:active {
  transform: translateX(2px) scale(0.99);
}

.intervention-card:nth-child(1):hover {
  background: rgba(16, 185, 129, 0.04);
}

.intervention-card:nth-child(1)::before {
  background: var(--accent-success);
}

.intervention-card:nth-child(2):hover {
  background: rgba(99, 102, 241, 0.04);
}

.intervention-card:nth-child(2)::before {
  background: var(--accent-primary);
}

.intervention-card:nth-child(3):hover {
  background: rgba(245, 158, 11, 0.04);
}

.intervention-card:nth-child(3)::before {
  background: var(--accent-warning);
}

.intervention-icon {
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;
}

.intervention-card:hover .intervention-icon {
  transform: scale(1.05);
}

.breathing-icon {
  background: rgba(16, 185, 129, 0.1);
  color: var(--accent-success);
}

.meditation-icon {
  background: rgba(99, 102, 241, 0.1);
  color: var(--accent-primary);
}

.grounding-icon {
  background: rgba(245, 158, 11, 0.1);
  color: var(--accent-warning);
}

.intervention-body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.intervention-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

.intervention-desc {
  font-size: 12px;
  color: var(--text-muted);
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.intervention-meta {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.duration-badge {
  font-size: 11px;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 6px;
  background: var(--bg-surface);
  color: var(--text-secondary);
  letter-spacing: 0.02em;
}

.arrow {
  opacity: 0;
  transform: translateX(-4px);
  transition: all 0.3s ease;
  color: var(--text-muted);
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
</style>
