import apiClient from '../../shared/infrastructure/base-api'

export const dashboardApi = {
  async getCurrentMood() {
    try {
      const response = await apiClient.get('/dashboard/mood')
      return response.data
    } catch (error) {
      // Mock data for development
      return {
        moodScore: 8,
        sentimentLabel: 'Positivo',
        aiMessage: 'Me alegra ver que te sientes bien hoy. Mantén esa energía positiva y recuerda cuidar de ti mismo. 😊'
      }
    }
  },

  async getHabitStreak() {
    try {
      const response = await apiClient.get('/dashboard/streak')
      return response.data
    } catch (error) {
      // Mock data for development
      return { streak: 7 }
    }
  },

  async getTodayHabits() {
    try {
      const response = await apiClient.get('/dashboard/habits/today')
      return response.data
    } catch (error) {
      // Mock data for development
      return [
        { id: 1, name: 'Meditar 10 minutos', completed: true },
        { id: 2, name: 'Hacer ejercicio', completed: false },
        { id: 3, name: 'Escribir en el diario', completed: false },
        { id: 4, name: 'Beber 8 vasos de agua', completed: true }
      ]
    }
  },

  async getWeeklySummary() {
    try {
      const response = await apiClient.get('/dashboard/summary/weekly')
      return response.data
    } catch (error) {
      // Mock data for development
      return {
        summary: 'Esta semana has mostrado una tendencia positiva en tu estado de ánimo. Has completado el 85% de tus hábitos diarios y has mantenido una racha constante. Sigue así, estás haciendo un gran trabajo cuidando de tu bienestar emocional. 💪'
      }
    }
  },

  async getTrendData() {
    try {
      const response = await apiClient.get('/dashboard/trend')
      return response.data
    } catch (error) {
      // Mock data for development
      const days = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
      return days.map((day) => ({
        dayLabel: day,
        moodScore: Math.floor(Math.random() * 4) + 6
      }))
    }
  },

  async toggleHabitCompletion(habitId, completed) {
    try {
      const response = await apiClient.patch(`/dashboard/habits/${habitId}`, { completed })
      return response.data
    } catch (error) {
      // Mock success for development
      return { success: true }
    }
  }
}
