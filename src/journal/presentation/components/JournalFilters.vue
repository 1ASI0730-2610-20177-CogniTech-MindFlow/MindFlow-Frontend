<template>
  <div class="filters">
    <input
        v-model="search"
        class="search-input theme-transition"
        :placeholder="$t('journal.filters.searchPlaceholder')"
    />

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
          v-model="selectedDate"
          type="date"
          class="date-input theme-transition"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const emit = defineEmits([
  'change-state'
])

const selectedTab = ref('Todos')
const selectedState = ref('Positivo')
const selectedDate = ref('')
const search = ref('')

watch(selectedState, (value) => {
  emit('change-state', value)
})

</script>

<style scoped>
.filters {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 28px;
}

.search-input {
  width: 100%;
  height: 44px;
  padding: 0 16px;
  border-radius: 10px;
  border: 1px solid var(--border-color);
  background: var(--bg-surface);
  color: var(--text-primary);
  font-size: 14px;
  outline: none;
}
.search-input:focus {
  border-color: var(--accent-primary);
}

.tabs {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tab {
  height: 36px;
  padding: 0 16px;
  border-radius: 999px;
  border: 1px solid var(--border-color);
  background: var(--bg-surface);
  color: var(--text-secondary);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
}

.tab:hover {
  background: var(--bg-surface-secondary);
}

.tab.active {
  background: var(--accent-primary);
  border-color: var(--accent-primary);
  color: white;
}

.bottom-filters {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.select,
.date-input {
  height: 42px;
  border: 1px solid var(--border-color);
  border-radius: 10px;
  padding: 0 14px;
  font-size: 14px;
  color: var(--text-secondary);
  background: var(--bg-surface);
  outline: none;
}
.select:focus, .date-input:focus {
  border-color: var(--accent-primary);
}
</style>