import { BaseEndpoint } from '@/shared/infrastructure/base-endpoint.js'

export class AnalyticsEndpoint extends BaseEndpoint {
    constructor() {
        super('analyticsCache')
    }

    async getByUserId(userId) {
        const results = await this.search({ user_id: userId })
        if (!Array.isArray(results)) return []
        return results.filter(item => String(item.user_id) === String(userId) || String(item.userId) === String(userId))
    }
}

export const analyticsApi = new AnalyticsEndpoint()