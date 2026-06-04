import { BaseEndpoint } from '@/shared/infrastructure/base-endpoint.js'

export class WordCloudEndpoint extends BaseEndpoint {
    constructor() {
        super('wordCloud')
    }

    async getByUserId(userId) {
        const result = await this.search({ user_id: userId })
        if (!Array.isArray(result)) return null
        const filtered = result.filter(item => String(item.user_id) === String(userId) || String(item.userId) === String(userId))
        return filtered.length > 0 ? filtered[0] : null
    }
}

export const wordCloudApi = new WordCloudEndpoint()