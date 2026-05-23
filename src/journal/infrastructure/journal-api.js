import { BaseEndpoint } from '@/shared/infrastructure/base-endpoint'
import { JournalEntry } from '@/journal/domain/model/journal-entry.entity'

const JOURNAL_ENTRIES_URL = 'https://6a10f54a3e35d0f37ee2eb36.mockapi.io/journalEntries'
const JOURNAL_ENTRY_TAGS_URL = 'https://6a10f54a3e35d0f37ee2eb36.mockapi.io/journalEntryTags'

const journalEntriesEndpoint = new BaseEndpoint(JOURNAL_ENTRIES_URL)
const journalEntryTagsEndpoint = new BaseEndpoint(JOURNAL_ENTRY_TAGS_URL)

const mapJournalEntryTag = (data) => ({
    id: data.id,
    entryId: data.entry_id,
    tagId: data.tag_id
})

const toJournalEntryTagJSON = (relation) => ({
    id: relation.id,
    entry_id: relation.entryId ?? relation.entry_id,
    tag_id: relation.tagId ?? relation.tag_id
})

export const JournalAPI = {
    async getAll() {
        try {
            const data = await journalEntriesEndpoint.getAll()
            return data.map(entry => JournalEntry.fromJSON(entry))
        } catch (error) {
            console.error('Error fetching journal entries:', error)
            return []
        }
    },

    async getById(id) {
        try {
            const data = await journalEntriesEndpoint.getById(id)
            return JournalEntry.fromJSON(data)
        } catch (error) {
            console.error(`Error fetching journal entry ${id}:`, error)
            throw error
        }
    },

    async getByUserId(userId) {
        try {
            const data = await journalEntriesEndpoint.search({ user_id: userId })
            return data.map(entry => JournalEntry.fromJSON(entry))
        } catch (error) {
            console.error(`Error fetching journal entries for user ${userId}:`, error)
            return []
        }
    },

    async save(entry) {
        try {
            const payload = entry instanceof JournalEntry ? entry.toJSON() : entry
            const response = await journalEntriesEndpoint.create(payload)
            return JournalEntry.fromJSON(response)
        } catch (error) {
            console.error('Error saving journal entry:', error)
            throw error
        }
    },

    async update(id, entry) {
        try {
            const payload = entry instanceof JournalEntry ? entry.toJSON() : entry
            const response = await journalEntriesEndpoint.update(id, payload)
            return JournalEntry.fromJSON(response)
        } catch (error) {
            console.error('Error updating journal entry:', error)
            throw error
        }
    },

    async delete(id) {
        try {
            return await journalEntriesEndpoint.delete(id)
        } catch (error) {
            console.error('Error deleting journal entry:', error)
            throw error
        }
    }
}

export const JournalEntryTagsAPI = {
    async getAll() {
        try {
            const data = await journalEntryTagsEndpoint.getAll()
            return data.map(mapJournalEntryTag)
        } catch (error) {
            console.error('Error fetching journal entry tags:', error)
            return []
        }
    },

    async getByEntryId(entryId) {
        try {
            const data = await journalEntryTagsEndpoint.search({ entry_id: entryId })
            return data.map(mapJournalEntryTag)
        } catch (error) {
            console.error(`Error fetching tags for journal entry ${entryId}:`, error)
            return []
        }
    },

    async save(relation) {
        try {
            const payload = toJournalEntryTagJSON(relation)
            const response = await journalEntryTagsEndpoint.create(payload)
            return mapJournalEntryTag(response)
        } catch (error) {
            console.error('Error saving journal entry tag relation:', error)
            throw error
        }
    },

    async update(id, relation) {
        try {
            const payload = toJournalEntryTagJSON(relation)
            const response = await journalEntryTagsEndpoint.update(id, payload)
            return mapJournalEntryTag(response)
        } catch (error) {
            console.error(`Error updating journal entry tag relation ${id}:`, error)
            throw error
        }
    },

    async delete(id) {
        try {
            return await journalEntryTagsEndpoint.delete(id)
        } catch (error) {
            console.error(`Error deleting journal entry tag relation ${id}:`, error)
            throw error
        }
    }
}

