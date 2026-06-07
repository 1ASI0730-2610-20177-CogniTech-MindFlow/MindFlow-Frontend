import { BaseEndpoint } from '@/shared/infrastructure/base-endpoint'

const USERS_URL = 'users'
const USER_SETTINGS_URL = 'userSettings'

export class SettingsApiService extends BaseEndpoint {
    constructor() {
        super(USERS_URL)
        this.userSettingsEndpoint = new BaseEndpoint(USER_SETTINGS_URL)
    }

    async getByUserId(userId) {
        try {
            const users = await this.getAll()
            if (Array.isArray(users)) {
                return users.find(u => u.id === userId || u.user_id === userId) || null
            }
            return null
        } catch (error) {
            console.error(`Error fetching user ${userId}:`, error)
            return null
        }
    }

    async getUserSettings(userId) {
        try {
            const allSettings = await this.userSettingsEndpoint.getAll()

            const userSettings = (Array.isArray(allSettings) ? allSettings : []).find(settings => settings.user_id === userId || settings.userId === userId)

            return userSettings || null
        } catch (error) {
            console.error(`Error fetching user settings for user ${userId}:`, error)
            return null
        }
    }

    async updateUserSettings(settingsId, settings) {
        try {
            return await this.userSettingsEndpoint.update(settingsId, {
                ...settings,
                updated_at: new Date().toISOString()
            })
        } catch (error) {
            console.error(`Error updating user settings ${settingsId}:`, error)
            throw error
        }
    }
}