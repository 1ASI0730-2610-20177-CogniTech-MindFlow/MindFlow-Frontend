import { defineStore } from 'pinia'
import { dashboardApi } from '../infrastructure/dashboard.endpoint'
import { useAuthStore } from '@/iam/application/auth.store.js'
import { fetchDashboardAggregatedData } from './dashboard.service'

export const useDashboardStore = defineStore('dashboard', {
    state: () => ({
        isLoading: true,
        isAnalyzing: false,
        aiFeedback: null,
        aiRating: 0,
        ratingSubmitted: false,
        recentEntries: [],
        habits: [],
        weeklySummary: null,
    }),

    actions: {
        async fetchDashboardData() {
            this.isLoading = true;

            try {
                const authStore = useAuthStore();
                const userId = authStore.currentUserId;
                this.weeklySummary = data.weeklySummary;
                this.habits = data.habits;
                this.recentEntries = data.recentEntries;

            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                this.isLoading = false;
            }
        },

        async submitJournalEntry(text, tag) {
            this.isAnalyzing = true
            this.aiFeedback = null
            this.aiRating = 0
            this.ratingSubmitted = false

            try {
                const response = await dashboardApi.processJournalEntry(text, tag)
                this.recentEntries.unshift({ id: Date.now(), title: text, tags: tag ? [tag] : [], date: new Date().toISOString() })
                this.aiFeedback = response.aiFeedback
            } catch (error) {
                console.error("Error al procesar el registro con IA:", error)
                this.aiFeedback = "Error processing your journal entry. Please try again."
            } finally {
                this.isAnalyzing = false
            }
        },

        submitAiRating(rating) {
            this.aiRating = rating
            this.ratingSubmitted = true
            console.log(`AI feedback rated: ${rating}/5`)
        },

        toggleHabit(id) {
            const habit = this.habits.find(h => h.id === id)
            if (habit) {
                habit.completed = !habit.completed
                if (habit.completed) habit.streak++
                else habit.streak--
            }
        }
    }
})