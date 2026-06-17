import apiClient from '@/shared/infrastructure/base-api'

export class SubscriptionApiService {
    async getMySubscription() {
        const response = await apiClient.get('/subscriptions/me')
        return response.data
    }

    async createCheckout() {
        const response = await apiClient.post('/subscriptions/checkout')
        return response.data
    }
}

export const SubscriptionAPI = new SubscriptionApiService()
