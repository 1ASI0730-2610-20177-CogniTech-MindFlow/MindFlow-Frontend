import apiClient from '@/shared/infrastructure/base-api'

export class WellnessApiService {
    async stressCheck() {
        const response = await apiClient.post('/wellness/stress-check')
        return response.data
    }
}

export const WellnessAPI = new WellnessApiService()
