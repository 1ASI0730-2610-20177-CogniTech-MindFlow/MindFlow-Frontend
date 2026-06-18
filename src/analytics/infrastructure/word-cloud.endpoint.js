import apiClient from '@/shared/infrastructure/base-api.js'

export class WordCloudEndpoint {
    async getAll() {
        try {
            const response = await apiClient.get('/wordCloud')
            return response.data
        } catch {
            return []
        }
    }

    async compute() {
        try {
            const response = await apiClient.post('/wordCloud/compute')
            return response.data
        } catch (error) {
            console.error('Error computing word cloud:', error)
            throw error
        }
    }
}

export const wordCloudApi = new WordCloudEndpoint()
