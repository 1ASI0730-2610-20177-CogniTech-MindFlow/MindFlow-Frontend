const HISTORY_KEY = 'mindflow_habits_history'

function dateStr(offsetDays = 0) {
    const d = new Date()
    d.setDate(d.getDate() + offsetDays)
    return d.toISOString().slice(0, 10)
}

function buildSeedHistory() {
    const logs = []
    const habits = [
        { id: 1, name: 'Beber 2L de agua', category: 'Salud Física' },
        { id: 2, name: 'Pausa activa de 5 min', category: 'Bienestar' },
        { id: 4, name: 'Meditar 10 minutos', category: 'Salud Mental' }
    ]

    const weeks = [
        { start: -21, pattern: [true, true, true, true, true, false, true] },
        { start: -14, pattern: [true, true, false, true, true, true, true] },
        { start: -7, pattern: [true, false, true, true, true, true, false] }
    ]

    for (const week of weeks) {
        for (const habit of habits) {
            week.pattern.forEach((completed, dayIndex) => {
                logs.push({
                    habitId: habit.id,
                    habitName: habit.name,
                    category: habit.category,
                    date: dateStr(week.start + dayIndex),
                    completed
                })
            })
        }
    }

    return logs
}

export const HabitsHistoryAPI = {
    getAll() {
        const stored = localStorage.getItem(HISTORY_KEY)
        if (!stored) {
            const seed = buildSeedHistory()
            localStorage.setItem(HISTORY_KEY, JSON.stringify(seed))
            return seed
        }
        return JSON.parse(stored)
    },

    saveAll(logs) {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(logs))
        return logs
    }
}
