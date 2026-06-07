import { defineStore } from 'pinia'
import { SettingsApiService } from '../infrastructure/settings-api'
import { Profile } from '../domain/model/profile.entity'
import { UserSettings } from '../domain/model/user-settings.entity'

const api = new SettingsApiService()

export const useSettingsStore = defineStore('settings', {
    state: () => ({
        profile: null,
        userSettings: null,
        isLoading: false,
        darkMode: false,
        themeLockedByUser: false,
        currentUserId: null
    }),

    getters: {
        isDarkMode: (state) => state.darkMode,

        reminderConfig: (state) => ({
            enabled: state.userSettings?.habitRemindersEnabled ?? true,
            time: state.userSettings?.reminderTime ?? '09:00'
        }),

        isPinLockEnabled: (state) => state.userSettings?.pinLockEnabled ?? false
    },

    actions: {
        async fetchProfile(userId) {
            if (!userId) {
                console.error('Error Crítico: Se intentó cargar el perfil sin proporcionar un userId.')
                this.isLoading = false
                return
            }

            this.isLoading = true
            this.currentUserId = userId

            try {
                const userData = await api.getByUserId(userId)
                
                if (userData) {
                    this.profile = Profile.fromJSON(userData)
                }

                try {
                    const settingsData = await api.getUserSettings(userId)
                    
                    if (settingsData) {
                        this.userSettings = UserSettings.fromJSON(settingsData)
                    } else {
                        this.createDefaultUserSettings(userId)
                    }
                } catch (settingsError) {
                    console.warn('Could not load user settings, creating defaults:', settingsError)
                    this.createDefaultUserSettings(userId)
                }

                this.initDarkMode()
            } catch (error) {
                console.error('Error al cargar perfil:', error)
                if (!this.isLoading) {
                    this.isLoading = false
                }
            } finally {
                this.isLoading = false
            }
        },

        createDefaultUserSettings(userId) {
            this.userSettings = new UserSettings({
                id: `us-${userId}-${Date.now()}`,
                userId: userId,
                pinLockEnabled: false,
                habitRemindersEnabled: true,
                reminderTime: '09:00',
                language: 'es',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            })
        },

        async updateProfile() {
            if (!this.profile) {
                console.error('No profile loaded')
                return
            }

            try {
                await api.update(this.profile.id, {
                    name: this.profile.name,
                    email: this.profile.email,
                    occupation: this.profile.occupation,
                    is_premium: this.profile.isPremium,
                    timezone: this.profile.timezone,
                    dark_mode_enabled: this.profile.darkModeEnabled,
                    updated_at: new Date().toISOString()
                })

                console.log('Profile saved successfully')
            } catch (error) {
                console.error('Error al guardar perfil:', error)
            }
        },

        async updateUserSettings() {
            if (!this.userSettings) {
                console.error('No user settings loaded')
                return
            }

            try {
                if (!this.userSettings.isValidReminderTime()) {
                    console.error('Formato de hora inválido (debe ser HH:mm)')
                    return
                }

                await api.updateUserSettings(this.userSettings.id, {
                    pin_lock_enabled: this.userSettings.pinLockEnabled,
                    habit_reminders_enabled: this.userSettings.habitRemindersEnabled,
                    reminder_time: this.userSettings.reminderTime,
                    language: this.userSettings.language
                })

                console.log('Settings saved successfully')
            } catch (error) {
                console.error('Error al guardar configuraciones:', error)
            }
        },

        setDarkMode(enabled) {
            this.darkMode = enabled
            this.themeLockedByUser = true

            if (this.profile) {
                this.profile.darkModeEnabled = this.darkMode
            }

            if (this.darkMode) {
                document.documentElement.classList.add('dark-mode')
            } else {
                document.documentElement.classList.remove('dark-mode')
            }

            localStorage.setItem('mindflow-theme', this.darkMode ? 'dark' : 'light')

            if (this.profile) {
                this.updateProfile({ silent: true })
            }
        },

        toggleDarkMode() {
            this.setDarkMode(!this.darkMode)
        },

        initDarkMode() {
            if (this.themeLockedByUser) {
                return
            }

            let preferDarkMode = false

            if (this.profile && this.profile.darkModeEnabled) {
                preferDarkMode = true
            } else {
                const savedTheme = localStorage.getItem('mindflow-theme')
                if (savedTheme === 'dark') {
                    preferDarkMode = true
                } else if (savedTheme === 'light') {
                    preferDarkMode = false
                } else {
                    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                        preferDarkMode = true
                    }
                }
            }

            this.darkMode = preferDarkMode

            if (this.darkMode) {
                document.documentElement.classList.add('dark-mode')
            } else {
                document.documentElement.classList.remove('dark-mode')
            }

            localStorage.setItem('mindflow-theme', preferDarkMode ? 'dark' : 'light')
        },

        setPinLockEnabled(enabled) {
            if (this.userSettings) {
                this.userSettings.pinLockEnabled = enabled
                this.updateUserSettings({ silent: true })
            }
        },

        setHabitRemindersEnabled(enabled) {
            if (this.userSettings) {
                this.userSettings.habitRemindersEnabled = enabled
                this.updateUserSettings({ silent: true })
            }
        },

        setReminderTime(time) {
            if (this.userSettings) {
                this.userSettings.reminderTime = time
                this.updateUserSettings({ silent: true })
            }
        },

        setLanguage(languageCode) {
            if (this.userSettings) {
                if (UserSettings.getSupportedLanguages().includes(languageCode)) {
                    this.userSettings.language = languageCode
                    this.updateUserSettings({ silent: true })
                } else {
                    console.error(`Idioma no soportado: ${languageCode}`)
                }
            }
        },

        setTimezone(timezone) {
            if (this.profile) {
                this.profile.timezone = timezone
                this.updateProfile({ silent: true })
            }
        },

        async deleteAccount() {
            if (!this.profile) return

            try {
                await api.delete(this.profile.id)

                localStorage.removeItem('mindflow-theme')
                localStorage.removeItem('auth_token')

                this.profile = null
                this.userSettings = null
                this.currentUserId = null
                this.darkMode = false
                this.themeLockedByUser = false

                document.documentElement.classList.remove('dark-mode')
            } catch (error) {
                console.error('Error al eliminar cuenta:', error)
                throw error
            }
        },

        resetSettings() {
            if (this.userSettings) {
                this.userSettings.pinLockEnabled = false
                this.userSettings.habitRemindersEnabled = true
                this.userSettings.reminderTime = '09:00'
                this.userSettings.language = 'es'
                this.updateUserSettings()
                console.log('Settings reset to defaults')
            }
        }
    }
})