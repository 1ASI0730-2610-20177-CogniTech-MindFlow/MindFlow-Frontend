import apiClient from '@/shared/infrastructure/base-api'

export class SuggestionsApiService {
    async getSuggestions() {
        try {
            const response = await apiClient.post('/habits/suggestions')
            return response.data
        } catch (error) {
            console.error('Error fetching suggestions:', error)
            return []
        }
    }
}

export const SuggestionsAPI = new SuggestionsApiService()
