<template>
  <Layout>
    <div class="journal-page theme-transition">
      <div class="page-header animate-fade-in-down">
        <div>
          <h1 class="theme-transition">{{ $t('journal.title') }}</h1>
          <p class="subtitle theme-transition">{{ $t('journal.subtitle') }}</p>
        </div>

        <button type="button" class="new-entry-btn theme-transition" @click="openComposer">
          <i class="pi pi-plus"></i>
          {{ $t('journal.newEntry') }}
        </button>
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

      <JournalComposer
          :open="isComposerOpen"
          :initial-date="journalStore.selectedDate"
          :is-saving="isSaving"
          @close="closeComposer"
          @submit="handleCreateEntry"
      />
    </div>
  </Layout>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import Layout from '../../../shared/presentation/components/layout.vue'
import JournalCalendar from '../components/JournalCalendar.vue'
import JournalFilters from '../components/JournalFilters.vue'
import JournalEntryCard from '../components/JournalEntryCard.vue'
import JournalComposer from '../components/JournalComposer.vue'
import { useJournalStore } from '@/journal/application/journal.store'

const journalStore = useJournalStore()
const isComposerOpen = ref(false)
const isSaving = ref(false)

const filteredEntries = computed(() => journalStore.getFilteredEntries)

const openComposer = () => {
  isComposerOpen.value = true
}

const closeComposer = () => {
  if (isSaving.value) return
  isComposerOpen.value = false
}

const handleCreateEntry = async (entryData) => {
  isSaving.value = true

  try {
    await journalStore.addEntry({
      ...entryData,
      userId: 'u1'
    })
    isComposerOpen.value = false
  } finally {
    isSaving.value = false
  }
}

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
  gap: 16px;
}

.page-header h1 {
  font-size: 20px;
  font-weight: 700;
  color: var(--text-primary);
  padding-left: 14px;
  position: relative;
}
.page-header h1::before {
  content: '';
  position: absolute;
  left: 0;
  top: 4px;
  bottom: 4px;
  width: 3px;
  background: var(--accent-primary);
  border-radius: 3px;
}

.subtitle {
  margin: 6px 0 0 14px;
  color: var(--text-secondary);
  font-size: 14px;
}

.new-entry-btn {
  appearance: none;
  border: none;
  border-radius: 999px;
  padding: 12px 22px;
  background: linear-gradient(135deg, var(--accent-primary), var(--accent-hover));
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  box-shadow: 0 8px 20px rgba(99, 102, 241, 0.25);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.new-entry-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 28px rgba(99, 102, 241, 0.3);
}

.new-entry-btn:active {
  transform: translateY(0);
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
  box-shadow: var(--shadow-sm), var(--shadow-lg);
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

@media (max-width: 900px) {
  .journal-grid {
    grid-template-columns: 1fr;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .new-entry-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>