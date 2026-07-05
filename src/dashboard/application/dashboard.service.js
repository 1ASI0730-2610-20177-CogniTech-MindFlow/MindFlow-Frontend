import { analyticsApi } from '@/analytics/infrastructure/analytics.endpoint'
import { HabitsAPI } from '@/habits/infrastructure/habits-api'
import { JournalAPI } from '@/journal/infrastructure/journal-api'
import { JournalEntry, DailyHabit } from '@/dashboard/domain/model/dashboard.model'
import { extractArrayData } from '@/shared/infrastructure/helpers'
import i18n from '@/i18n'

const DATE_LOCALES = { es: 'es-ES', en: 'en-US' }

function toLocaleString(date) {
  const locale = DATE_LOCALES[i18n.global.locale.value] || 'es-ES'
  return new Date(date).toLocaleString(locale, { weekday: 'long', hour: 'numeric', minute: 'numeric' })
}

function mapEntries(entriesData) {
  return entriesData.slice(0, 5).map(entry => new JournalEntry({
    id: entry.id,
    time: toLocaleString(entry.created_at || entry.date || Date.now()),
    text: entry.content || entry.text || '',
    tag: entry.category || entry.tag || 'General',
    aiResponse: entry.ai_response || entry.aiResponse || null
  }))
}

function mapHabits(allHabits) {
  const sorted = [...allHabits].sort((a, b) => {
    const statusA = (a.status || '').toLowerCase()
    const statusB = (b.status || '').toLowerCase()
    if (statusA === statusB) return (a.streak || 0) - (b.streak || 0)
    return statusA === 'pending' ? -1 : 1
  })
  return sorted.slice(0, 3).map(habit => new DailyHabit({
    id: habit.id,
    title: habit.name || habit.title || i18n.global.t('dashboard.dailyHabits.fallbackName'),
    completed: (habit.status || '').toLowerCase() === 'completed' || habit.completed === true,
    streak: habit.streak || 0
  }))
}

function mapWeeklySummary(analyticsData) {
  const record = analyticsData.find(a => a && a.fluctuation_data)
  if (!record) return null
  const data = record.fluctuation_data
  if (typeof data === 'string') {
    try { return JSON.parse(data) } catch { return null }
  }
  return data
}

export async function fetchDashboardAggregatedData(userId) {
  const [analyticsResponse, habitsResponse, entriesResponse] = await Promise.all([
    analyticsApi.getAll(),
    userId ? HabitsAPI.getByUserId(userId) : HabitsAPI.getAll(),
    JournalAPI.getAll({ _sort: 'date', _order: 'desc', _limit: 3 })
  ])

  const analyticsData = extractArrayData(analyticsResponse, 'analyticsCache')
  const allHabits = extractArrayData(habitsResponse, 'habits')
  const entriesData = extractArrayData(entriesResponse, 'journalEntries')

  return {
    weeklySummary: mapWeeklySummary(analyticsData),
    habits: mapHabits(allHabits),
    recentEntries: mapEntries(entriesData)
  }
}
