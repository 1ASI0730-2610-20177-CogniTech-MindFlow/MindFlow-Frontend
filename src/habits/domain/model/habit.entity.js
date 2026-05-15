export const HabitStatus = {
    PENDING: 'pending',
    COMPLETED: 'completed',
    PAUSED_BY_AI: 'paused_by_ai'
}

export const HabitFrequency = {
    DAILY: 'diario',
    WEEKLY: 'semanal',
    MONTHLY: 'mensual'
}

export const HABIT_CATEGORY_OPTIONS = [
    'Salud Física',
    'Bienestar',
    'Sueño',
    'Salud Mental',
    'Estudios'
]

export const HABIT_CATEGORIES = {
    'Salud Física': { bg: '#dbeafe', color: '#1d4ed8' },
    Bienestar: { bg: '#fef3c7', color: '#b45309' },
    Sueño: { bg: '#e0e7ff', color: '#4338ca' },
    'Salud Mental': { bg: '#fce7f3', color: '#be185d' },
    Estudios: { bg: '#ede9fe', color: '#6d28d9' }
}

export class Habit {
    constructor({ id, name, category, frequency, currentStreak, status, pausedByAi = false }) {
        this.id = id
        this.name = name
        this.category = category
        this.frequency = frequency
        this.currentStreak = currentStreak
        this.status = status
        this.pausedByAi = pausedByAi
    }

    isCompleted() {
        return this.status === HabitStatus.COMPLETED
    }

    isPaused() {
        return this.status === HabitStatus.PAUSED_BY_AI
    }

    canToggle() {
        return !this.isPaused()
    }

    toggle() {
        if (!this.canToggle()) return this
        this.status = this.isCompleted() ? HabitStatus.PENDING : HabitStatus.COMPLETED
        return this
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            category: this.category,
            frequency: this.frequency,
            currentStreak: this.currentStreak,
            status: this.status,
            pausedByAi: this.pausedByAi
        }
    }

    static fromJSON(data) {
        return new Habit(data)
    }
}
