<template>
  <div class="mood-calendar theme-transition">
    <div class="calendar-header">
      <h3>{{ $t('analytics.moodCalendar.title') }}</h3>
      <div class="month-nav">
        <button @click="prevMonth" class="nav-btn"><span>‹</span></button>
        <span class="month-label">{{ monthName }} {{ year }}</span>
        <button @click="nextMonth" class="nav-btn"><span>›</span></button>
      </div>
    </div>

    <div class="weekdays">
      <span v-for="d in weekdays" :key="d">{{ d }}</span>
    </div>

    <div class="days-grid">
      <div
        v-for="(day, i) in calendarDays"
        :key="i"
        class="day-cell"
        :class="{ empty: !day.date, today: day.isToday }"
        :style="day.color ? { background: day.color } : {}"
      >
        <span v-if="day.day" class="day-number" :class="{ 'has-color': day.color }">{{ day.day }}</span>
        <span v-if="day.entryCount" class="entry-dot">{{ day.entryCount }}</span>
      </div>
    </div>

    <div class="calendar-legend">
      <div class="legend-item"><span class="dot dot-positive"></span> {{ $t('analytics.moods.positive') }}</div>
      <div class="legend-item"><span class="dot dot-neutral"></span> {{ $t('analytics.moods.neutral') }}</div>
      <div class="legend-item"><span class="dot dot-negative"></span> {{ $t('analytics.moods.negative') }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { moodCalendarApi } from '@/analytics/infrastructure/mood-calendar.endpoint'

const { tm } = useI18n()

const now = new Date()
const year = ref(now.getFullYear())
const month = ref(now.getMonth() + 1)
const moodData = ref(null)

const weekdays = computed(() => {
  const wd = tm('journal.calendar.weekdays')
  return Array.isArray(wd) ? wd : ['L', 'M', 'X', 'J', 'V', 'S', 'D']
})

const monthNames = computed(() => {
  const m = tm('journal.calendar.months')
  return Array.isArray(m) ? m : ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']
})

const monthName = computed(() => monthNames.value[month.value - 1])

const calendarDays = computed(() => {
  const firstDay = new Date(year.value, month.value - 1, 1)
  const lastDay = new Date(year.value, month.value, 0)
  const startDow = firstDay.getDay()
  const daysInMonth = lastDay.getDate()
  const today = new Date()
  const todayStr = today.toISOString().slice(0, 10)

  const dayMap = {}
  if (moodData.value?.days) {
    moodData.value.days.forEach(d => { dayMap[d.date] = d })
  }

  const cells = []
  for (let i = 0; i < startDow; i++) cells.push({})

  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year.value}-${String(month.value).padStart(2,'0')}-${String(d).padStart(2,'0')}`
    const info = dayMap[dateStr]
    cells.push({
      day: d,
      date: dateStr,
      color: info?.color || null,
      entryCount: info?.entry_count || info?.entryCount || 0,
      isToday: dateStr === todayStr
    })
  }

  while (cells.length % 7 !== 0) cells.push({})
  return cells
})

async function loadData() {
  try {
    moodData.value = await moodCalendarApi.get(year.value, month.value)
  } catch {
    moodData.value = null
  }
}

function prevMonth() {
  month.value--
  if (month.value < 1) { month.value = 12; year.value-- }
}

function nextMonth() {
  month.value++
  if (month.value > 12) { month.value = 1; year.value++ }
}

watch([year, month], () => loadData(), { immediate: true })
</script>

<style scoped>
.mood-calendar {
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  padding: 24px;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
}

.calendar-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: var(--text-primary);
}

.month-nav {
  display: flex;
  align-items: center;
  gap: 8px;
}

.nav-btn {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  background: var(--bg-surface-secondary);
  color: var(--text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  transition: all 0.2s;
}

.nav-btn:hover {
  background: var(--accent-primary);
  color: #fff;
  border-color: var(--accent-primary);
}

.month-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
  min-width: 120px;
  text-align: center;
}

.weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  font-size: 11px;
  font-weight: 600;
  color: var(--text-muted);
  margin-bottom: 6px;
}

.days-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
}

.day-cell {
  aspect-ratio: 1;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: transform 0.2s;
}

.day-cell:not(.empty):hover {
  transform: scale(1.1);
}

.day-cell.today {
  box-shadow: inset 0 0 0 2px var(--accent-primary);
}

.day-number {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-primary);
}

.day-number.has-color {
  color: #fff;
}

.entry-dot {
  position: absolute;
  bottom: 2px;
  font-size: 8px;
  font-weight: 700;
  color: rgba(255,255,255,0.9);
  background: rgba(0,0,0,0.2);
  width: 14px;
  height: 14px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.calendar-legend {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 14px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: var(--text-muted);
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}
.dot-positive { background: var(--mood-positive); }
.dot-neutral { background: var(--mood-neutral); }
.dot-negative { background: var(--mood-negative);
}
</style>
