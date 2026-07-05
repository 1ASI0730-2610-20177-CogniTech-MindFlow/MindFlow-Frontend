import apiClient from '@/shared/infrastructure/base-api'

const RETRY_DELAY_MS = 1500

export class SuggestionsApiService {
    async getSuggestions() {
        // El backend genera las sugerencias con IA; un 5xx suele ser un fallo
        // transitorio del proveedor, así que se reintenta una vez.
        try {
            const response = await apiClient.post('/habits/suggestions')
            return response.data
        } catch (error) {
            if (!error.response || error.response.status >= 500) {
                await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS))
                const response = await apiClient.post('/habits/suggestions')
                return response.data
            }
            throw error
        }
    }
}

export const SuggestionsAPI = new SuggestionsApiService()
