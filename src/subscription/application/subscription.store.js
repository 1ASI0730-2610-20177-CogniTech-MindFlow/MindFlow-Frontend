import { defineStore } from 'pinia'
import { SubscriptionAPI } from '../infrastructure/subscription-api'
import { Subscription } from '../domain/model/subscription.entity'

export const useSubscriptionStore = defineStore('subscription', {
    state: () => ({
        subscriptionData: null,
        isLoading: false,
        isProcessingPayment: false
    }),

    getters: {
        isPremium: (state) => state.subscriptionData?.isPremiumActive || false,

        isActive: (state) => state.subscriptionData?.status === 'active'
    },

    actions: {
        async fetchSubscription() {
            this.isLoading = true
            try {
                const data = await SubscriptionAPI.getMySubscription()
                this.subscriptionData = data ? new Subscription(data) : new Subscription({})
            } catch (error) {
                if (error.response?.status !== 404) {
                    console.error('Error al cargar suscripción:', error)
                }
                this.subscriptionData = new Subscription({})
            } finally {
                this.isLoading = false
            }
        },

        async verifyCheckoutSession(sessionId) {
            try {
                await SubscriptionAPI.verifySession(sessionId)
                for (let i = 0; i < 5; i++) {
                    await this.fetchSubscription()
                    if (this.isPremium) return
                    await new Promise(r => setTimeout(r, 2000))
                }
            } catch (error) {
                console.error('Error al verificar sesión de pago:', error)
            }
        },

        async startCheckout() {
            this.isProcessingPayment = true
            try {
                const data = await SubscriptionAPI.createCheckout()
                const url = data?.checkout_url || data?.url || (typeof data === 'string' ? data : null)
                if (url) {
                    window.location.href = url
                }
                return data
            } catch (error) {
                console.error('Error al iniciar checkout:', error)
                throw error
            } finally {
                this.isProcessingPayment = false
            }
        },

        async cancelSubscription() {
            this.isProcessingPayment = true
            try {
                await SubscriptionAPI.cancelSubscription()
                await this.fetchSubscription()
            } catch (error) {
                console.error('Error al cancelar suscripción:', error)
                throw error
            } finally {
                this.isProcessingPayment = false
            }
        }
    }
})
