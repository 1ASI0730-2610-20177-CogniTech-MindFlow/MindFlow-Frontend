import { BaseEndpoint } from '@/shared/infrastructure/base-endpoint.js'

export class AnalyticsEndpoint extends BaseEndpoint {
    constructor() {
        super('analyticsCache')
    }

    async getByUserId(userId) {
        return await this.search({ user_id: userId })
    }
}

export const analyticsApi = new AnalyticsEndpoint()