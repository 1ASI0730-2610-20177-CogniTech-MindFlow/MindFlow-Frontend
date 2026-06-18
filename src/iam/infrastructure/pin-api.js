import apiClient from '@/shared/infrastructure/base-api'

const PIN_URL = '/api/v1/users/pin'

export class PinApiService {
    async setPin(pin) {
        const response = await apiClient.post(PIN_URL, { pin })
        return response.data
    }

    async verifyPin(pin) {
        const response = await apiClient.post(`${PIN_URL}/verify`, { pin })
        return response.data
    }

    async getStatus() {
        const response = await apiClient.get(`${PIN_URL}/status`)
        return response.data
    }

    async removePin() {
        await apiClient.delete(PIN_URL)
    }
}

export const PinAPI = new PinApiService()
