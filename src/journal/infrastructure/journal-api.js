import { BaseEndpoint } from '@/shared/infrastructure/base-endpoint'
import { JournalEntry } from '@/journal/domain/model/journal-entry.entity'

const endpoint = new BaseEndpoint('journalEntries')

export const JournalAPI = {
    async getAll() {
        try {
            const data = await endpoint.getAll()
            return data.map(entry => JournalEntry.fromJSON(entry))
        } catch (error) {
            console.error('Error fetching journal entries:', error)
            return []
        }
    },

    async save(entry) {
        try {
            const payload = entry instanceof JournalEntry ? entry.toJSON() : entry
            const response = await endpoint.create(payload)
            return JournalEntry.fromJSON(response)
        } catch (error) {
            console.error('Error saving journal entry:', error)
            throw error
        }
    },

    async update(id, entry) {
        try {
            const payload = entry instanceof JournalEntry ? entry.toJSON() : entry
            const response = await endpoint.update(id, payload)
            return JournalEntry.fromJSON(response)
        } catch (error) {
            console.error('Error updating journal entry:', error)
            throw error
        }
    },

    async delete(id) {
        try {
            return await endpoint.delete(id)
        } catch (error) {
            console.error('Error deleting journal entry:', error)
            throw error
        }
    }
}
