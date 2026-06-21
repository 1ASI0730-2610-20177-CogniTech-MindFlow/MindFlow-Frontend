import { defineStore } from 'pinia'
import { NotificationsAPI } from '../infrastructure/notifications-api'
import { Notification } from '../domain/model/notification.entity'

export const useNotificationsStore = defineStore('notifications', {
    state: () => ({
        notifications: [],
        isLoading: false,
        deviceRegistered: false
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
        async fetchNotifications() {
            this.isLoading = true
            try {
                const data = await NotificationsAPI.getAll()
                this.notifications = Array.isArray(data)
                    ? data.map(n => Notification.fromJSON(n))
                    : []
            } catch (error) {
                console.error('Error loading notifications:', error)
            } finally {
                this.isLoading = false
            }
        },

        async registerDevice(fcmToken) {
            try {
                await NotificationsAPI.registerDevice(fcmToken, 'web')
                this.deviceRegistered = true
            } catch (error) {
                console.error('Error registering device for push notifications:', error)
            }
        },

        async unregisterDevice(fcmToken) {
            try {
                await NotificationsAPI.unregisterDevice(fcmToken)
                this.deviceRegistered = false
            } catch (error) {
                console.error('Error unregistering device:', error)
            }
        },

        addNotification(notificationData) {
            const notif = Notification.fromJSON(notificationData)
            this.notifications.unshift(notif)
            return notif
        },

        markAsRead(notificationId) {
            this.notifications = this.notifications.map(n => {
                if (n.id === notificationId && n.isUnread) {
                    const json = n.toJSON()
                    json.read_at = new Date().toISOString()
                    return Notification.fromJSON(json)
                }
                return n
            })
        },

        markAllAsRead() {
            this.notifications = this.notifications.map(n => {
                if (n.isUnread) {
                    const json = n.toJSON()
                    json.read_at = new Date().toISOString()
                    return Notification.fromJSON(json)
                }
                return n
            })
        },

        dismissNotification(notificationId) {
            this.notifications = this.notifications.filter(n => n.id !== notificationId)
        },

        clearNotifications() {
            this.notifications = []
        }
    }
})
