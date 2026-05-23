export class HabitCompletionLog {
    constructor({
        id = null,
        habitId,
        habitName,
        category,
        date,
        completed,
        completedAt = null,
        createdAt = null
    }) {
        this.id = id
        this.habitId = habitId
        this.habitName = habitName
        this.category = category
        this.date = date
        this.completed = completed
        this.completedAt = completedAt
        this.createdAt = createdAt
    }

    toJSON() {
        return {
            id: this.id,
            habit_id: this.habitId,
            habit_name: this.habitName,
            habitId: this.habitId,
            habitName: this.habitName,
            category: this.category,
            date: this.date,
            completed: this.completed,
            completed_at: this.completedAt,
            created_at: this.createdAt
        }
    }

    static fromJSON(data) {
        return new HabitCompletionLog({
            id: data.id,
            habitId: data.habit_id ?? data.habitId,
            habitName: data.habit_name ?? data.habitName,
            category: data.category,
            date: data.date,
            completed: data.completed,
            completedAt: data.completed_at ?? data.completedAt ?? null,
            createdAt: data.created_at ?? data.createdAt ?? null
        })
    }
}

export function getWeekStart(date) {
    const d = new Date(date)
    const day = d.getDay()
    const diff = d.getDate() - day + (day === 0 ? -6 : 1)
    d.setDate(diff)
    d.setHours(0, 0, 0, 0)
    return d
}

export function getWeekEnd(weekStart) {
    const end = new Date(weekStart)
    end.setDate(end.getDate() + 6)
    return end
}

export function formatWeekLabel(weekStart) {
    const weekEnd = getWeekEnd(weekStart)
    const opts = { day: 'numeric', month: 'short' }
    const start = weekStart.toLocaleDateString('es-ES', opts)
    const end = weekEnd.toLocaleDateString('es-ES', { ...opts, year: 'numeric' })
    return `Semana del ${start} – ${end}`
}

function maxStreakInWeek(datesCompleted) {
    if (!datesCompleted.length) return 0

    const sorted = [...datesCompleted].sort()
    let max = 1
    let current = 1

    for (let i = 1; i < sorted.length; i++) {
        const prev = new Date(sorted[i - 1])
        const curr = new Date(sorted[i])
        const diffDays = (curr - prev) / (1000 * 60 * 60 * 24)

        if (diffDays === 1) {
            current++
            max = Math.max(max, current)
        } else if (diffDays > 1) {
            current = 1
        }
    }

    return max
}

export function buildWeeklySummaries(logs) {
    const byWeek = {}

    for (const log of logs) {
        const weekStart = getWeekStart(new Date(log.date))
        const key = weekStart.toISOString().slice(0, 10)

        if (!byWeek[key]) {
            byWeek[key] = { weekStart, entries: [] }
        }

        byWeek[key].entries.push(log)
    }

    return Object.values(byWeek)
        .sort((a, b) => b.weekStart - a.weekStart)
        .map(({ weekStart, entries }) => {
            const habitStats = {}

            for (const entry of entries) {
                if (!habitStats[entry.habitId]) {
                    habitStats[entry.habitId] = {
                        habitId: entry.habitId,
                        habitName: entry.habitName,
                        category: entry.category,
                        completedDays: 0,
                        trackedDays: 0,
                        completedDates: []
                    }
                }

                const stat = habitStats[entry.habitId]
                const dayKey = entry.date

                if (!stat._days) stat._days = new Set()
                if (stat._days.has(dayKey)) continue

                stat._days.add(dayKey)
                stat.trackedDays++
                if (entry.completed) {
                    stat.completedDays++
                    stat.completedDates.push(dayKey)
                }
            }

            const habits = Object.values(habitStats).map((stat) => {
                const { _days, completedDates, ...rest } = stat
                return {
                    ...rest,
                    percent: stat.trackedDays
                        ? Math.round((stat.completedDays / stat.trackedDays) * 100)
                        : 0,
                    weekStreak: maxStreakInWeek(completedDates)
                }
            })

            const totalCompleted = habits.reduce((sum, h) => sum + h.completedDays, 0)
            const totalTracked = habits.reduce((sum, h) => sum + h.trackedDays, 0)

            return {
                weekStart,
                weekLabel: formatWeekLabel(weekStart),
                habits,
                overallPercent: totalTracked
                    ? Math.round((totalCompleted / totalTracked) * 100)
                    : 0,
                totalCompleted,
                totalTracked
            }
        })
}
