import { defineStore } from 'pinia'
import { NotificationsAPI } from '../infrastructure/notifications-api'
import { Notification } from '../domain/model/notification.entity'

// El backend aún no expone un endpoint para marcar como leída; se persiste
// localmente para que el estado sobreviva a recargas de página.
const READ_STORAGE_KEY = 'mindflow_read_notifications'

function loadReadMap() {
    try {
        return JSON.parse(localStorage.getItem(READ_STORAGE_KEY)) || {}
    } catch {
        return {}
    }
}

function saveReadMap(map) {
    localStorage.setItem(READ_STORAGE_KEY, JSON.stringify(map))
}

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
                const readMap = loadReadMap()
                this.notifications = Array.isArray(data)
                    ? data.map(n => {
                        if (!n.read_at && readMap[n.id]) {
                            return Notification.fromJSON({ ...n, read_at: readMap[n.id] })
                        }
                        return Notification.fromJSON(n)
                    })
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
            const readMap = loadReadMap()
            this.notifications = this.notifications.map(n => {
                if (n.id === notificationId && n.isUnread) {
                    const json = n.toJSON()
                    json.read_at = new Date().toISOString()
                    readMap[n.id] = json.read_at
                    return Notification.fromJSON(json)
                }
                return n
            })
            saveReadMap(readMap)
        },

        markAllAsRead() {
            const readMap = loadReadMap()
            this.notifications = this.notifications.map(n => {
                if (n.isUnread) {
                    const json = n.toJSON()
                    json.read_at = new Date().toISOString()
                    readMap[n.id] = json.read_at
                    return Notification.fromJSON(json)
                }
                return n
            })
            saveReadMap(readMap)
        },

        dismissNotification(notificationId) {
            this.notifications = this.notifications.filter(n => n.id !== notificationId)
        },

        clearNotifications() {
            this.notifications = []
        }
    }
})
