import { BaseEndpoint } from '@/shared/infrastructure/base-endpoint.js'

export class AnalyticsEndpoint extends BaseEndpoint {
    constructor() {
        super('https://6a11d45e3e35d0f37ee3ba3a.mockapi.io/analyticsCache')
    }

    async getByUserId(userId) {
        const results = await this.search({ user_id: userId })
        return results.length > 0 ? results : []
    }
}

export const analyticsApi = new AnalyticsEndpoint()