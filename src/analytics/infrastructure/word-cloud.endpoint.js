import { BaseEndpoint } from '@/shared/infrastructure/base-endpoint.js'

export class WordCloudEndpoint extends BaseEndpoint {
    constructor() {
        super('https://mindflow.free.beeceptor.com/api/wordCloud')
    }

    async getByUserId(userId) {
        const result = await this.search({ user_id: userId })
        return result.length > 0 ? result[0] : null
    }
}

export const wordCloudApi = new WordCloudEndpoint()