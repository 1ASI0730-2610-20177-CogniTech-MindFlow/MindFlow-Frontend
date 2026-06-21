import { defineStore } from 'pinia'
import { Habit, HabitFrequency, HabitStatus } from '../domain/model/habit.entity.js'
import { HabitCompletionLog, buildWeeklySummaries } from '../domain/model/habit-history.entity.js'
import { HabitsAPI } from '../infrastructure/habits-api.js'
import { HabitsHistoryAPI } from '../infrastructure/habits-history-api.js'
import { WellnessAPI } from '../infrastructure/wellness-api.js'
import { SuggestionsAPI } from '../infrastructure/suggestions-api.js'
import { useSettingsStore } from '@/settings/application/settings.store.js'

function todayISO() {
    const d = new Date()
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function extractHabitSequence(id) {
    if (typeof id === 'number' && Number.isFinite(id)) {
        return id
    }

    const match = String(id ?? '').match(/(\d+)$/)
    return match ? Number.parseInt(match[1], 10) : 0
}

function buildHabitId(sequence) {
    return `h${sequence}`
}

function resolveCurrentUserId() {
    const settingsStore = useSettingsStore()
    return settingsStore.currentUserId || null
}

export const useHabitsStore = defineStore('habits', {
    state: () => ({
        habits: [],
        completionHistory: [],
        activeTab: 'routines',
        searchQuery: '',
        statusFilter: 'all',
        aiStressDetected: false,
        stressAdvice: '',
        stressPausedHabits: [],
        stressLevel: null,
        stressScore: 0,
        aiSuggestions: [],
        suggestionsLoaded: false,
        nextId: 1
    }),

    getters: {
        filteredHabits(state) {
            return state.habits.filter((habit) => {
                const matchesSearch = habit.name
                    .toLowerCase()
                    .includes(state.searchQuery.toLowerCase().trim())

                const matchesStatus =
                    state.statusFilter === 'all' || habit.status === state.statusFilter

                return matchesSearch && matchesStatus
            })
        },

        dailyProgress(state) {
            const active = state.habits.filter((h) => h.status !== HabitStatus.PAUSED_BY_AI)
            const completed = active.filter((h) => h.status === HabitStatus.COMPLETED)
            const total = active.length
            const percent = total ? Math.round((completed.length / total) * 100) : 0

            return {
                percent,
                completed: completed.length,
                total
            }
        },

        weeklyHistory(state) {
            return buildWeeklySummaries(state.completionHistory)
        },

        showAiAlert(state) {
            return (
                state.aiStressDetected &&
                state.habits.some((h) => h.status === HabitStatus.PAUSED_BY_AI)
            )
        }
    },

    actions: {
        async loadHabits() {
            const currentUserId = resolveCurrentUserId()
            const data = currentUserId ? await HabitsAPI.getByUserId(currentUserId) : await HabitsAPI.getAll()

            this.habits = data.map((item) => Habit.fromJSON(item))
            this.nextId = this.habits.reduce((max, habit) => Math.max(max, extractHabitSequence(habit.id)), 0) + 1

            const history = await HabitsHistoryAPI.getAll()
            const habitById = new Map(this.habits.map((habit) => [String(habit.id), habit]))

            this.completionHistory = history
                .filter((item) => !currentUserId || habitById.has(String(item.habitId)))
                .map((item) => {
                    const habit = habitById.get(String(item.habitId))
                    return new HabitCompletionLog({
                        ...item,
                        habitName: item.habitName || habit?.name,
                        category: item.category || habit?.category
                    })
                })

            const today = todayISO()
            const completedToday = new Set(
                this.completionHistory
                    .filter(log => log.date === today && log.completed)
                    .map(log => String(log.habitId))
            )

            for (const habit of this.habits) {
                if (habit.isPaused()) continue
                if (habit.frequency === HabitFrequency.DAILY) {
                    if (completedToday.has(String(habit.id))) {
                        habit.status = HabitStatus.COMPLETED
                    } else {
                        habit.status = HabitStatus.PENDING
                        habit.currentStreak = 0
                        habit.streak = 0
                    }
                }
            }
        },

        async persistHabit(habit) {
            const stored = await HabitsAPI.update(habit.id, habit)
            const index = this.habits.findIndex((item) => item.id === habit.id)
            if (index >= 0) {
                this.habits[index] = stored
            }
            return stored
        },

        setActiveTab(tab) {
            this.activeTab = tab
        },

        setSearchQuery(query) {
            this.searchQuery = query
        },

        setStatusFilter(filter) {
            this.statusFilter = filter
        },

        async recordCompletion(habit, completed) {
            const date = todayISO()
            const existing = this.completionHistory.findIndex(
                (log) => String(log.habitId) === String(habit.id) && log.date === date
            )

            const entry = new HabitCompletionLog({
                habitId: habit.id,
                habitName: habit.name,
                category: habit.category,
                date,
                completed
            })

            if (existing >= 0) {
                const updated = await HabitsHistoryAPI.update(
                    this.completionHistory[existing].id,
                    entry
                )
                this.completionHistory = [
                    ...this.completionHistory.slice(0, existing),
                    updated,
                    ...this.completionHistory.slice(existing + 1)
                ]
            } else {
                const stored = await HabitsHistoryAPI.create(entry)
                this.completionHistory = [...this.completionHistory, stored]
            }
        },

        async createHabit({ name, frequency, category }) {
            const trimmed = name.trim()
            if (!trimmed || !category) return

            const habit = new Habit({
                id: buildHabitId(this.nextId++),
                userId: resolveCurrentUserId(),
                name: trimmed,
                category,
                frequency: frequency || HabitFrequency.DAILY,
                currentStreak: 0,
                status: HabitStatus.PENDING,
                pausedByAi: false,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                deletedAt: null
            })

            const stored = await HabitsAPI.create(habit)
            this.habits.unshift(stored)
        },

        async toggleHabit(id) {
            const habit = this.habits.find((h) => h.id === id)
            if (!habit?.canToggle()) return

            habit.toggle()
            habit.updatedAt = new Date().toISOString()

            if (habit.isCompleted()) {
                habit.currentStreak = (habit.currentStreak || 0) + 1
                habit.streak = habit.currentStreak
            } else {
                habit.currentStreak = Math.max(0, (habit.currentStreak || 0) - 1)
                habit.streak = habit.currentStreak
            }

            await this.recordCompletion(habit, habit.isCompleted())
            HabitsAPI.update(habit.id, habit).catch((e) => console.error('Error syncing habit:', e))
        },

        async checkStress() {
            try {
                const result = await WellnessAPI.stressCheck()
                const level = result.stress_level || result.stressLevel
                this.stressAdvice = result.advice || ''
                this.stressPausedHabits = result.paused_habits || result.pausedHabits || []
                this.stressLevel = level
                this.stressScore = result.score || 0

                if (level === 'high') {
                    this.aiStressDetected = true
                    this.stressPausedHabits.forEach((name) => {
                        const habit = this.habits.find(h => h.name === name)
                        if (habit) {
                            habit.status = HabitStatus.PAUSED_BY_AI
                            habit.pausedByAi = true
                        }
                    })
                } else {
                    this.aiStressDetected = false
                }
                return result
            } catch (error) {
                console.error('Error checking stress:', error)
                return null
            }
        },

        async loadSuggestions() {
            try {
                const data = await SuggestionsAPI.getSuggestions()
                this.aiSuggestions = data.suggestions || data || []
                this.suggestionsLoaded = true
            } catch (error) {
                console.error('Error loading suggestions:', error)
                this.aiSuggestions = []
                this.suggestionsLoaded = true
            }
        },

        async adoptSuggestion(suggestion) {
            await this.createHabit({
                name: suggestion.name,
                category: suggestion.category,
                frequency: suggestion.frequency
            })
            this.aiSuggestions = this.aiSuggestions.filter(s => s.name !== suggestion.name)
        }
    }
})
