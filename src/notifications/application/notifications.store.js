import { defineStore } from 'pinia'
import { NotificationsApiService } from '../infrastructure/notifications-api'
import { Notification } from '../domain/model/notification.entity'

const api = new NotificationsApiService()

export const useNotificationsStore = defineStore('notifications', {
    state: () => ({
        notifications: [],
        isLoading: false
    }),

    getters: {
        unreadCount: (state) => {
            return state.notifications.filter(n => n.isUnread).length
        },

        unreadNotifications: (state) => {
            return state.notifications.filter(n => n.isUnread)
        },

        readNotifications: (state) => {
            return state.notifications.filter(n => n.isRead)
        },

        aiAlerts: (state) => {
            return state.notifications.filter(n => n.isAiAlert)
        },

        reminders: (state) => {
            return state.notifications.filter(n => n.isReminder)
        },

        hasUnreadAlerts: (state) => {
            return state.notifications.some(n => n.isUnread && n.isAiAlert)
        }
    },

    actions: {
        async fetchNotifications(userId) {
            if (!userId) return

            this.isLoading = true
            try {
                const data = await api.getByUserId(userId)
                this.notifications = (data || []).map(n => Notification.fromJSON(n))
            } catch (error) {
                console.error('Error al cargar notificaciones:', error)
                this.notifications = []
            } finally {
                this.isLoading = false
            }
        },

        async fetchUnreadNotifications(userId) {
            if (!userId) return

            try {
                const data = await api.getUnreadByUserId(userId)
                const unread = (data || []).map(n => Notification.fromJSON(n))
                const existingIds = new Set(this.notifications.map(n => n.id))
                const newOnes = unread.filter(n => !existingIds.has(n.id))
                this.notifications = [...newOnes, ...this.notifications]
            } catch (error) {
                console.error('Error al cargar notificaciones no leídas:', error)
            }
        },

        markAsRead(notificationId) {
            let updated = null
            this.notifications = this.notifications.map(n => {
                if (n.id === notificationId && n.isUnread) {
                    const json = n.toJSON()
                    json.read_at = new Date().toISOString()
                    updated = Notification.fromJSON(json)
                    return updated
                }
                return n
            })
            if (updated) {
                api.markAsRead(notificationId, updated.toJSON()).catch(e =>
                    console.error('Error al marcar notificación como leída:', e)
                )
            }
        },

        markAllAsRead() {
            const updatedList = []
            this.notifications = this.notifications.map(n => {
                if (n.isUnread) {
                    const json = n.toJSON()
                    json.read_at = new Date().toISOString()
                    const updated = Notification.fromJSON(json)
                    updatedList.push(updated)
                    return updated
                }
                return n
            })
            updatedList.forEach(n => {
                api.markAsRead(n.id, n.toJSON()).catch(() => {})
            })
        },

        async createNotification(notificationData) {
            try {
                const created = await api.createNotification(notificationData)
                const notif = created?.id ? Notification.fromJSON(created) : Notification.fromJSON(notificationData)
                this.notifications.unshift(notif)
                return notif
            } catch (error) {
                console.error('Error creating notification:', error)
                throw error
            }
        },

        async dismissNotification(notificationId) {
            try {
                await api.deleteNotification(notificationId)
                this.notifications = this.notifications.filter(n => n.id !== notificationId)
            } catch (error) {
                console.error('Error al eliminar notificación:', error)
                throw error
            }
        },

        clearNotifications() {
            this.notifications = []
        }
    }
})
