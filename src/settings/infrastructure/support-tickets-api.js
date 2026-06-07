import { BaseEndpoint } from '@/shared/infrastructure/base-endpoint'

const SUPPORT_TICKETS_URL = 'supportTickets'

export class SupportTicketsApi extends BaseEndpoint {
    constructor() {
        super(SUPPORT_TICKETS_URL)
    }
}
