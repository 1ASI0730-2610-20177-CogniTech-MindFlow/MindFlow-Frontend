import apiClient from '@/shared/infrastructure/base-api'

export class DashboardEndpoint {
    async processJournalEntry(text, tag) {
        const response = await apiClient.post('/journal/entries', {
            date: new Date().toISOString().slice(0, 10),
            title: text.slice(0, 50),
            content: text,
            sentiment: '',
            category: tag || 'Personal'
        })
        const entry = response.data
        const aiResponse = entry.ai_response || entry.aiResponse || null

        if (entry.id) {
            apiClient.delete(`/journal/entries/${entry.id}`).catch(() => {})
        }

        return {
            success: true,
            aiFeedback: aiResponse
        }
    }
}

export const dashboardApi = new DashboardEndpoint()
