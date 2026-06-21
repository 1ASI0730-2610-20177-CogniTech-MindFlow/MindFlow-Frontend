import apiClient from '@/shared/infrastructure/base-api'
import { AuthAPI } from '@/iam/infrastructure/auth-api'
import { PinAPI } from '@/iam/infrastructure/pin-api'

export const SettingsAPI = {
    getProfile: async () => {
        const response = await apiClient.get('/api/v1/users/profile')
        return response.data
    },
    updateProfile: (data) => AuthAPI.updateProfile(data),
    deleteAccount: () => AuthAPI.deleteAccount(),
    getPinStatus: () => PinAPI.getStatus(),
    setPin: (pin) => PinAPI.setPin(pin),
    verifyPin: (pin) => PinAPI.verifyPin(pin),
    removePin: () => PinAPI.removePin()
}
