import { defineStore } from 'pinia'
import { dashboardApi } from '../infrastructure/dashboard.endpoint'
import { JournalEntry, DailyHabit } from '../domain/model/dashboard.model'

export const useDashboardStore = defineStore('dashboard', {
    state: () => ({
        isLoading: false,
        isAnalyzing: false,
        aiFeedback: null,
        recentEntries: [
            new JournalEntry({ id: 1, time: 'Hace 3 horas', text: 'Siento que no avancé nada hoy. La procrastinación me está ganando...', tag: 'Estudios' }),
            new JournalEntry({ id: 2, time: 'Ayer, 9:00 PM', text: 'Hoy tuvimos la presentación del proyecto. Me sentí muy abrumado al principio...', tag: 'Trabajo' }),
            new JournalEntry({ id: 3, time: 'Lunes, 8:15 AM', text: 'Tuve una pequeña discusión en casa y me dejó con poca energía para empezar...', tag: 'Familia' })
        ],
        habits: [
            new DailyHabit({ id: 1, title: 'Beber 2L de agua', completed: true, streak: 5 }),
            new DailyHabit({ id: 2, title: 'Pausa activa (Estiramientos)', completed: false, streak: 2 }),
            new DailyHabit({ id: 3, title: 'Desconexión digital (9PM)', completed: false, streak: 0 })
        ]
    }),

    actions: {
        async submitJournalEntry(text, tag) {
            this.isAnalyzing = true
            this.aiFeedback = null

            try {
                const response = await dashboardApi.processJournalEntry(text, tag)

                const newEntry = new JournalEntry({ text, tag })
                this.recentEntries.unshift(newEntry)

                this.aiFeedback = response.aiFeedback

            } catch (error) {
                console.error("Error al procesar el registro con IA:", error)
                this.aiFeedback = "Hubo un problema al procesar tu registro. Por favor, intenta de nuevo."
            } finally {
                this.isAnalyzing = false
            }
        },

        toggleHabit(id) {
            const habit = this.habits.find(h => h.id === id)
            if (habit) {
                habit.completed = !habit.completed
                if (habit.completed) habit.streak++
                else habit.streak--
            }
        }
    }
})