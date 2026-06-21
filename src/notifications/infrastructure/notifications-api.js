import apiClient from '@/shared/infrastructure/base-api'

export class NotificationsApiService {
    async getAll() {
        try {
            const response = await apiClient.get('/notifications')
            return response.data
        } catch (error) {
            console.error('Error fetching notifications:', error)
            return []
        }
    }

    async registerDevice(fcmToken, platform = 'web') {
        try {
            const response = await apiClient.post('/notifications/register-device', {
                token: fcmToken,
                platform
            })
            return response.data
        } catch (error) {
            console.error('Error registering device:', error)
            throw error
        }
    }

    async unregisterDevice(fcmToken) {
        try {
            await apiClient.delete('/notifications/unregister-device', {
                data: { token: fcmToken }
            })
        } catch (error) {
            console.error('Error unregistering device:', error)
            throw error
        }
    }
}

export const NotificationsAPI = new NotificationsApiService()
