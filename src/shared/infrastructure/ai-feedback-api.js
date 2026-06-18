import apiClient from './base-api'

const AI_FEEDBACK_URL = '/api/v1/ai-feedback'

export class AiFeedbackApiService {
    async submit({ contentId, contentType, rating, comment }) {
        try {
            const response = await apiClient.post(AI_FEEDBACK_URL, {
                content_id: contentId,
                content_type: contentType,
                rating,
                comment
            })
            return response.data
        } catch (error) {
            console.error('Error submitting AI feedback:', error)
            throw error
        }
    }

    async getAll() {
        try {
            const response = await apiClient.get(AI_FEEDBACK_URL)
            return response.data
        } catch (error) {
            console.error('Error fetching AI feedback:', error)
            return []
        }
    }

    async getSummary() {
        try {
            const response = await apiClient.get(`${AI_FEEDBACK_URL}/summary`)
            return response.data
        } catch (error) {
            console.error('Error fetching AI feedback summary:', error)
            return null
        }
    }
}

export const AiFeedbackAPI = new AiFeedbackApiService()
