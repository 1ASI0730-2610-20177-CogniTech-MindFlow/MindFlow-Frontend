import { defineStore } from 'pinia'
import { SubscriptionApiService } from '../infrastructure/subscription-api'
import { Subscription } from '../domain/model/subscription.entity'
import { Payment } from '../domain/model/payment.entity'

const api = new SubscriptionApiService()

export const useSubscriptionStore = defineStore('subscription', {
    state: () => ({
        subscriptionData: null,
        paymentHistory: [],
        currentPayment: null,
        isLoading: false,
        isProcessingPayment: false
    }),
    getters: {
        isPremium: (state) => state.subscriptionData?.isPremiumActive || false,

        lastPayment: (state) => {
            if (state.paymentHistory.length === 0) return null
            return state.paymentHistory.reduce((latest, payment) =>
                !latest || payment.paidAt > latest.paidAt ? payment : latest
            )
        },

        paymentsByStatus: (state) => (status) => {
            return state.paymentHistory.filter(p => p.status === status)
        },

        hasFailedPayment: (state) => {
            return state.paymentHistory.some(p => p.isFailed)
        }
    },
    actions: {
        async fetchSubscription(userId) {
            if (!userId) {
                console.error('Error Crítico: No se proporcionó un userId.');
                return;
            }

            this.isLoading = true
            try {
                const data = await api.getByUserId(userId)

                if (data && data.length > 0) {
                    const activeSub = data.find(s => s.status === 'active') || data[0]
                    this.subscriptionData = new Subscription(activeSub)
                } else {
                    this.subscriptionData = new Subscription({})
                }
            } catch (error) {
                console.error('Error al cargar suscripción:', error)
            } finally {
                this.isLoading = false
            }
        },

        async fetchPaymentHistory(userId) {
            if (!userId) return

            try {
                const data = await api.getPaymentsByUserId(userId)
                this.paymentHistory = (data || []).map(p => Payment.fromJSON(p))
            } catch (error) {
                console.error('Error al cargar historial de pagos:', error)
                this.paymentHistory = []
            }
        },

        async fetchPaymentsBySubscription(subscriptionId) {
            if (!subscriptionId) return

            try {
                const data = await api.getPaymentsBySubscription(subscriptionId)
                this.paymentHistory = (data || []).map(p => Payment.fromJSON(p))
            } catch (error) {
                console.error('Error al cargar pagos de suscripción:', error)
                this.paymentHistory = []
            }
        },

        async processPayment({ userId, subscriptionId, amount, currency = 'USD', paymentMethod }) {
            this.isProcessingPayment = true

            try {
                const paymentData = {
                    user_id: userId,
                    subscription_id: subscriptionId,
                    amount,
                    currency,
                    payment_method: paymentMethod,
                    status: 'completed',
                    transaction_id: `txn_${Date.now()}`,
                    paid_at: new Date().toISOString(),
                    created_at: new Date().toISOString()
                }

                const result = await api.createPayment(paymentData)
                const payment = Payment.fromJSON(result)
                this.paymentHistory.push(payment)
                this.currentPayment = payment
                return payment
            } catch (error) {
                console.error('Error al procesar pago:', error)
                throw error
            } finally {
                this.isProcessingPayment = false
            }
        },

        clearPaymentHistory() {
            this.paymentHistory = []
            this.currentPayment = null
        }
    }
})