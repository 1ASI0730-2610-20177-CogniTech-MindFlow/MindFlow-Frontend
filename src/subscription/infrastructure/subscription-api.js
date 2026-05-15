import axios from 'axios'
import { BaseEndpoint } from '@/shared/infrastructure/base-endpoint'

export class SubscriptionApiService extends BaseEndpoint {
    constructor() {
        super('subscriptions')
    }

    async getByUserId(userId) {
        const response = await axios.get(`http://localhost:3000/subscriptions?user_id=${userId}`)
        return response.data
    }
}