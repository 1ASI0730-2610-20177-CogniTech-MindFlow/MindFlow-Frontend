import { defineStore } from 'pinia'
import { Habit, HabitFrequency, HabitStatus } from '../domain/model/habit.entity.js'
import { HabitCompletionLog, buildWeeklySummaries } from '../domain/model/habit-history.entity.js'
import { HabitsAPI } from '../infrastructure/habits-api.js'
import { HabitsHistoryAPI } from '../infrastructure/habits-history-api.js'
import { useSettingsStore } from '@/settings/application/settings.store.js'

function todayISO() {
    return new Date().toISOString().slice(0, 10)
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
        aiStressDetected: true,
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
                this.completionHistory[existing] = await HabitsHistoryAPI.update(
                    this.completionHistory[existing].id,
                    entry
                )
            } else {
                const stored = await HabitsHistoryAPI.create(entry)
                this.completionHistory.push(stored)
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

            if (habit.isCompleted() && habit.currentStreak === 0) {
                habit.currentStreak = 1
            }

            habit.updatedAt = new Date().toISOString()

            await this.persistHabit(habit)
            await this.recordCompletion(habit, habit.isCompleted())
        }
    }
})
