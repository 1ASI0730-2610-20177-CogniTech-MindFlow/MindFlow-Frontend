import apiClient from '@/shared/infrastructure/base-api.js'

export class MoodCalendarEndpoint {
    async get(year, month) {
        const params = {}
        if (year) params.year = year
        if (month) params.month = month
        const response = await apiClient.get('/moodCalendar', { params })
        return response.data
    }
}

export const moodCalendarApi = new MoodCalendarEndpoint()
