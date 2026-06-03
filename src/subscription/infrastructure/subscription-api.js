import { BaseEndpoint } from '@/shared/infrastructure/base-endpoint'

const SUBSCRIPTIONS_URL = 'https://6a077491fa9b27c848fa1a98.mockapi.io/api/v1/subscriptions'
const PAYMENTS_URL = 'http://localhost:3000/payments'

export class SubscriptionApiService extends BaseEndpoint {
    constructor() {
        super(SUBSCRIPTIONS_URL)
        this.paymentsEndpoint = new BaseEndpoint(PAYMENTS_URL)
    }

    async getByUserId(userId) {
        try {
            const userSubscription = await this.search({ user_id: userId })
            return Array.isArray(userSubscription) ? userSubscription : []
        } catch (error) {
             console.error(`Error fetching subscriptions for user ${userId}:`, error)
             throw error
        }
    }

    async getPaymentsBySubscription(subscriptionId) {
        try {
            const payments = await this.paymentsEndpoint.search({ subscription_id: subscriptionId })
            return Array.isArray(payments) ? payments : []
        } catch (error) {
            console.error(`Error fetching payments for subscription ${subscriptionId}:`, error)
            throw error
        }
    }

    async getPaymentsByUserId(userId) {
        try {
            const payments = await this.paymentsEndpoint.search({ user_id: userId })
            return Array.isArray(payments) ? payments : []
        } catch (error) {
            console.error(`Error fetching payments for user ${userId}:`, error)
            throw error
        }
    }

    async createPayment(paymentData) {
        try {
            return await this.paymentsEndpoint.create(paymentData)
        } catch (error) {
            console.error('Error creating payment:', error)
            throw error
        }
    }

    async getPaymentById(paymentId) {
        try {
            return await this.paymentsEndpoint.getById(paymentId)
        } catch (error) {
            console.error(`Error fetching payment ${paymentId}:`, error)
            throw error
        }
    }
}