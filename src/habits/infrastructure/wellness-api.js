import apiClient from '@/shared/infrastructure/base-api'

function mapWellnessExercise(data) {
    return {
        id: data.id,
        type: data.type,
        name: data.name,
        description: data.description,
        durationSeconds: data.duration_seconds,
        inhaleSeconds: data.inhale_seconds,
        holdSeconds: data.hold_seconds,
        exhaleSeconds: data.exhale_seconds,
        holdAfterExhaleSeconds: data.hold_after_exhale_seconds,
        cycles: data.cycles,
        audioUrl: data.audio_url,
        sortOrder: data.sort_order
    }
}

export class WellnessApiService {
    async stressCheck() {
        try {
            const response = await apiClient.post('/wellness/stress-check')
            return response.data
        } catch (error) {
            console.error('Error performing stress check:', error)
            throw error
        }
    }

    async getExercises(type) {
        try {
            const response = await apiClient.get('/wellness/exercises', { params: type ? { type } : {} })
            return Array.isArray(response.data) ? response.data.map(mapWellnessExercise) : []
        } catch (error) {
            console.error('Error fetching wellness exercises:', error)
            throw error
        }
    }
}

export const WellnessAPI = new WellnessApiService()
