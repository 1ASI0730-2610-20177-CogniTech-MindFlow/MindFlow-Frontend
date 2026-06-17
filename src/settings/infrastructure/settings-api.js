import apiClient from '@/shared/infrastructure/base-api'

const USERS_URL = '/api/v1/users'

export class SettingsApiService {
    async updateProfile(data) {
        const response = await apiClient.put(`${USERS_URL}/profile`, data)
        return response.data
    }

    async deleteAccount() {
        await apiClient.delete(USERS_URL)
    }

    async getPinStatus() {
        const response = await apiClient.get(`${USERS_URL}/pin/status`)
        return response.data
    }

    async setPin(pin) {
        const response = await apiClient.post(`${USERS_URL}/pin`, { pin })
        return response.data
    }

    async verifyPin(pin) {
        const response = await apiClient.post(`${USERS_URL}/pin/verify`, { pin })
        return response.data
    }

    async removePin() {
        await apiClient.delete(`${USERS_URL}/pin`)
    }
}

export const SettingsAPI = new SettingsApiService()
