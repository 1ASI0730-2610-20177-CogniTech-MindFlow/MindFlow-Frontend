import { defineStore } from 'pinia'
import { AuthAPI } from '../infrastructure/auth-api.js'
import { AuthSession } from '../domain/model/auth-session.entity.js'
import { User } from '../domain/model/user.entity.js'
import { SessionManager } from '../infrastructure/session-manager.js'

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
            return state.user?.name || SessionManager.getUserName() || null
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
                const { user, token } = await AuthAPI.login(credentials)
                this.user = user
                this.session = new AuthSession({ token, userId: user.id })
                SessionManager.save({ token, userId: user.id, email: user.email, name: user.name })
                return { success: true }
            } catch (error) {
                const message = error.response?.data?.error || error.response?.data?.message || 'auth.login.error.invalid'
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
                await AuthAPI.register(data)
                const { user, token } = await AuthAPI.login({
                    email: data.email,
                    password: data.password
                })

                if (data.name && !user.name) {
                    user.name = data.name
                    AuthAPI.updateProfile({ name: data.name }).catch(() => {})
                }

                this.user = user
                this.session = new AuthSession({ token, userId: user.id })
                SessionManager.save({ token, userId: user.id, email: user.email, name: user.name || data.name })
                return { success: true }
            } catch (error) {
                const message = error.response?.data?.error || error.response?.data?.message || 'auth.register.error.generic'
                this.error = message
                return { success: false, error: message }
            } finally {
                this.isLoading = false
            }
        },

        async googleLogin(credential) {
            this.isLoading = true
            this.error = null

            try {
                const { user, token } = await AuthAPI.googleAuth(credential)

                let googleName = null
                try {
                    const payload = JSON.parse(atob(credential.split('.')[1]))
                    googleName = payload.name || payload.given_name || null
                } catch { /* ignore decode errors */ }

                if (googleName && !user.name) {
                    user.name = googleName
                    AuthAPI.updateProfile({ name: googleName }).catch(() => {})
                }

                this.user = user
                this.session = new AuthSession({ token, userId: user.id })
                SessionManager.save({ token, userId: user.id, email: user.email, name: user.name })
                return { success: true }
            } catch (error) {
                const message = error.response?.data?.message || 'auth.login.error.generic'
                this.error = message
                return { success: false, error: message }
            } finally {
                this.isLoading = false
            }
        },

        async logout() {
            this.user = null
            this.session = null
            this.error = null
            SessionManager.clear()
            sessionStorage.removeItem('mindflow_pin_verified')
        },

        restoreSession() {
            const saved = SessionManager.restore()
            if (!saved) return false

            this.user = User.fromJSON({
                id: saved.userId,
                email: saved.email,
                name: saved.name
            })
            this.session = new AuthSession({
                token: saved.token,
                refreshToken: saved.refreshToken,
                userId: saved.userId
            })
            return true
        },

        async updateProfile(profileData) {
            this.isLoading = true
            try {
                const updatedUser = await AuthAPI.updateProfile(profileData)
                this.user = updatedUser
                SessionManager.setUserName(updatedUser.name)
                SessionManager.setUserEmail(updatedUser.email)
                return { success: true }
            } catch (error) {
                const message = error.response?.data?.message || 'settings.error.updateProfile'
                return { success: false, error: message }
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
