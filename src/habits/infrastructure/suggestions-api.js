import apiClient from '@/shared/infrastructure/base-api'

export class SuggestionsApiService {
    async getSuggestions() {
        const response = await apiClient.post('/habits/suggestions')
        return response.data
    }
}

export const SuggestionsAPI = new SuggestionsApiService()
