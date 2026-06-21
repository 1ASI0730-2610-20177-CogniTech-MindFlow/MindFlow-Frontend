<template>

  <div class="calendar theme-transition">

    <div class="calendar-header">

      <h3 class="theme-transition">
        {{ currentMonthName }} {{ currentYear }}
      </h3>

      <div class="month-actions">
        <button type="button" @click="previousMonth" class="month-action theme-transition" :aria-label="$t('journal.calendar.previousMonth')">
          <span class="nav-char">‹</span>
        </button>
        <button type="button" @click="nextMonth" class="month-action theme-transition" :aria-label="$t('journal.calendar.nextMonth')">
          <span class="nav-char">›</span>
        </button>
      </div>

    </div>

    <div class="weekdays theme-transition">

      <div v-for="(day, index) in localizedWeekdays" :key="index">
        {{ day }}
      </div>

    </div>

    <div class="days-grid">

      <div
          v-for="(day, index) in days"
          :key="index"
          class="day theme-transition"
          :class="[
          day.mood,
          { empty: !day.number }
        ]"
          :style="getDayStyle(day)"
          @click="selectDay(day)"
      >
        {{ day.number }}
      </div>

    </div>

    <div class="legend theme-transition">

      <div class="legend-item">
        <span class="dot positive"></span>
        {{ $t('journal.calendar.legend.positive') }}
      </div>

      <div class="legend-item">
        <span class="dot neutral"></span>
        {{ $t('journal.calendar.legend.neutral') }}
      </div>

      <div class="legend-item">
        <span class="dot negative"></span>
        {{ $t('journal.calendar.legend.negative') }}
      </div>

    </div>

  </div>

</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useJournalStore } from '@/journal/application/journal.store'

const { tm } = useI18n()
const journalStore = useJournalStore()

function getLatestEntryDate() {
  const entries = journalStore.entries
  if (!entries.length) return new Date()
  const sorted = [...entries].sort((a, b) => (b.date || '').localeCompare(a.date || ''))
  const [year, month] = (sorted[0].date || '').split('-').map(Number)
  if (year && month) return new Date(year, month - 1, 1)
  return new Date()
}

const initDate = getLatestEntryDate()
const currentMonth = ref(initDate.getMonth())
const currentYear = ref(initDate.getFullYear())

watch(() => journalStore.entries.length, () => {
  const d = getLatestEntryDate()
  currentMonth.value = d.getMonth()
  currentYear.value = d.getFullYear()
})
const selectedDate = computed({
  get: () => journalStore.selectedDate,
  set: (value) => journalStore.setSelectedDate(value)
})

const localizedWeekdays = computed(() => {
  const wd = tm('journal.calendar.weekdays')
  return Array.isArray(wd) ? wd : ['L', 'M', 'X', 'J', 'V', 'S', 'D']
})

const currentMonthName = computed(() => {
  const m = tm('journal.calendar.months')
  const months = Array.isArray(m) ? m : [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ]
  return months[currentMonth.value]
})

const previousMonth = () => {
  currentMonth.value--
  if (currentMonth.value < 0) {
    currentMonth.value = 11
    currentYear.value--
  }
}

const nextMonth = () => {
  currentMonth.value++
  if (currentMonth.value > 11) {
    currentMonth.value = 0
    currentYear.value++
  }
}

const calendarData = computed(() => {
  return journalStore.getCalendarData(currentYear.value, currentMonth.value + 1)
})

const sentimentMap = {
  'positive': 'positive',
  'neutral': 'neutral',
  'negative': 'negative'
}

const days = computed(() => {
  const firstDay = new Date(currentYear.value, currentMonth.value, 1)
  const lastDay = new Date(currentYear.value, currentMonth.value + 1, 0)
  const daysInMonth = lastDay.getDate()
  const startingDayOfWeek = firstDay.getDay()

  const daysArray = []

  for (let i = 0; i < startingDayOfWeek; i++) {
    daysArray.push({ number: null, mood: '' })
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = String(day).padStart(2, '0')
    const sentiment = calendarData.value[dateStr] || ''
    const moodClass = sentimentMap[sentiment] || ''
    const date = `${currentYear.value}-${String(currentMonth.value + 1).padStart(2, '0')}-${dateStr}`

    daysArray.push({
      number: day,
      mood: moodClass,
      sentiment: sentiment,
      date
    })
  }

  while (daysArray.length % 7 !== 0) {
    daysArray.push({ number: null, mood: '' })
  }

  return daysArray
})

const selectDay = (day) => {
  if (!day.number) return

  if (selectedDate.value === day.date) {
    selectedDate.value = ''
    return
  }

  selectedDate.value = day.date
}

const getDayStyle = (day) => {
  if (!day.number) {
    return {
      cursor: 'default',
      pointerEvents: 'none'
    }
  }

  if (selectedDate.value === day.date) {
    return {
      border: '2px solid var(--text-primary)'
    }
  }

  return {}
}


</script>

<style scoped>
.calendar {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.month-actions {
  display: flex;
  align-items: center;
  gap: 6px;
}

.calendar-header h3 {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
}

.month-action {
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  background: var(--bg-surface);
  color: var(--text-secondary);
  cursor: pointer;
  transition: background 0.2s, color 0.2s, border-color 0.2s, box-shadow 0.2s;
}
.month-action:hover {
  background: var(--accent-primary);
  color: #fff;
  border-color: var(--accent-primary);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
}
.month-action:active {
  transform: scale(0.92);
}

.nav-char {
  font-size: 18px;
  line-height: 1;
}

.weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 6px;
  text-align: center;
  font-size: 12px;
  color: var(--text-muted);
  font-weight: 600;
}

.days-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 6px;
}

.day {
  aspect-ratio: 1;
  width: 100%;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  background: var(--bg-surface);
  color: var(--text-primary);
  border: 1px solid var(--border-light);
  transition: transform 0.2s, box-shadow 0.2s, background 0.2s, border-color 0.2s;
}
.day:not(.empty):hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 10px rgba(0,0,0,0.06);
}

.day.positive {
  background: var(--mood-positive);
  border-color: var(--mood-positive);
  color: #fff;
}
.day.neutral {
  background: var(--mood-neutral);
  border-color: var(--mood-neutral);
  color: #111827;
}
.day.negative {
  background: var(--mood-negative);
  border-color: var(--mood-negative);
  color: #fff;
}

.dot.positive {
  background: var(--mood-positive);
}
.dot.neutral {
  background: var(--mood-neutral);
}
.dot.negative {
  background: var(--mood-negative);
}

.day.empty {
  visibility: hidden;
  pointer-events: none;
}

.legend {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 4px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--text-muted);
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
}
</style>