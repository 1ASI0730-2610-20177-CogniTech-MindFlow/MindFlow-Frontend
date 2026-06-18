import { BaseEndpoint } from '@/shared/infrastructure/base-endpoint'

export class SupportTicketsApi extends BaseEndpoint {
    constructor() {
        super('api/v1/support/tickets')
    }
}

export const SupportTicketsAPI = new SupportTicketsApi()
