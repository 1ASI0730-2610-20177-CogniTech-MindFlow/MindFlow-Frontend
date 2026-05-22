import { BaseEndpoint } from '@/shared/infrastructure/base-endpoint.js'

export class AnalyticsEndpoint extends BaseEndpoint {
    constructor() {
        super('analytics')
    }

    async getMoodTrends(days = 30) {
        const response = await this.getAll({ days, type: 'mood' })
        return response
    }
}

export const analyticsApi = new AnalyticsEndpoint()