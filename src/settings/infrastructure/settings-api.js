import { AuthAPI } from '@/iam/infrastructure/auth-api'
import { PinAPI } from '@/iam/infrastructure/pin-api'

export const SettingsAPI = {
    updateProfile: (data) => AuthAPI.updateProfile(data),
    deleteAccount: () => AuthAPI.deleteAccount(),
    getPinStatus: () => PinAPI.getStatus(),
    setPin: (pin) => PinAPI.setPin(pin),
    verifyPin: (pin) => PinAPI.verifyPin(pin),
    removePin: () => PinAPI.removePin()
}
