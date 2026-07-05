<template>
  <section class="suggestions-panel theme-transition">
    <div class="suggestions-header">
      <div class="ai-badge">
        <i class="pi pi-sparkles"></i>
        <span>{{ $t('habits.suggestions.poweredBy') }}</span>
      </div>
      <p class="suggestions-subtitle">{{ $t('habits.suggestions.subtitle') }}</p>
    </div>

    <div v-if="store.stressAdvice" class="wellness-insight">
      <div class="insight-header">
        <i class="pi pi-heart"></i>
        <span>{{ $t('habits.suggestions.wellnessInsight') }}</span>
      </div>
      <p class="insight-text">{{ store.stressAdvice }}</p>
      <div class="insight-meta">
        <span class="stress-badge" :class="store.stressLevel">
          {{ $t('habits.suggestions.stress') }}: {{ store.stressLevel }}
        </span>
        <span class="score-badge">Score: {{ store.stressScore }}/100</span>
      </div>
    </div>

    <div v-if="store.aiSuggestions.length" class="suggestions-list">
      <div
        v-for="suggestion in store.aiSuggestions"
        :key="suggestion.name"
        class="suggestion-card"
      >
        <div class="suggestion-body">
          <div class="suggestion-top">
            <span class="suggestion-name">{{ suggestion.name }}</span>
            <span class="suggestion-freq">{{ suggestion.frequency }}</span>
          </div>
          <span class="suggestion-category">{{ suggestion.category }}</span>
          <p class="suggestion-reason">{{ suggestion.reason }}</p>
        </div>
        <button class="adopt-btn" @click="store.adoptSuggestion(suggestion)">
          <i class="pi pi-plus"></i>
          {{ $t('habits.suggestions.adopt') }}
        </button>
      </div>
    </div>

    <div v-else-if="store.suggestionsError" class="empty-suggestions">
      <i class="pi pi-exclamation-circle"></i>
      <p>{{ $t('habits.suggestions.loadError') }}</p>
      <button class="retry-btn" @click="store.loadSuggestions()">
        <i class="pi pi-refresh"></i>
        {{ $t('habits.suggestions.retry') }}
      </button>
    </div>

    <div v-else-if="store.suggestionsLoaded" class="empty-suggestions">
      <i class="pi pi-check-circle"></i>
      <p>{{ $t('habits.suggestions.allAdopted') }}</p>
    </div>
  </section>
</template>

<script setup>
import { onMounted } from 'vue'
import { useHabitsStore } from '@/habits/application/habits.store'

const store = useHabitsStore()

onMounted(() => {
  if (!store.suggestionsLoaded) {
    store.loadSuggestions()
  }
})
</script>

<style scoped>
.suggestions-panel {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.suggestions-header {
  text-align: center;
}

.ai-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 20px;
  background: rgba(99, 102, 241, 0.08);
  color: var(--accent-primary);
  font-size: 13px;
  font-weight: 700;
  margin-bottom: 8px;
}

.ai-badge i {
  font-size: 14px;
}

.suggestions-subtitle {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.5;
}

.wellness-insight {
  padding: 18px;
  border-radius: 14px;
  background: rgba(99, 102, 241, 0.04);
  border: 1px solid rgba(99, 102, 241, 0.1);
}

.insight-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 700;
  color: var(--accent-primary);
  margin-bottom: 8px;
}

.insight-text {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.6;
  margin: 0 0 12px;
}

.insight-meta {
  display: flex;
  gap: 8px;
}

.stress-badge,
.score-badge {
  font-size: 11px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 8px;
  background: var(--bg-surface-secondary);
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
}

.stress-badge.high {
  background: rgba(239, 68, 68, 0.08);
  color: var(--accent-danger);
  border-color: rgba(239, 68, 68, 0.2);
}

.stress-badge.medium {
  background: rgba(245, 158, 11, 0.08);
  color: var(--accent-warning);
  border-color: rgba(245, 158, 11, 0.2);
}

.stress-badge.low {
  background: rgba(16, 185, 129, 0.08);
  color: var(--accent-success);
  border-color: rgba(16, 185, 129, 0.2);
}

.suggestions-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.suggestion-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px;
  border-radius: 14px;
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.suggestion-card:hover {
  border-color: rgba(99, 102, 241, 0.2);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
}

.suggestion-body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.suggestion-top {
  display: flex;
  align-items: center;
  gap: 10px;
}

.suggestion-name {
  font-size: 14px;
  font-weight: 700;
  color: var(--text-primary);
}

.suggestion-freq {
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 6px;
  background: var(--bg-surface-secondary);
  color: var(--text-muted);
}

.suggestion-category {
  font-size: 12px;
  font-weight: 600;
  color: var(--accent-primary);
}

.suggestion-reason {
  font-size: 13px;
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.4;
}

.adopt-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 18px;
  border-radius: 10px;
  border: none;
  background: var(--accent-success);
  color: #fff;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.adopt-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.adopt-btn:active {
  transform: scale(0.97);
}

.empty-suggestions {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 32px;
  color: var(--accent-success);
}

.empty-suggestions i {
  font-size: 32px;
}

.empty-suggestions p {
  margin: 0;
  font-size: 14px;
  color: var(--text-secondary);
}

.empty-suggestions:has(.retry-btn) {
  color: var(--accent-warning);
}

.retry-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 4px;
  padding: 8px 16px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm, 8px);
  background: var(--bg-surface);
  color: var(--text-primary);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: border-color 0.2s ease, color 0.2s ease;
}

.retry-btn:hover {
  border-color: var(--accent-primary);
  color: var(--accent-primary);
}
</style>
