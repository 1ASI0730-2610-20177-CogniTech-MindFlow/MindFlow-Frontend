import apiClient from '@/shared/infrastructure/base-api'
import { User } from '../domain/model/user.entity.js'
import { AuthSession } from '../domain/model/auth-session.entity.js'

const AUTH_URL = 'auth'

function handleResponse(response) {
    return response.data
}

function handleError(error, context) {
    console.error(`Error ${context}:`, error)
    throw error
}

export class AuthApiService {
    async login(credentials) {
        try {
            const response = await apiClient.post(`/${AUTH_URL}/login`, credentials)
            const data = handleResponse(response)
            return {
                user: User.fromJSON(data.user),
                session: AuthSession.fromJSON(data.session)
            }
        } catch (error) {
            return handleError(error, 'logging in')
        }
    }

    async register(data) {
        try {
            const response = await apiClient.post(`/${AUTH_URL}/register`, data)
            const result = handleResponse(response)
            return {
                user: User.fromJSON(result.user),
                session: AuthSession.fromJSON(result.session)
            }
        } catch (error) {
            return handleError(error, 'registering')
        }
    }

    async forgotPassword(email) {
        try {
            const response = await apiClient.post(`/${AUTH_URL}/forgot-password`, { email })
            return handleResponse(response)
        } catch (error) {
            return handleError(error, 'sending forgot password')
        }
    }

    async resetPassword({ token, password }) {
        try {
            const response = await apiClient.post(`/${AUTH_URL}/reset-password`, { token, password })
            return handleResponse(response)
        } catch (error) {
            return handleError(error, 'resetting password')
        }
    }

    async refreshToken(refreshToken) {
        try {
            const response = await apiClient.post(`/${AUTH_URL}/refresh`, { refresh_token: refreshToken })
            const data = handleResponse(response)
            return AuthSession.fromJSON(data)
        } catch (error) {
            return handleError(error, 'refreshing token')
        }
    }

    async logout() {
        try {
            await apiClient.post(`/${AUTH_URL}/logout`)
        } catch (error) {
            console.error('Error logging out:', error)
        }
    }

    async getMe() {
        try {
            const response = await apiClient.get(`/${AUTH_URL}/me`)
            const data = handleResponse(response)
            return User.fromJSON(data)
        } catch (error) {
            return handleError(error, 'fetching current user')
        }
    }
}

export const AuthAPI = new AuthApiService()
