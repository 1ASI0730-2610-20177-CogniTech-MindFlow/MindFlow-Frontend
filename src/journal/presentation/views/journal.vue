<template>
  <Layout>
    <div class="journal-page theme-transition">
      <div class="page-header animate-fade-in-down">
        <h1 class="theme-transition">{{ $t('journal.title') }}</h1>
      </div>

      <div class="journal-grid">
        <div class="left-panel animate-fade-in-left delay-1">
          <div class="card hover-lift theme-transition">
            <JournalFilters />
            <JournalCalendar />
          </div>
        </div>

        <div class="right-panel">
          <JournalEntryCard
              v-for="(entry, index) in filteredEntries"
              :key="entry.id"
              :entry="entry"
              class="animate-fade-in-up"
              :style="{ animationDelay: `${0.2 + (index * 0.1)}s` }"
          />
          <div v-if="filteredEntries.length === 0" class="no-entries">
            {{ $t('journal.noEntries') }}
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import Layout from '../../../shared/presentation/components/layout.vue'
import JournalCalendar from '../components/JournalCalendar.vue'
import JournalFilters from '../components/JournalFilters.vue'
import JournalEntryCard from '../components/JournalEntryCard.vue'
import { computed, onMounted } from 'vue'
import { useJournalStore } from '@/journal/application/journal.store'

const journalStore = useJournalStore()

const filteredEntries = computed(() => journalStore.getFilteredEntries)

onMounted(async () => {
  await journalStore.fetchEntries()
})
</script>

<style scoped>
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeInDown {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeInLeft {
  from { opacity: 0; transform: translateX(-20px); }
  to { opacity: 1; transform: translateX(0); }
}

.animate-fade-in-up {
  animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  opacity: 0;
}

.animate-fade-in-down {
  animation: fadeInDown 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  opacity: 0;
}

.animate-fade-in-left {
  animation: fadeInLeft 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  opacity: 0;
}

.delay-1 { animation-delay: 0.15s; }

.hover-lift {
  transition: transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease, border-color 0.3s ease;
}
.hover-lift:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px -8px rgba(0,0,0,0.08), 0 4px 8px -4px rgba(0,0,0,0.04);
}

.journal-page {
  min-height: 100vh;
  background: var(--bg-primary);
  padding: 28px;
  font-family: Inter, sans-serif;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 26px;
}

.page-header h1 {
  font-size: 20px;
  font-weight: 700;
  color: var(--text-primary);
}

.search-box input {
  width: 300px;
  height: 44px;
  padding: 0 18px;
  border-radius: 999px;
  border: 1px solid var(--border-color);
  background: var(--bg-surface);
  color: var(--text-primary);
  font-size: 14px;
  outline: none;
  transition: .2s ease;
}

.search-box input:focus {
  border-color: var(--accent-primary);
  box-shadow:
      0 0 0 4px rgba(91,141,239,.12);
}

.journal-grid {
  display: grid;
  grid-template-columns: 365px 1fr;
  gap: 24px;
  align-items: start;
}

.card {
  background: var(--bg-surface);
  border-radius: 18px;
  padding: 24px;
  border: 1px solid var(--border-light);
  box-shadow:
      0 1px 2px var(--shadow-sm),
      0 8px 24px var(--shadow-lg);
}

.right-panel {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.no-entries {
  text-align: center;
  padding: 40px 20px;
  color: var(--text-secondary);
  font-size: 14px;
}
</style>