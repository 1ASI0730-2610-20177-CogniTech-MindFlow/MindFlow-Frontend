  import { defineStore } from 'pinia'

export const useJournalStore = defineStore('journal', {
    state: () => ({
        entries: [
            {
                id: 1,
                date: '2024-03-10',
                title: 'Entrada de prueba',
                content: 'Hoy hice algo interesante...'
            }
        ]
    }),

    actions: {},

    getters: {
        getEntriesByDate: (state) => (date) => {
            const d = date.toISOString().substr(0, 10)
            return state.entries.filter(e => e.date === d)
        }
    }
})
