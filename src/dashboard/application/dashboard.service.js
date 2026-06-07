import { analyticsApi } from '@/analytics/infrastructure/analytics.endpoint'
import { HabitsAPI } from '@/habits/infrastructure/habits-api'
import { JournalAPI } from '@/journal/infrastructure/journal-api'
import { JournalEntry, DailyHabit } from '@/dashboard/domain/model/dashboard.model'
import { extractArrayData } from '@/shared/infrastructure/helpers'

function toLocaleString(date) {
  return new Date(date).toLocaleString('es-ES', { weekday: 'long', hour: 'numeric', minute: 'numeric' })
}

function mapEntries(entriesData) {
  return entriesData.slice(0, 3).map(entry => new JournalEntry({
    id: entry.id,
    time: toLocaleString(entry.created_at || entry.date || Date.now()),
    text: entry.content || entry.text || '',
    tag: entry.category || entry.tag || 'General'
  }))
}

function mapHabits(allHabits) {
  const sorted = [...allHabits].sort((a, b) => {
    const statusA = a.status || (a.completed ? 'completed' : 'pending')
    const statusB = b.status || (b.completed ? 'completed' : 'pending')
    if (statusA === statusB) return (a.streak || 0) - (b.streak || 0)
    return statusA === 'pending' ? -1 : 1
  })
  return sorted.slice(0, 3).map(habit => new DailyHabit({
    id: habit.id,
    title: habit.name || habit.title || 'Hábito',
    completed: (habit.status === 'completed') || habit.completed === true,
    streak: habit.streak || 0
  }))
}

function mapWeeklySummary(analyticsData) {
  const record = analyticsData.find(a => a && a.trend_data)
  return record ? record.trend_data : null
}

export async function fetchDashboardAggregatedData(userId) {
  const [analyticsResponse, habitsResponse, entriesResponse] = await Promise.all([
    userId ? analyticsApi.getByUserId(userId) : analyticsApi.getAll(),
    userId ? HabitsAPI.getByUserId(userId) : HabitsAPI.getAll(),
    userId
      ? JournalAPI.search({ user_id: userId, _sort: 'date', _order: 'desc', _limit: 3 })
      : JournalAPI.search({ _sort: 'date', _order: 'desc', _limit: 3 })
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
