import { defineStore } from 'pinia'
import { AuthAPI } from '../infrastructure/auth-api.js'
import { SessionManager } from '../infrastructure/session-manager.js'
import { useSettingsStore } from '@/settings/application/settings.store.js'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        session: null,
        isLoading: false,
        error: null,
        returnUrl: '/dashboard'
    }),

    getters: {
        isAuthenticated(state) {
            return !!(state.session?.token || SessionManager.isAuthenticated())
        },

        currentUserId(state) {
            return state.user?.id || SessionManager.getUserId() || null
        },

        userName(state) {
            return state.user?.name || null
        },

        userInitial(state) {
            return state.user?.initial || 'U'
        },

        isPremium(state) {
            return state.user?.isPremium || false
        }
    },

    actions: {
        async login(credentials) {
            this.isLoading = true
            this.error = null

            try {
                const { user, session } = await AuthAPI.login(credentials)
                this.user = user
                this.session = session
                SessionManager.save({ token: session.token, refreshToken: session.refreshToken, userId: user.id })
                return { success: true }
            } catch (error) {
                const message = error.response?.data?.message || 'auth.login.error.invalid'
                this.error = message
                return { success: false, error: message }
            } finally {
                this.isLoading = false
            }
        },

        async register(data) {
            this.isLoading = true
            this.error = null

            try {
                const { user, session } = await AuthAPI.register(data)
                this.user = user
                this.session = session
                SessionManager.save({ token: session.token, refreshToken: session.refreshToken, userId: user.id })
                return { success: true }
            } catch (error) {
                const message = error.response?.data?.message || 'auth.register.error.generic'
                this.error = message
                return { success: false, error: message }
            } finally {
                this.isLoading = false
            }
        },

        async logout() {
            try {
                await AuthAPI.logout()
            } catch {
                // Silently fail server-side logout
            } finally {
                this.user = null
                this.session = null
                this.error = null
                SessionManager.clear()
            }
        },

        async restoreSession() {
            const saved = SessionManager.restore()
            if (!saved) return false

            this.isLoading = true

            try {
                const user = await AuthAPI.getMe()
                this.user = user
                this.session = { token: saved.token, refreshToken: saved.refreshToken, userId: saved.userId }
                return true
            } catch {
                SessionManager.clear()
                this.user = null
                this.session = null
                return false
            } finally {
                this.isLoading = false
            }
        },

        async forgotPassword(email) {
            this.isLoading = true
            this.error = null

            try {
                await AuthAPI.forgotPassword(email)
                return { success: true }
            } catch (error) {
                const message = error.response?.data?.message || 'auth.forgotPassword.error.generic'
                this.error = message
                return { success: false, error: message }
            } finally {
                this.isLoading = false
            }
        },

        setReturnUrl(url) {
            this.returnUrl = url
        },

        clearError() {
            this.error = null
        }
    }
})
