export const NotificationType = {
    REMINDER: 'reminder',
    AI_ALERT: 'ai_alert'
}

export class Notification {
    constructor({
        id,
        userId = null,
        habitId = null,
        type = NotificationType.REMINDER,
        title = '',
        message = '',
        sentAt = null,
        readAt = null,
        createdAt = null
    }) {
        this.id = id
        this.userId = userId
        this.habitId = habitId
        this.type = type
        this.title = title
        this.message = message
        this.sentAt = sentAt ? new Date(sentAt) : null
        this.readAt = readAt ? new Date(readAt) : null
        this.createdAt = createdAt ? new Date(createdAt) : null
    }

    get isRead() {
        return this.readAt !== null
    }

    get isUnread() {
        return this.readAt === null
    }

    get isAiAlert() {
        return this.type === NotificationType.AI_ALERT
    }

    get isReminder() {
        return this.type === NotificationType.REMINDER
    }

    toJSON() {
        return {
            id: this.id,
            user_id: this.userId,
            habit_id: this.habitId,
            type: this.type,
            title: this.title,
            message: this.message,
            sent_at: this.sentAt ? this.sentAt.toISOString() : null,
            read_at: this.readAt ? this.readAt.toISOString() : null,
            created_at: this.createdAt ? this.createdAt.toISOString() : null
        }
    }

    static fromJSON(data) {
        return new Notification({
            id: data.id,
            userId: data.user_id ?? data.userId ?? null,
            habitId: data.habit_id ?? data.habitId ?? null,
            type: data.type,
            title: data.title,
            message: data.message,
            sentAt: data.sent_at ?? data.sentAt ?? null,
            readAt: data.read_at ?? data.readAt ?? null,
            createdAt: data.created_at ?? data.createdAt ?? null
        })
    }
}
