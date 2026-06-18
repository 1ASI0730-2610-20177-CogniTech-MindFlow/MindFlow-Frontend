import { defineStore } from 'pinia'
import { SettingsAPI } from '../infrastructure/settings-api'
import { Profile } from '../domain/model/profile.entity'
import { UserSettings } from '../domain/model/user-settings.entity'
import { SessionManager } from '@/iam/infrastructure/session-manager'

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
                const email = SessionManager.getUserEmail()
                const name = SessionManager.getUserName()
                this.profile = Profile.fromJSON({
                    id: userId,
                    email: email,
                    name: name
                })

                try {
                    const pinStatus = await SettingsAPI.getPinStatus()
                    this.createDefaultUserSettings(userId)
                    if (this.userSettings) {
                        this.userSettings.pinLockEnabled = pinStatus.has_pin || false
                    }
                } catch (settingsError) {
                    console.warn('Could not load PIN status, using defaults:', settingsError)
                    this.createDefaultUserSettings(userId)
                }

                this.initDarkMode()
            } catch (error) {
                console.error('Error al cargar perfil:', error)
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
                const updated = await SettingsAPI.updateProfile({
                    name: this.profile.name,
                    occupation: this.profile.occupation
                })
                this.profile = Profile.fromJSON(updated)
                SessionManager.setUserName(updated.name)
                SessionManager.setUserEmail(updated.email)
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
                if (this.userSettings.pinLockEnabled) {
                    const status = await SettingsAPI.getPinStatus()
                    if (!status.has_pin) {
                        console.warn('PIN lock enabled but no PIN set')
                    }
                }
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

        async setPinLockEnabled(enabled) {
            if (this.userSettings) {
                this.userSettings.pinLockEnabled = enabled
                if (!enabled) {
                    try {
                        await SettingsAPI.removePin()
                    } catch (error) {
                        console.error('Error removing PIN:', error)
                    }
                }
            }
        },

        setHabitRemindersEnabled(enabled) {
            if (this.userSettings) {
                this.userSettings.habitRemindersEnabled = enabled
            }
        },

        setReminderTime(time) {
            if (this.userSettings) {
                this.userSettings.reminderTime = time
            }
        },

        setLanguage(languageCode) {
            if (this.userSettings) {
                if (UserSettings.getSupportedLanguages().includes(languageCode)) {
                    this.userSettings.language = languageCode
                } else {
                    console.error(`Idioma no soportado: ${languageCode}`)
                }
            }
        },

        setTimezone(timezone) {
            if (this.profile) {
                this.profile.timezone = timezone
            }
        },

        async deleteAccount() {
            if (!this.profile) return

            try {
                await SettingsAPI.deleteAccount()

                localStorage.removeItem('mindflow-theme')
                SessionManager.clear()

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
            }
        }
    }
})
