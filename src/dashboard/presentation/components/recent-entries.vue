<template>
  <div class="dashboard-card theme-transition">
    <div class="header-row">
      <h3 class="card-title">{{ t('dashboard.recentEntries.title') }}</h3>
      <a href="#" class="view-all">{{ t('dashboard.recentEntries.viewAll') }}</a>
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
  margin-bottom: 28px;
}

.view-all {
  font-size: 12px;
  color: var(--text-secondary);
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
}

.view-all::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, var(--accent-primary), var(--accent-hover));
  transition: width 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.view-all:hover {
  color: var(--accent-primary);
}

.view-all:hover::after {
  width: 100%;
}

.entries-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.entry-item {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--border-color);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  animation: slideInEntry 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes slideInEntry {
  from {
    opacity: 0;
    transform: translateX(-8px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.entry-item:hover {
  padding-left: 4px;
  transform: translateY(-2px);
}

.entry-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.entry-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.entry-time {
  font-size: 11px;
  color: var(--text-muted);
  transition: color 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  font-weight: 500;
}

.entry-item:hover .entry-time {
  color: var(--text-secondary);
}

.entry-tag {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.12), rgba(59, 130, 246, 0.06));
  color: #3b82f6;
  font-size: 11px;
  font-weight: 700;
  padding: 4px 12px;
  border-radius: 8px;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  border: 1px solid rgba(59, 130, 246, 0.15);
  letter-spacing: 0.02em;
}

.entry-item:hover .entry-tag {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(59, 130, 246, 0.1));
  border-color: rgba(59, 130, 246, 0.25);
  transform: translateY(-2px);
}

.entry-text {
  margin: 0;
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.6;
  transition: color 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.entry-item:hover .entry-text {
  color: var(--text-primary);
}
</style>