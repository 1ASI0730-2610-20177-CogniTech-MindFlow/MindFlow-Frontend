<template>
  <div class="filters theme-transition">
    <div class="search-wrapper">
      <i class="pi pi-search search-icon"></i>
      <input
          v-model="search"
          class="search-input theme-transition"
          :placeholder="$t('journal.filters.searchPlaceholder')"
      />
    </div>

    <div class="tabs">
      <button
          class="tab theme-transition"
          :class="{ active: selectedTab === 'Todos' }"
          @click="selectedTab = 'Todos'"
      >
        {{ $t('journal.filters.tabs.all') }}
      </button>
      <button
          class="tab theme-transition"
          :class="{ active: selectedTab === 'Trabajo' }"
          @click="selectedTab = 'Trabajo'"
      >
        {{ $t('journal.filters.tabs.work') }}
      </button>
      <button
          class="tab theme-transition"
          :class="{ active: selectedTab === 'Estudios' }"
          @click="selectedTab = 'Estudios'"
      >
        {{ $t('journal.filters.tabs.studies') }}
      </button>
      <button
          class="tab theme-transition"
          :class="{ active: selectedTab === 'Familia' }"
          @click="selectedTab = 'Familia'"
      >
        {{ $t('journal.filters.tabs.family') }}
      </button>
    </div>

    <div class="bottom-filters">
      <select v-model="selectedState" class="select theme-transition">
        <option value="Todos">{{ $t('journal.filters.states.all') }}</option>
        <option value="Positivo">{{ $t('journal.filters.states.positive') }}</option>
        <option value="Neutral">{{ $t('journal.filters.states.neutral') }}</option>
        <option value="Negativo">{{ $t('journal.filters.states.negative') }}</option>
      </select>

      <input
          v-model="selectedDateModel"
          type="date"
          class="date-input theme-transition"
      />
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useJournalStore } from '@/journal/application/journal.store'

const journalStore = useJournalStore()

const selectedTab = ref('Todos')
const selectedState = ref('Todos')
const search = ref('')
const selectedDateModel = computed({
  get: () => journalStore.selectedDate,
  set: (value) => journalStore.setSelectedDate(value)
})

watch(selectedTab, (value) => {
  journalStore.setSelectedCategory(value)
})

watch(selectedState, (value) => {
  journalStore.setSelectedSentiment(value)
})


watch(search, (value) => {
  journalStore.setSearchQuery(value)
})
</script>

<style scoped>
.filters {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 28px;
}

.search-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 14px;
  font-size: 14px;
  color: var(--text-muted);
  pointer-events: none;
}

.search-input {
  width: 100%;
  height: 44px;
  padding: 0 16px 0 40px;
  border-radius: 10px;
  border: 1px solid var(--border-color);
  background: var(--bg-surface);
  color: var(--text-primary);
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}
.search-input:focus {
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.tabs {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.tab {
  height: 34px;
  padding: 0 14px;
  border-radius: 8px;
  border: 1px solid transparent;
  background: transparent;
  color: var(--text-muted);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s, color 0.2s, border-color 0.2s;
}

.tab:hover {
  background: var(--bg-surface-secondary);
  color: var(--text-secondary);
}

.tab.active {
  background: var(--bg-surface-secondary);
  border-color: var(--border-color);
  color: var(--text-primary);
  font-weight: 600;
}

.bottom-filters {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.select,
.date-input {
  height: 40px;
  border: 1px solid var(--border-color);
  border-radius: 10px;
  padding: 0 12px;
  font-size: 13px;
  color: var(--text-primary);
  background: var(--bg-surface-secondary);
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
}
.select:focus, .date-input:focus {
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}
</style>