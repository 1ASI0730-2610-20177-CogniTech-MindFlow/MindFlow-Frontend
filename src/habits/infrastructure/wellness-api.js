import apiClient from '@/shared/infrastructure/base-api'

export class WellnessApiService {
    async stressCheck() {
        try {
            const response = await apiClient.post('/wellness/stress-check')
            return response.data
        } catch (error) {
            console.error('Error performing stress check:', error)
            throw error
        }
    }
}

export const WellnessAPI = new WellnessApiService()
