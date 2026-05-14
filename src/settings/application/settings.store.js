import { defineStore } from 'pinia'
import { SettingsApiService } from '../infrastructure/settings-api'
import { Profile } from '../domain/model/profile.entity'

const api = new SettingsApiService()

export const useSettingsStore = defineStore('settings', {
    state: () => ({
        profile: null,
        isLoading: false
    }),
    actions: {
        async fetchProfile(userId) {
            if (!userId) {
                console.error('Error Crítico: Se intentó cargar el perfil sin proporcionar un userId.');
                return;
            }

            this.isLoading = true
            try {
                const data = await api.getById(userId)
                this.profile = new Profile({
                    id: data.id,
                    name: data.name,
                    email: data.email,
                    occupation: data.occupation,
                    isPremium: data.is_premium
                })
            } catch (error) {
                console.error('Error al cargar perfil:', error)
            } finally {
                this.isLoading = false
            }
        },
        async updateProfile() {
            try {
                await api.update(this.profile.id, {
                    name: this.profile.name,
                    email: this.profile.email,
                    occupation: this.profile.occupation,
                    is_premium: this.profile.isPremium
                })
                alert('Cambios guardados con éxito')
            } catch (error) {
                console.error('Error al guardar:', error)
            }
        }
    }
})