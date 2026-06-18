import apiClient from '@/shared/infrastructure/base-api.js'

export class AnalyticsEndpoint {
    async getAll() {
        try {
            const response = await apiClient.get('/analyticsCache')
            return response.data
        } catch {
            return []
        }
    }

    async getByWeekStart(weekStart) {
        try {
            const response = await apiClient.get('/analyticsCache', { params: { weekStart } })
            return response.data
        } catch {
            return []
        }
    }

    async compute(weekStart) {
        try {
            const response = await apiClient.post('/analyticsCache/compute', null, {
                params: { weekStart }
            })
            return response.data
        } catch (error) {
            console.error('Error computing analytics:', error)
            throw error
        }
    }
}

export const analyticsApi = new AnalyticsEndpoint()
