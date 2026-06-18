import apiClient from '@/shared/infrastructure/base-api'
import { User } from '../domain/model/user.entity.js'

const USERS_URL = '/api/v1/users'

function handleError(error, context) {
    console.error(`Error ${context}:`, error)
    if (error.response) {
        console.error(`Response status: ${error.response.status}`)
        console.error('Response data:', error.response.data)
    }
    throw error
}

export class AuthApiService {
    async login(credentials) {
        try {
            const response = await apiClient.post(`${USERS_URL}/sign-in`, credentials)
            const data = response.data
            return {
                user: User.fromJSON({ id: data.id, email: data.email }),
                token: data.token
            }
        } catch (error) {
            return handleError(error, 'logging in')
        }
    }

    async register(data) {
        try {
            const response = await apiClient.post(`${USERS_URL}/sign-up`, {
                email: data.email,
                password: data.password
            })
            return User.fromJSON(response.data)
        } catch (error) {
            return handleError(error, 'registering')
        }
    }

    async googleAuth(credential) {
        try {
            const response = await apiClient.post(`${USERS_URL}/google-auth`, { credential })
            const data = response.data
            return {
                user: User.fromJSON({ id: data.id, email: data.email }),
                token: data.token
            }
        } catch (error) {
            return handleError(error, 'Google auth')
        }
    }

    async forgotPassword(email) {
        try {
            await apiClient.post(`${USERS_URL}/forgot-password`, { email })
        } catch (error) {
            return handleError(error, 'sending forgot password')
        }
    }

    async resetPassword({ token, newPassword }) {
        try {
            await apiClient.post(`${USERS_URL}/reset-password`, {
                token,
                new_password: newPassword
            })
        } catch (error) {
            return handleError(error, 'resetting password')
        }
    }

    async updateProfile(data) {
        try {
            const response = await apiClient.put(`${USERS_URL}/profile`, data)
            return User.fromJSON(response.data)
        } catch (error) {
            return handleError(error, 'updating profile')
        }
    }

    async deleteAccount() {
        try {
            await apiClient.delete(USERS_URL)
        } catch (error) {
            return handleError(error, 'deleting account')
        }
    }
}

export const AuthAPI = new AuthApiService()
