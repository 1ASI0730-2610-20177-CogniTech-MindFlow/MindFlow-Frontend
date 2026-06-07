<template>
  <div class="dashboard-card theme-transition">
    <div class="header-row">
      <h3 class="card-title">{{ t('dashboard.recentEntries.title') }}</h3>
      <router-link to="/analytics" class="view-all">
        {{ t('dashboard.recentEntries.viewAll') }}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
      </router-link>
    </div>

    <div class="entries-list">
      <div v-for="entry in dashboardStore.recentEntries" :key="entry.id" class="entry-item">
        <div class="entry-header">
          <span class="entry-time">{{ entry.time }}</span>
          <span class="entry-tag">{{ entry.tag }}</span>
        </div>
        <p class="entry-text">{{ entry.text }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { useDashboardStore } from '@/dashboard/application/dashboard.store'

const { t } = useI18n()
const dashboardStore = useDashboardStore()
</script>

<style scoped>
.header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.view-all {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--accent-primary);
  text-decoration: none;
  font-weight: 500;
  padding: 6px 12px;
  border-radius: 8px;
  transition: background 0.2s;
}

.view-all:hover {
  background: rgba(99, 102, 241, 0.08);
}

.view-all svg {
  transition: transform 0.3s ease;
}

.view-all:hover svg {
  transform: translateX(4px);
}

.entries-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.entry-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 14px 16px;
  border-radius: 14px;
  background: var(--bg-surface-secondary);
  border: 1px solid var(--border-color);
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
  overflow: hidden;
}

.entry-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  border-radius: 14px 0 0 14px;
  background: var(--accent-primary);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.entry-item:active {
  transform: translateX(2px) scale(0.99);
}

.entry-item:hover {
  transform: translateX(4px);
  border-color: transparent;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.06);
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.04), transparent);
}

.entry-item:hover::before {
  opacity: 1;
}

.entry-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.entry-time {
  font-size: 11px;
  color: var(--text-muted);
  font-weight: 500;
}

.entry-tag {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(99, 102, 241, 0.03));
  color: var(--accent-primary);
  font-size: 11px;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 8px;
  border: 1px solid rgba(99, 102, 241, 0.12);
  letter-spacing: 0.02em;
  transition: all 0.3s ease;
}

.entry-item:hover .entry-tag {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.12), rgba(99, 102, 241, 0.05));
  border-color: rgba(99, 102, 241, 0.25);
}

.entry-text {
  margin: 0;
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.entry-item:hover .entry-text {
  color: var(--text-primary);
}
</style>