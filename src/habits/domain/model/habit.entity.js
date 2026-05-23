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

const FREQUENCY_FROM_DB = {
    daily: HabitFrequency.DAILY,
    weekly: HabitFrequency.WEEKLY,
    monthly: HabitFrequency.MONTHLY
}

const FREQUENCY_TO_DB = {
    [HabitFrequency.DAILY]: 'daily',
    [HabitFrequency.WEEKLY]: 'weekly',
    [HabitFrequency.MONTHLY]: 'monthly'
}

export const HABIT_CATEGORY_OPTIONS = [
    'Salud Física',
    'Bienestar',
    'Sueño',
    'Salud Mental',
    'Estudios'
]

export const HABIT_CATEGORIES = {
    'Salud Física': {
        bg: 'var(--habit-cat-salud-fisica-bg)',
        color: 'var(--habit-cat-salud-fisica-color)'
    },
    Bienestar: {
        bg: 'var(--habit-cat-bienestar-bg)',
        color: 'var(--habit-cat-bienestar-color)'
    },
    Sueño: {
        bg: 'var(--habit-cat-sueno-bg)',
        color: 'var(--habit-cat-sueno-color)'
    },
    'Salud Mental': {
        bg: 'var(--habit-cat-salud-mental-bg)',
        color: 'var(--habit-cat-salud-mental-color)'
    },
    Estudios: {
        bg: 'var(--habit-cat-estudios-bg)',
        color: 'var(--habit-cat-estudios-color)'
    }
}

export class Habit {
    constructor({
        id,
        userId = null,
        name,
        category,
        frequency,
        currentStreak,
        status,
        pausedByAi = false,
        createdAt = null,
        updatedAt = null,
        deletedAt = null,
        streak = null
    }) {
        this.id = id
        this.userId = userId
        this.name = name
        this.category = category
        this.frequency = FREQUENCY_FROM_DB[frequency] || frequency || HabitFrequency.DAILY
        this.currentStreak = currentStreak ?? streak ?? 0
        this.status = status
        this.pausedByAi = pausedByAi
        this.createdAt = createdAt
        this.updatedAt = updatedAt
        this.deletedAt = deletedAt
        this.streak = this.currentStreak
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
            user_id: this.userId,
            name: this.name,
            category: this.category,
            frequency: FREQUENCY_TO_DB[this.frequency] || this.frequency,
            streak: this.currentStreak,
            status: this.status,
            pausedByAi: this.pausedByAi,
            created_at: this.createdAt,
            updated_at: this.updatedAt,
            deleted_at: this.deletedAt
        }
    }

    static fromJSON(data) {
        return new Habit({
            id: data.id,
            userId: data.user_id ?? data.userId ?? null,
            name: data.name,
            category: data.category,
            frequency: data.frequency,
            currentStreak: data.currentStreak,
            status: data.status,
            pausedByAi: data.pausedByAi ?? data.paused_by_ai ?? false,
            createdAt: data.created_at ?? data.createdAt ?? null,
            updatedAt: data.updated_at ?? data.updatedAt ?? null,
            deletedAt: data.deleted_at ?? data.deletedAt ?? null,
            streak: data.streak
        })
    }
}
