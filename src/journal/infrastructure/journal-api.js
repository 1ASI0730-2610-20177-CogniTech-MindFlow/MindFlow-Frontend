import { BaseEndpoint } from '@/shared/infrastructure/base-endpoint'
import { JournalEntry } from '@/journal/domain/model/journal-entry.entity'

const JOURNAL_ENTRIES_URL = 'https://6a10f54a3e35d0f37ee2eb36.mockapi.io/journalEntries'
const JOURNAL_ENTRY_TAGS_URL = 'https://6a10f54a3e35d0f37ee2eb36.mockapi.io/journalEntryTags'
const JOURNAL_TAGS_URL = 'https://6a10f61b3e35d0f37ee2ebf7.mockapi.io/tags'
const JOURNAL_MEDIA_URL = 'https://6a10f61b3e35d0f37ee2ebf7.mockapi.io/media'

const journalEntriesEndpoint = new BaseEndpoint(JOURNAL_ENTRIES_URL)
const journalEntryTagsEndpoint = new BaseEndpoint(JOURNAL_ENTRY_TAGS_URL)
const journalTagsEndpoint = new BaseEndpoint(JOURNAL_TAGS_URL)
const journalMediaEndpoint = new BaseEndpoint(JOURNAL_MEDIA_URL)

const mapJournalEntryTag = (data) => ({
    id: data.id,
    entryId: data.entry_id,
    tagId: data.tag_id
})

const mapJournalTag = (data) => ({
    id: data.id,
    name: data.name
})

const mapJournalMedia = (data) => ({
    id: data.id,
    entryId: data.entry_id,
    url: data.url,
    type: data.type,
    createdAt: data.created_at || null
})

const toJournalEntryTagJSON = (relation) => ({
    id: relation.id,
    entry_id: relation.entryId ?? relation.entry_id,
    tagId: relation.tagId ?? relation.tag_id
})

const loadJournalRelations = async () => {
    const [entryTagsResult, tagsResult, mediaResult] = await Promise.allSettled([
        journalEntryTagsEndpoint.getAll(),
        journalTagsEndpoint.getAll(),
        journalMediaEndpoint.getAll()
    ])

    const entryTags = entryTagsResult.status === 'fulfilled'
        ? entryTagsResult.value.map(mapJournalEntryTag)
        : []

    const tags = tagsResult.status === 'fulfilled'
        ? tagsResult.value.map(mapJournalTag)
        : []

    const media = mediaResult.status === 'fulfilled'
        ? mediaResult.value.map(mapJournalMedia)
        : []

    return { entryTags, tags, media }
}

const enrichEntries = async (entries) => {
    const { entryTags, tags, media } = await loadJournalRelations()
    const tagsById = new Map(tags.map(tag => [tag.id, tag]))
    const mediaByEntryId = new Map()
    const tagsByEntryId = new Map()

    entryTags.forEach((relation) => {
        if (!tagsByEntryId.has(relation.entryId)) {
            tagsByEntryId.set(relation.entryId, [])
        }
        tagsByEntryId.get(relation.entryId).push(relation)
    })

    media.forEach((item) => {
        if (!mediaByEntryId.has(item.entryId)) {
            mediaByEntryId.set(item.entryId, [])
        }
        mediaByEntryId.get(item.entryId).push(item)
    })

    return entries.map((entry) => {
        const baseEntry = entry instanceof JournalEntry ? entry.toJSON() : entry
        const relations = tagsByEntryId.get(baseEntry.id) || []
        const resolvedTags = relations
            .map((relation) => tagsById.get(relation.tagId))
            .filter(Boolean)

        return JournalEntry.fromJSON({
            ...baseEntry,
            tags: resolvedTags,
            media: mediaByEntryId.get(baseEntry.id) || []
        })
    })
}

export const JournalAPI = {
    async getAll() {
        try {
            const data = await journalEntriesEndpoint.getAll()
            return await enrichEntries(data)
        } catch (error) {
            console.error('Error fetching journal entries:', error)
            return []
        }
    },

    async getById(id) {
        try {
            const data = await journalEntriesEndpoint.getById(id)
            const [entry] = await enrichEntries([data])
            return entry
        } catch (error) {
            console.error(`Error fetching journal entry ${id}:`, error)
            throw error
        }
    },

    async getByUserId(userId) {
        try {
            const data = await journalEntriesEndpoint.search({ user_id: userId })
            return await enrichEntries(data)
        } catch (error) {
            console.error(`Error fetching journal entries for user ${userId}:`, error)
            return []
        }
    },

    async search(filters) {
        try {
            const data = await journalEntriesEndpoint.search(filters)
            return await enrichEntries(data)
        } catch (error) {
            console.error('Error searching journal entries:', error)
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

export const JournalTagsAPI = {
    async getAll() {
        try {
            const data = await journalTagsEndpoint.getAll()
            return data.map(mapJournalTag)
        } catch (error) {
            console.error('Error fetching journal tags:', error)
            return []
        }
    }
}

export const JournalMediaAPI = {
    async getAll() {
        try {
            const data = await journalMediaEndpoint.getAll()
            return data.map(mapJournalMedia)
        } catch (error) {
            console.error('Error fetching journal media:', error)
            return []
        }
    },

    async getByEntryId(entryId) {
        try {
            const data = await journalMediaEndpoint.search({ entry_id: entryId })
            return data.map(mapJournalMedia)
        } catch (error) {
            console.error(`Error fetching media for journal entry ${entryId}:`, error)
            return []
        }
    }
}