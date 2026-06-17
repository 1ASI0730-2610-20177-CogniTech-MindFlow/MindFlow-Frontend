import apiClient from '@/shared/infrastructure/base-api'

export class NotificationsApiService {
    async registerDevice(fcmToken, platform = 'web') {
        const response = await apiClient.post('/notifications/register-device', {
            token: fcmToken,
            platform
        })
        return response.data
    }

    async unregisterDevice(fcmToken) {
        await apiClient.delete('/notifications/unregister-device', {
            data: { token: fcmToken }
        })
    }
}

export const NotificationsAPI = new NotificationsApiService()
