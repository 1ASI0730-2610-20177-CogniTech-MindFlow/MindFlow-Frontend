<template>

  <div class="calendar theme-transition">

    <div class="calendar-header">

      <h3 class="theme-transition">
        {{ currentMonthName }} {{ currentYear }}
      </h3>

      <div class="month-actions">
        <button type="button" @click="previousMonth" class="month-action theme-transition">
          {{ $t('journal.calendar.previousMonth') }}
        </button>
        <button type="button" @click="nextMonth" class="month-action theme-transition">
          {{ $t('journal.calendar.nextMonth') }}
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
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useJournalStore } from '@/journal/application/journal.store'

const { tm } = useI18n()
const journalStore = useJournalStore()

const currentMonth = ref(4) // Mayo (0-11)
const currentYear = ref(2024)
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
  gap: 8px;
}

.calendar-header h3 {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
}

.month-action {
  appearance: none;
  background: transparent;
  border: none;
  padding: 0;
  font-size: 12px;
  color: var(--accent-primary);
  font-weight: 500;
  cursor: pointer;
  opacity: 0.9;
}

.month-action:hover {
  opacity: 1;
  text-decoration: underline;
}



.weekdays {
  display: grid;
  grid-template-columns: repeat(7, 40px);
  gap: 8px;
  justify-content: center;

  text-align: center;

  font-size: 12px;

  color: var(--text-muted);

  font-weight: 600;
}

.days-grid {
  display: grid;
  grid-template-columns: repeat(7, 40px);
  justify-content: center;

  gap: 8px;
}



.day {
  width: 40px;
  height: 40px;

  border-radius: 10px;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 14px;
  font-weight: 600;

  cursor: pointer;

  transition: .2s ease;
}

.day {
  background: var(--bg-surface);
  color: var(--text-primary);

  border: 1px solid var(--border-light);
}
.day.positive {
  background: #6fcf97;
  border-color: #6fcf97;
  color: #fff;
}

.day.neutral {
  background: #f2c94c;
  border-color: #f2c94c;
  color: #111827;
}

.day.negative {
  background: #f58c8c;
  border-color: #f58c8c;
  color: white;
}


.dot.positive {
  background: #6fcf97;
}

.dot.neutral {
  background: #f2c94c;
}

.dot.negative {
  background: #f58c8c;
}
.day:not(.positive):not(.neutral):not(.negative):hover {
  background: var(--bg-surface-secondary);
}



.legend {
  display: flex;
  justify-content: center;
  gap: 18px;
  margin-top: 8px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;

  font-size: 12px;
  color: var(--text-secondary);
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
}

</style>