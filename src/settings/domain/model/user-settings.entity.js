export class UserSettings {
    constructor({
        id,
        userId,
        pinLockEnabled = false,
        habitRemindersEnabled = true,
        reminderTime = '09:00',
        language = 'es',
        createdAt,
        updatedAt
    }) {
        this.id = id
        this.userId = userId
        this.pinLockEnabled = pinLockEnabled
        this.habitRemindersEnabled = habitRemindersEnabled
        this.reminderTime = reminderTime
        this.language = language
        this.createdAt = createdAt
        this.updatedAt = updatedAt
    }

    static fromJSON(data) {
        return new UserSettings({
            id: data.id,
            userId: data.user_id,
            pinLockEnabled: data.pin_lock_enabled,
            habitRemindersEnabled: data.habit_reminders_enabled,
            reminderTime: data.reminder_time,
            language: data.language,
            createdAt: data.created_at,
            updatedAt: data.updated_at
        })
    }

    toJSON() {
        return {
            id: this.id,
            user_id: this.userId,
            pin_lock_enabled: this.pinLockEnabled,
            habit_reminders_enabled: this.habitRemindersEnabled,
            reminder_time: this.reminderTime,
            language: this.language,
            created_at: this.createdAt,
            updated_at: this.updatedAt
        }
    }

    static getSupportedLanguages() {
        return ['es', 'en', 'pt', 'fr', 'de']
    }

    isValidReminderTime() {
        const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
        return timeRegex.test(this.reminderTime)
    }
}

