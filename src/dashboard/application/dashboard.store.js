import { defineStore } from 'pinia'
import { dashboardApi } from '../infrastructure/dashboard.endpoint'
import { useAuthStore } from '@/iam/application/auth.store.js'
import { fetchDashboardAggregatedData } from './dashboard.service'
import { AiFeedbackAPI } from '@/shared/infrastructure/ai-feedback-api'

export const useDashboardStore = defineStore('dashboard', {
    state: () => ({
        isLoading: true,
        isAnalyzing: false,
        aiFeedback: null,
        aiRating: 0,
        ratingSubmitted: false,
        conversations: [],
        savedConversation: null,
        recentEntries: [],
        habits: [],
        weeklySummary: null
    }),

    actions: {
        async fetchDashboardData() {
            this.isLoading = true

            try {
                const authStore = useAuthStore()
                const userId = authStore.currentUserId
                const data = await fetchDashboardAggregatedData(userId)
                this.weeklySummary = data.weeklySummary
                this.habits = data.habits
                this.recentEntries = data.recentEntries
            } catch (error) {
                console.error("Error fetching dashboard data:", error)
            } finally {
                this.isLoading = false
            }
        },

        async submitMessage(text, tag) {
            this.isAnalyzing = true
            this.aiFeedback = null
            this.aiRating = 0
            this.ratingSubmitted = false

            this.conversations.unshift({
                id: Date.now(),
                time: new Date().toLocaleString(undefined, { weekday: 'long', hour: 'numeric', minute: 'numeric' }),
                text,
                tag: tag || 'Personal',
                aiResponse: null
            })

            try {
                const response = await dashboardApi.processJournalEntry(text, tag)
                this.conversations[0].aiResponse = response.aiFeedback
                this.aiFeedback = response.aiFeedback
            } catch (error) {
                console.error("Error al procesar con IA:", error)
                this.aiFeedback = "Error al procesar tu mensaje. Intenta de nuevo."
            } finally {
                this.isAnalyzing = false
            }
        },

        submitAiRating(rating) {
            this.aiRating = rating
            this.ratingSubmitted = true
        },

        saveCurrentConversation() {
            if (this.conversations.length > 0) {
                this.savedConversation = {
                    messages: [...this.conversations],
                    time: this.conversations[0].time,
                    count: this.conversations.length
                }
            }
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
