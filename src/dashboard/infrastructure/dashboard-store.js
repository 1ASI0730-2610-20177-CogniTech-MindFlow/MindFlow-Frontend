import { defineStore } from 'pinia'
import { dashboardApi } from './dashboard-api'

export const useDashboardStore = defineStore('dashboard', {
  state: () => ({
    currentMood: null,
    isMoodLoading: false,
    moodError: null,

    habitStreak: 0,
    isStreakLoading: false,
    streakError: null,

    todayHabits: [],
    isHabitsLoading: false,
    habitsError: null,

    weeklySummary: null,
    isSummaryLoading: false,
    summaryError: null,

    trendData: [],
    isTrendLoading: false,
    trendError: null
  }),

  actions: {
    async loadDashboardData() {
      await Promise.all([
        this.fetchMoodData(),
        this.fetchHabitStreak(),
        this.fetchTodayHabits(),
        this.fetchWeeklySummary(),
        this.fetchTrendData()
      ])
    },

    async fetchMoodData() {
      this.isMoodLoading = true
      this.moodError = null
      try {
        const data = await dashboardApi.getCurrentMood()
        this.currentMood = data
      } catch (error) {
        this.moodError = error.message
      } finally {
        this.isMoodLoading = false
      }
    },

    async fetchHabitStreak() {
      this.isStreakLoading = true
      this.streakError = null
      try {
        const data = await dashboardApi.getHabitStreak()
        this.habitStreak = data.streak
      } catch (error) {
        this.streakError = error.message
      } finally {
        this.isStreakLoading = false
      }
    },

    async fetchTodayHabits() {
      this.isHabitsLoading = true
      this.habitsError = null
      try {
        const data = await dashboardApi.getTodayHabits()
        this.todayHabits = data
      } catch (error) {
        this.habitsError = error.message
      } finally {
        this.isHabitsLoading = false
      }
    },

    async fetchWeeklySummary() {
      this.isSummaryLoading = true
      this.summaryError = null
      try {
        const data = await dashboardApi.getWeeklySummary()
        this.weeklySummary = data.summary
      } catch (error) {
        this.summaryError = error.message
      } finally {
        this.isSummaryLoading = false
      }
    },

    async fetchTrendData() {
      this.isTrendLoading = true
      this.trendError = null
      try {
        const data = await dashboardApi.getTrendData()
        this.trendData = data
      } catch (error) {
        this.trendError = error.message
      } finally {
        this.isTrendLoading = false
      }
    },

    async toggleHabitCompletion(habitId) {
      const habit = this.todayHabits.find(h => h.id === habitId)
      if (!habit) return

      const previousState = habit.completed
      habit.completed = !habit.completed

      try {
        await dashboardApi.toggleHabitCompletion(habitId, habit.completed)
        await this.fetchHabitStreak()
      } catch (error) {
        habit.completed = previousState
        this.habitsError = error.message
      }
    }
  }
})
