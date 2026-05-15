<template>
  <div class="dashboard-card">
    <div class="header-row">
      <h3 class="card-title">Conversaciones Recientes</h3>
      <a href="#" class="view-all">Ver historial completo de conversaciones</a>
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
import { useDashboardStore } from '@/dashboard/application/dashboard.store'
const dashboardStore = useDashboardStore()
</script>

<style scoped>
.header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.view-all {
  font-size: 12px;
  color: #3b82f6;
  text-decoration: none;
  font-weight: 500;
}

.view-all:hover {
  text-decoration: underline;
}

.entries-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.entry-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-bottom: 24px;
  border-bottom: 1px solid #f1f5f9;
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
  color: #94a3b8;
}

.entry-tag {
  background: #eff6ff;
  color: #3b82f6;
  font-size: 11px;
  font-weight: 600;
  padding: 2px 10px;
  border-radius: 4px;
}

.entry-text {
  margin: 0;
  font-size: 14px;
  color: #475569;
  line-height: 1.5;
}
</style>