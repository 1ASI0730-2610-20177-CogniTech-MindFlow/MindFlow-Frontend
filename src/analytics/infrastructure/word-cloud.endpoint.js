import { BaseEndpoint } from '@/shared/infrastructure/base-endpoint.js'

export class WordCloudEndpoint extends BaseEndpoint {
    constructor() {
        super('https://6a11d45e3e35d0f37ee3ba3a.mockapi.io/wordCloud')
    }

    async getByUserId(userId) {
        const result = await this.search({ user_id: userId })
        return result.length > 0 ? result[0] : null
    }
}

export const wordCloudApi = new WordCloudEndpoint()