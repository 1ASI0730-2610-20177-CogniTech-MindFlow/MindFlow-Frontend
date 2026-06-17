import apiClient from './base-api'

const AI_FEEDBACK_URL = '/api/v1/ai-feedback'

export class AiFeedbackApiService {
    async submit({ contentId, contentType, rating, comment }) {
        const response = await apiClient.post(AI_FEEDBACK_URL, {
            content_id: contentId,
            content_type: contentType,
            rating,
            comment
        })
        return response.data
    }

    async getAll() {
        const response = await apiClient.get(AI_FEEDBACK_URL)
        return response.data
    }

    async getSummary() {
        const response = await apiClient.get(`${AI_FEEDBACK_URL}/summary`)
        return response.data
    }
}

export const AiFeedbackAPI = new AiFeedbackApiService()
