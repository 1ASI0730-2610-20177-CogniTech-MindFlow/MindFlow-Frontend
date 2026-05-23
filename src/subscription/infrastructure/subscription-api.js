import { BaseEndpoint } from '@/shared/infrastructure/base-endpoint'

const SUBSCRIPTIONS_URL = 'https://6a077491fa9b27c848fa1a98.mockapi.io/api/v1/subscriptions'

export class SubscriptionApiService extends BaseEndpoint {
    constructor() {
        super(SUBSCRIPTIONS_URL)
    }

    async getByUserId(userId) {
        try {
            const userSubscription = await this.search({ user_id: userId })
            return Array.isArray(userSubscription) ? userSubscription : []
        } catch (error) {
             console.error(`Error fetching subscriptions for user ${userId}:`, error)
             throw error
        }
    }
}