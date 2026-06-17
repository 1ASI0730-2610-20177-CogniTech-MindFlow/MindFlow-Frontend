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
        const response = await apiClient.post('/wordCloud/compute')
        return response.data
    }
}

export const wordCloudApi = new WordCloudEndpoint()
