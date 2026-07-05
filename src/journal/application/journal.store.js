import { defineStore } from 'pinia'
import { JournalAPI } from '@/journal/infrastructure/journal-api'
import { JournalEntry } from '@/journal/domain/model/journal-entry.entity'

export const useJournalStore = defineStore('journal', {
    state: () => ({
        entries: [],
        isLoading: false,
        error: null,
        selectedCategory: 'all',
        selectedSentiment: 'all',
        selectedDate: '',
        searchQuery: ''
    }),

    actions: {
        async fetchEntries(query = '') {
            this.isLoading = true
            try {
                const params = {}
                if (query) params.q = query
                this.entries = await JournalAPI.getAll(params)
                this.error = null
            } catch (error) {
                this.error = error.message
                console.error('Error loading entries:', error)
            } finally {
                this.isLoading = false
            }
        },

        async addEntry(entryData) {
            try {
                const entry = new JournalEntry(entryData)
                const savedEntry = await JournalAPI.save(entry)
                this.entries.push(savedEntry)
                return savedEntry
            } catch (error) {
                this.error = error.message
                throw error
            }
        },

        async updateEntry(id, entryData) {
            try {
                const entry = new JournalEntry(entryData)
                const updatedEntry = await JournalAPI.update(id, entry)
                const index = this.entries.findIndex(e => e.id === id)
                if (index !== -1) {
                    this.entries[index] = updatedEntry
                }
                return updatedEntry
            } catch (error) {
                this.error = error.message
                throw error
            }
        },

        async deleteEntry(id) {
            try {
                await JournalAPI.delete(id)
                this.entries = this.entries.filter(e => e.id !== id)
            } catch (error) {
                this.error = error.message
                throw error
            }
        },

        setSelectedCategory(category) {
            this.selectedCategory = category
        },

        setSelectedSentiment(sentiment) {
            this.selectedSentiment = sentiment
        },

        setSelectedDate(date) {
            this.selectedDate = date
        },

        setSearchQuery(query) {
            this.searchQuery = query
        }
    },

    getters: {
        getEntriesByDate: (state) => (date) => {
            let dateStr = date
            if (typeof date !== 'string') {
                const pad = (n) => String(n).padStart(2, '0')
                dateStr = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
            }
            return state.entries.filter(e => e.date === dateStr)
        },

        getEntriesByMonth: (state) => (year, month) => {
            const monthStr = String(month + 1).padStart(2, '0')
            const prefix = `${year}-${monthStr}`
            return state.entries.filter(e => e.date.startsWith(prefix))
        },

        getFilteredEntries: (state) => {
            let filtered = [...state.entries]

            if (state.selectedCategory !== 'all') {
                filtered = filtered.filter(e => e.category === state.selectedCategory)
            }

            if (state.selectedSentiment !== 'all') {
                filtered = filtered.filter(e => e.sentiment === state.selectedSentiment)
            }

            if (state.selectedDate) {
                filtered = filtered.filter(e => e.date === state.selectedDate)
            }

            if (state.searchQuery) {
                const query = state.searchQuery.toLowerCase()
                filtered = filtered.filter(e =>
                    (e.title || '').toLowerCase().includes(query) ||
                    (e.content || '').toLowerCase().includes(query) ||
                    (e.category || '').toLowerCase().includes(query) ||
                    (e.tags || []).some(tag => (tag.name || '').toLowerCase().includes(query))
                )
            }

            filtered.sort((a, b) => {
                const dateA = (a.date || '').toString()
                const dateB = (b.date || '').toString()
                if (dateA === dateB) {
                    if (a.id == null || b.id == null) return 0
                    return a.id.toString().localeCompare(b.id.toString())
                }
                return dateB.localeCompare(dateA)
            })

            return filtered
        },

        getEntriesBySentiment: (state) => {
            const result = {}
            state.entries.forEach(entry => {
                if (!result[entry.sentiment]) {
                    result[entry.sentiment] = []
                }
                result[entry.sentiment].push(entry)
            })
            return result
        },

        getCalendarData: (state) => (year, month) => {
            const monthStr = String(month).padStart(2, '0')
            const monthEntries = state.entries.filter(e =>
                e.date.startsWith(`${year}-${monthStr}`)
            )

            const dayMoods = {}
            monthEntries.forEach(entry => {
                const day = entry.date.split('-')[2]
                dayMoods[day] = entry.sentiment
            })
            return dayMoods
        }
    }
})
