import { BaseEndpoint } from '@/shared/infrastructure/base-endpoint'

const USER_SETTINGS_URL = 'https://6a10fe963e35d0f37ee2f083.mockapi.io/userSettings'

export class SettingsApiService extends BaseEndpoint {
    constructor() {
        super('users')
        this.userSettingsEndpoint = new BaseEndpoint(USER_SETTINGS_URL)
    }

    async getUserSettings(userId) {
        try {
            console.log('Fetching user settings for:', userId)

            const allSettings = await this.userSettingsEndpoint.getAll()
            console.log('All settings retrieved:', allSettings)

            const userSettings = allSettings.find(settings => settings.user_id === userId || settings.userId === userId)
            console.log('Found user settings:', userSettings)

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