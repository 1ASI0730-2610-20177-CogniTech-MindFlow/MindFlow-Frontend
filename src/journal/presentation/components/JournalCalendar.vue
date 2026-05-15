<template>

  <div class="calendar">

    <div class="calendar-header">

      <h3>
        {{ currentMonthName }} {{ currentYear }}
      </h3>

      <span @click="previousMonth">
        {{ $t('journal.calendar.previousMonth') }}
      </span>

    </div>

    <div class="weekdays">

      <div v-for="(day, index) in localizedWeekdays" :key="index">
        {{ day }}
      </div>

    </div>

    <div class="days-grid">

      <div
          v-for="day in days"
          :key="day.number"
          class="day"
          :class="[
          day.mood,
          { selected: selectedDay === day.number }
        ]"
          @click="updateDayMood(day)"
      >
        {{ day.number }}
      </div>

    </div>

    <div class="legend">

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

const { t, tm } = useI18n()

const currentMonth = ref(3)
const currentYear = ref(2026)

const selectedDay = ref(26)

const localizedWeekdays = computed(() => {
  const wd = tm('journal.calendar.weekdays')
  // tm returns the array proxy if defined in locales.
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

const updateDayMood = (day) => {

  if (props.selectedMood === 'Positivo') {
    day.mood = 'positive'
  }

  if (props.selectedMood === 'Neutral') {
    day.mood = 'neutral'
  }

  if (props.selectedMood === 'Negativo') {
    day.mood = 'negative'
  }

  selectedDay.value = day.number
}

const moods = [
  'positive',
  'neutral',
  'negative'
]

const props = defineProps({
  selectedMood: String
})



const days = ref(

    Array.from({ length: 30 }, (_, i) => {

      const dayNumber = i + 1

      return {

        number: dayNumber,


        mood:
            dayNumber <= 26
                ? moods[Math.floor(Math.random() * moods.length)]
                : ''

      }

    })

)

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

.calendar-header h3 {
  font-size: 18px;
  font-weight: 700;
  color: #2b2b2b;
}

.calendar-header span {
  font-size: 13px;
  color: #5b8def;
  font-weight: 500;
  cursor: pointer;
}



.weekdays {
  display: grid;
  grid-template-columns: repeat(7,1fr);

  text-align: center;

  font-size: 12px;

  color: #9ca3af;

  font-weight: 600;
}

/* GRID */

.days-grid {
  display: grid;

  grid-template-columns: repeat(7,1fr);

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
  background: #ffffff;

  border: 1px solid #edf0f5;
}
.day.positive {
  background: #6fcf97;
  border-color: #6fcf97;
}

.day.neutral {
  background: #f2c94c;
  border-color: #f2c94c;
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
  background: #f9fafb;
}

.selected {
  border: 2px solid #111827;
}

/* LEGEND */

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
  color: #6b7280;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
}

</style>