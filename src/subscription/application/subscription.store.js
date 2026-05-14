import { defineStore } from 'pinia'
import { SubscriptionApiService } from '../infrastructure/subscription-api'
import { Subscription } from '../domain/model/subscription.entity'

const api = new SubscriptionApiService()

export const useSubscriptionStore = defineStore('subscription', {
    state: () => ({
        subscriptionData: null,
        isLoading: false
    }),
    getters: {
        isPremium: (state) => state.subscriptionData?.isPremiumActive || false
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
        }
    }
})