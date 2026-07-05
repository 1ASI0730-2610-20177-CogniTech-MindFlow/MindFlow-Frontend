import { defineStore } from 'pinia'
import { ChatAPI } from '../infrastructure/chat-api'
import { useAuthStore } from '@/iam/application/auth.store.js'
import { useHabitsStore } from '@/habits/application/habits.store.js'
import { fetchDashboardAggregatedData } from './dashboard.service'
import { AiFeedbackAPI } from '@/shared/infrastructure/ai-feedback-api'
import i18n from '@/i18n'

export const useDashboardStore = defineStore('dashboard', {
    state: () => ({
        isLoading: true,
        isAnalyzing: false,
        aiFeedback: null,
        aiRating: 0,
        ratingSubmitted: false,
        conversationsList: [],
        activeConversationId: null,
        messages: [],
        recentEntries: [],
        habits: [],
        weeklySummary: null
    }),

    getters: {
        activeConversation: (state) =>
            state.conversationsList.find(c => c.id === state.activeConversationId) || null
    },

    actions: {
        async fetchDashboardData() {
            this.isLoading = true
            try {
                const authStore = useAuthStore()
                const userId = authStore.currentUserId
                const [data] = await Promise.all([
                    fetchDashboardAggregatedData(userId),
                    this.fetchConversations()
                ])
                this.weeklySummary = data.weeklySummary
                this.habits = data.habits
                this.recentEntries = data.recentEntries
            } catch (error) {
                console.error("Error fetching dashboard data:", error)
            } finally {
                this.isLoading = false
            }
        },

        async fetchConversations() {
            const data = await ChatAPI.getConversations()
            this.conversationsList = Array.isArray(data) ? data : []
        },

        async openConversation(conversationId) {
            this.activeConversationId = conversationId
            this.messages = []
            this.aiFeedback = null
            this.aiRating = 0
            this.ratingSubmitted = false
            const data = await ChatAPI.getMessages(conversationId)
            const msgs = Array.isArray(data) ? data : (data?.messages || data?.content || [])
            this.messages = msgs
            const lastAi = [...msgs].reverse().find(m => m.role === 'assistant')
            if (lastAi) this.aiFeedback = lastAi.content
        },

        async submitMessage(text, category) {
            this.isAnalyzing = true
            this.aiFeedback = null
            this.aiRating = 0
            this.ratingSubmitted = false

            try {
                if (!this.activeConversationId) {
                    const conversation = await ChatAPI.createConversation(text, category)
                    this.activeConversationId = conversation.id
                    const msgs = conversation.messages || []
                    this.messages = msgs
                    const aiMsg = msgs.find(m => m.role === 'assistant')
                    this.aiFeedback = aiMsg?.content || null
                    await this.fetchConversations()
                } else {
                    const response = await ChatAPI.sendMessage(this.activeConversationId, text)
                    const userMsg = response.user_message || response.userMessage
                    const aiMsg = response.ai_message || response.aiMessage
                    if (userMsg) this.messages.push(userMsg)
                    if (aiMsg) {
                        this.messages.push(aiMsg)
                        this.aiFeedback = aiMsg.content
                    }
                    await this.fetchConversations()
                }
            } catch (error) {
                console.error('Error processing AI message:', error)
                this.aiFeedback = i18n.global.t('dashboard.chat.error')
            } finally {
                this.isAnalyzing = false
            }
        },

        async deleteConversation(conversationId) {
            await ChatAPI.deleteConversation(conversationId)
            if (this.activeConversationId === conversationId) {
                this.activeConversationId = null
                this.messages = []
            }
            await this.fetchConversations()
        },

        startNewConversation() {
            this.activeConversationId = null
            this.messages = []
            this.aiFeedback = null
            this.aiRating = 0
            this.ratingSubmitted = false
        },

        submitAiRating(rating) {
            this.aiRating = rating
            this.ratingSubmitted = true
        },

        async toggleHabit(id) {
            const habit = this.habits.find(h => String(h.id) === String(id))
            if (!habit) return

            const previous = { completed: habit.completed, streak: habit.streak }
            habit.completed = !habit.completed
            habit.streak = Math.max(0, habit.streak + (habit.completed ? 1 : -1))

            try {
                const habitsStore = useHabitsStore()
                await habitsStore.loadHabits()
                await habitsStore.toggleHabit(id)
                const synced = habitsStore.habits.find(h => String(h.id) === String(id))
                if (synced) {
                    habit.completed = synced.isCompleted()
                    habit.streak = synced.currentStreak
                }
            } catch (error) {
                console.error('Error syncing habit from dashboard:', error)
                habit.completed = previous.completed
                habit.streak = previous.streak
            }
        }
    }
})
