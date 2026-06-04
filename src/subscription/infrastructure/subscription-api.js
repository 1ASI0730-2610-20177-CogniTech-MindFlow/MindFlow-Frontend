import { BaseEndpoint } from '@/shared/infrastructure/base-endpoint'

const SUBSCRIPTIONS_URL = 'subscriptions'
const PAYMENTS_URL = 'payments'

export class SubscriptionApiService extends BaseEndpoint {
    constructor() {
        super(SUBSCRIPTIONS_URL)
        this.paymentsEndpoint = new BaseEndpoint(PAYMENTS_URL)
    }

    async getByUserId(userId) {
        try {
            const userSubscription = await this.search({ user_id: userId })
            if (!Array.isArray(userSubscription)) return []
            return userSubscription.filter(item => String(item.user_id) === String(userId) || String(item.userId) === String(userId))
        } catch (error) {
             console.error(`Error fetching subscriptions for user ${userId}:`, error)
             throw error
        }
    }

    async getPaymentsBySubscription(subscriptionId) {
        try {
            const payments = await this.paymentsEndpoint.search({ subscription_id: subscriptionId })
            if (!Array.isArray(payments)) return []
            return payments.filter(item => String(item.subscription_id) === String(subscriptionId) || String(item.subscriptionId) === String(subscriptionId))
        } catch (error) {
            console.error(`Error fetching payments for subscription ${subscriptionId}:`, error)
            throw error
        }
    }

    async getPaymentsByUserId(userId) {
        try {
            const payments = await this.paymentsEndpoint.search({ user_id: userId })
            if (!Array.isArray(payments)) return []
            return payments.filter(item => String(item.user_id) === String(userId) || String(item.userId) === String(userId))
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
            const payments = await this.paymentsEndpoint.getAll()
            if (Array.isArray(payments)) {
                return payments.find(p => p.id === paymentId) || null
            }
            return null
        } catch (error) {
            console.error(`Error fetching payment ${paymentId}:`, error)
            throw error
        }
    }
}