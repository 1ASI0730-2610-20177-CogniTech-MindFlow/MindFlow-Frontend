import { BaseEndpoint } from '@/shared/infrastructure/base-endpoint'
import apiClient from '@/shared/infrastructure/base-api'

export class SubscriptionApiService extends BaseEndpoint {
    constructor() {
        super('subscriptions')
    }

    async getByUserId(userId) {
        try {
            const response = await apiClient.get(`/${this.resource}`)
            const allSubscriptions = response.data

            const userSubscription = allSubscriptions.filter(sub => sub.user_id === userId)
            
            return userSubscription
        } catch (error) {
             console.error(`Error fetching subscriptions for user ${userId}:`, error)
             throw error
        }
    }
}