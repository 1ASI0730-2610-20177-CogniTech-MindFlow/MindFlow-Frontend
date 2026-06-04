import { BaseEndpoint } from '@/shared/infrastructure/base-endpoint'

const NOTIFICATIONS_URL = 'notifications'

export class NotificationsApiService extends BaseEndpoint {
    constructor() {
        super(NOTIFICATIONS_URL)
    }

    async getByUserId(userId) {
        try {
            const notifications = await this.search({ user_id: userId })
            if (!Array.isArray(notifications)) return []
            return notifications.filter(item => String(item.user_id) === String(userId) || String(item.userId) === String(userId))
        } catch (error) {
            console.error(`Error fetching notifications for user ${userId}:`, error)
            throw error
        }
    }

    async getUnreadByUserId(userId) {
        try {
            const notifications = await this.search({ user_id: userId, read_at: null })
            if (!Array.isArray(notifications)) return []
            return notifications.filter(item => String(item.user_id) === String(userId) || String(item.userId) === String(userId))
        } catch (error) {
            console.error(`Error fetching unread notifications for user ${userId}:`, error)
            throw error
        }
    }

    async markAsRead(notificationId, fullData) {
        try {
            return await this.update(notificationId, fullData)
        } catch (error) {
            console.error(`Error marking notification ${notificationId} as read:`, error)
            throw error
        }
    }

    async createNotification(notificationData) {
        try {
            return await this.create(notificationData)
        } catch (error) {
            console.error('Error creating notification:', error)
            throw error
        }
    }

    async deleteNotification(notificationId) {
        try {
            return await this.delete(notificationId)
        } catch (error) {
            console.error(`Error deleting notification ${notificationId}:`, error)
            throw error
        }
    }
}
