const STORAGE_KEY = 'mindflow_habits'

export const DEFAULT_HABITS = [
    {
        id: 1,
        name: 'Beber 2L de agua',
        category: 'Salud Física',
        frequency: 'diario',
        currentStreak: 12,
        status: 'completed',
        pausedByAi: false
    },
    {
        id: 2,
        name: 'Pausa activa de 5 min',
        category: 'Bienestar',
        frequency: 'diario',
        currentStreak: 5,
        status: 'completed',
        pausedByAi: false
    },
    {
        id: 3,
        name: 'Desconexión digital (9PM)',
        category: 'Sueño',
        frequency: 'diario',
        currentStreak: 0,
        status: 'pending',
        pausedByAi: false
    },
    {
        id: 4,
        name: 'Meditar 10 minutos',
        category: 'Salud Mental',
        frequency: 'diario',
        currentStreak: 3,
        status: 'pending',
        pausedByAi: false
    },
    {
        id: 5,
        name: 'Estudiar Estadística (2h)',
        category: 'Estudios',
        frequency: 'diario',
        currentStreak: 0,
        status: 'paused_by_ai',
        pausedByAi: true
    }
]

export const HabitsAPI = {
    getAll() {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (!stored) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_HABITS))
            return [...DEFAULT_HABITS]
        }
        return JSON.parse(stored)
    },

    saveAll(habits) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(habits))
        return habits
    }
}
