import { defineStore } from 'pinia'
import { JournalAPI } from '@/journal/infrastructure/journal-api'
import { JournalEntry } from '@/journal/domain/model/journal-entry.entity'
import { JournalOfflineQueue } from '@/journal/infrastructure/journal-offline-queue'
import { useAuthStore } from '@/iam/application/auth.store.js'

function isNetworkError(error) {
    return !error?.response
}

export const useJournalStore = defineStore('journal', {
    state: () => ({
        entries: [],
        isLoading: false,
        isSyncing: false,
        error: null,
        lastConflict: null,
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
            const shouldQueueOffline = typeof navigator !== 'undefined' && !navigator.onLine

            if (!shouldQueueOffline) {
                try {
                    const entry = new JournalEntry(entryData)
                    const savedEntry = await JournalAPI.save(entry)
                    this.entries.push(savedEntry)
                    return savedEntry
                } catch (error) {
                    if (!isNetworkError(error)) {
                        this.error = error.message
                        throw error
                    }
                    // Sin respuesta del servidor (offline/red caída): se encola en vez de fallar.
                }
            }

            return this.queueEntryOffline(entryData)
        },

        async queueEntryOffline(entryData) {
            const authStore = useAuthStore()
            const clientId = crypto.randomUUID()
            const queueItem = {
                clientId,
                userId: authStore.currentUserId,
                date: entryData.date,
                title: entryData.title || '',
                content: entryData.content || '',
                sentiment: entryData.sentiment || 'neutral',
                category: entryData.category || 'Sin categoría',
                clientUpdatedAt: new Date().toISOString(),
                deleted: false
            }
            await JournalOfflineQueue.enqueue(queueItem)

            const localEntry = JournalEntry.fromJSON({
                id: clientId,
                user_id: queueItem.userId,
                date: queueItem.date,
                title: queueItem.title,
                content: queueItem.content,
                sentiment: queueItem.sentiment,
                category: queueItem.category
            })
            localEntry.pendingSync = true
            this.entries.push(localEntry)
            return localEntry
        },

        async syncPendingEntries() {
            const authStore = useAuthStore()
            const userId = authStore.currentUserId
            if (!userId) return

            const pending = await JournalOfflineQueue.getAllForUser(userId)
            if (pending.length === 0) return

            this.isSyncing = true
            try {
                const items = pending.map(({ clientId, date, title, content, sentiment, category, clientUpdatedAt, deleted }) => ({
                    client_id: clientId,
                    date,
                    title,
                    content,
                    sentiment,
                    category,
                    client_updated_at: clientUpdatedAt,
                    deleted
                }))

                const results = await JournalAPI.syncEntries(items)

                for (const result of results) {
                    const clientId = result.client_id
                    const index = this.entries.findIndex(e => String(e.id) === String(clientId))

                    if (result.action === 'deleted') {
                        if (index !== -1) this.entries.splice(index, 1)
                    } else if (result.entry) {
                        const syncedEntry = JournalEntry.fromJSON(result.entry)
                        if (index !== -1) {
                            this.entries.splice(index, 1, syncedEntry)
                        } else {
                            this.entries.push(syncedEntry)
                        }
                    } else if (index !== -1) {
                        this.entries.splice(index, 1)
                    }

                    if (result.action === 'conflict_kept_server') {
                        this.lastConflict = { clientId }
                    }

                    await JournalOfflineQueue.remove(clientId)
                }
            } catch (error) {
                console.error('Error syncing offline journal entries:', error)
            } finally {
                this.isSyncing = false
            }
        },

        clearConflict() {
            this.lastConflict = null
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
