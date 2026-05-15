import { defineStore } from 'pinia'
import { Habit, HabitFrequency, HabitStatus } from '../domain/model/habit.entity.js'
import { HabitCompletionLog, buildWeeklySummaries } from '../domain/model/habit-history.entity.js'
import { HabitsAPI } from '../infrastructure/habits-api.js'
import { HabitsHistoryAPI } from '../infrastructure/habits-history-api.js'

function todayISO() {
    return new Date().toISOString().slice(0, 10)
}

export const useHabitsStore = defineStore('habits', {
    state: () => ({
        habits: [],
        completionHistory: [],
        activeTab: 'routines',
        searchQuery: '',
        statusFilter: 'all',
        aiStressDetected: true,
        nextId: 6
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
        loadHabits() {
            const data = HabitsAPI.getAll()
            this.habits = data.map((item) => Habit.fromJSON(item))
            const maxId = this.habits.reduce((max, h) => Math.max(max, h.id), 0)
            this.nextId = maxId + 1

            const history = HabitsHistoryAPI.getAll()
            this.completionHistory = history.map((item) => HabitCompletionLog.fromJSON(item))
        },

        persistHabits() {
            HabitsAPI.saveAll(this.habits.map((h) => h.toJSON()))
        },

        persistHistory() {
            HabitsHistoryAPI.saveAll(this.completionHistory.map((log) => log.toJSON()))
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

        recordCompletion(habit, completed) {
            const date = todayISO()
            const existing = this.completionHistory.findIndex(
                (log) => log.habitId === habit.id && log.date === date
            )

            const entry = new HabitCompletionLog({
                habitId: habit.id,
                habitName: habit.name,
                category: habit.category,
                date,
                completed
            })

            if (existing >= 0) {
                this.completionHistory[existing] = entry
            } else {
                this.completionHistory.push(entry)
            }

            this.persistHistory()
        },

        createHabit({ name, frequency, category }) {
            const trimmed = name.trim()
            if (!trimmed || !category) return

            const habit = new Habit({
                id: this.nextId++,
                name: trimmed,
                category,
                frequency: frequency || HabitFrequency.DAILY,
                currentStreak: 0,
                status: HabitStatus.PENDING,
                pausedByAi: false
            })

            this.habits.unshift(habit)
            this.persistHabits()
        },

        toggleHabit(id) {
            const habit = this.habits.find((h) => h.id === id)
            if (!habit?.canToggle()) return

            habit.toggle()

            if (habit.isCompleted() && habit.currentStreak === 0) {
                habit.currentStreak = 1
            }

            this.recordCompletion(habit, habit.isCompleted())
            this.persistHabits()
        }
    }
})
