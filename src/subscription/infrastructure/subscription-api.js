import apiClient from '@/shared/infrastructure/base-api'

const SUBSCRIPTIONS_URL = '/api/v1/subscriptions'

export class SubscriptionApiService {
    async getMySubscription() {
        const response = await apiClient.get(`${SUBSCRIPTIONS_URL}/me`)
        return response.data
    }

    async createCheckout() {
        const response = await apiClient.post(`${SUBSCRIPTIONS_URL}/checkout`)
        return response.data
    }

    async verifySession(sessionId) {
        const response = await apiClient.post(`${SUBSCRIPTIONS_URL}/verify-session?sessionId=${encodeURIComponent(sessionId)}`)
        return response.data
    }

    async cancelSubscription() {
        const response = await apiClient.post(`${SUBSCRIPTIONS_URL}/cancel`)
        return response.data
    }
}

export const SubscriptionAPI = new SubscriptionApiService()
