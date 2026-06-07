import { BaseEndpoint } from '@/shared/infrastructure/base-endpoint'
import { JournalEntry } from '@/journal/domain/model/journal-entry.entity'

const JOURNAL_ENTRIES_URL = 'journalEntries'
const JOURNAL_ENTRY_TAGS_URL = 'journalEntryTags'
const JOURNAL_TAGS_URL = 'tags'
const JOURNAL_MEDIA_URL = 'media'

function mapJournalEntryTag(data) {
    return { id: data.id, entryId: data.entry_id, tagId: data.tag_id }
}

function mapJournalTag(data) {
    return { id: data.id, name: data.name }
}

function mapJournalMedia(data) {
    return { id: data.id, entryId: data.entry_id, url: data.url, type: data.type, createdAt: data.created_at || null }
}

function toJournalEntryTagJSON(relation) {
    return { id: relation.id, entry_id: relation.entryId ?? relation.entry_id, tagId: relation.tagId ?? relation.tag_id }
}

function toArray(value) {
    return Array.isArray(value) ? value : []
}

export class JournalApiService extends BaseEndpoint {
    constructor() {
        super(JOURNAL_ENTRIES_URL)
        this.entryTagsEndpoint = new BaseEndpoint(JOURNAL_ENTRY_TAGS_URL)
        this.tagsEndpoint = new BaseEndpoint(JOURNAL_TAGS_URL)
        this.mediaEndpoint = new BaseEndpoint(JOURNAL_MEDIA_URL)
    }

    async loadRelations() {
        const [entryTagsResult, tagsResult, mediaResult] = await Promise.allSettled([
            this.entryTagsEndpoint.getAll(),
            this.tagsEndpoint.getAll(),
            this.mediaEndpoint.getAll()
        ])

        const entryTags = entryTagsResult.status === 'fulfilled'
            ? toArray(entryTagsResult.value).map(mapJournalEntryTag)
            : []

        const tags = tagsResult.status === 'fulfilled'
            ? toArray(tagsResult.value).map(mapJournalTag)
            : []

        const media = mediaResult.status === 'fulfilled'
            ? toArray(mediaResult.value).map(mapJournalMedia)
            : []

        return { entryTags, tags, media }
    }

    async enrichEntries(entries) {
        if (!Array.isArray(entries)) return []
        const { entryTags, tags, media } = await this.loadRelations()
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

    async getAll() {
        try {
            const data = await super.getAll()
            return await this.enrichEntries(data)
        } catch (error) {
            console.error('Error fetching journal entries:', error)
            return []
        }
    }

    async getById(id) {
        try {
            const data = await super.getById(id)
            const [entry] = await this.enrichEntries([data])
            return entry
        } catch (error) {
            console.error(`Error fetching journal entry ${id}:`, error)
            throw error
        }
    }

    async getByUserId(userId) {
        try {
            const data = await this.search({ user_id: userId })
            const filtered = Array.isArray(data)
                ? data.filter(item => String(item.user_id) === String(userId) || String(item.userId) === String(userId))
                : []
            return await this.enrichEntries(filtered)
        } catch (error) {
            console.error(`Error fetching journal entries for user ${userId}:`, error)
            return []
        }
    }

    async search(filters) {
        try {
            const data = await super.search(filters)
            return await this.enrichEntries(data)
        } catch (error) {
            console.error('Error searching journal entries:', error)
            return []
        }
    }

    async save(entry) {
        try {
            const payload = entry instanceof JournalEntry ? entry.toJSON() : entry
            const response = await super.create(payload)
            return JournalEntry.fromJSON(response)
        } catch (error) {
            console.error('Error saving journal entry:', error)
            throw error
        }
    }

    async update(id, entry) {
        try {
            const payload = entry instanceof JournalEntry ? entry.toJSON() : entry
            const response = await super.update(id, payload)
            return JournalEntry.fromJSON(response)
        } catch (error) {
            console.error('Error updating journal entry:', error)
            throw error
        }
    }

    async delete(id) {
        try {
            return await super.delete(id)
        } catch (error) {
            console.error('Error deleting journal entry:', error)
            throw error
        }
    }
}

export class JournalEntryTagsApiService extends BaseEndpoint {
    constructor() {
        super(JOURNAL_ENTRY_TAGS_URL)
    }

    async getAll() {
        try {
            const data = await super.getAll()
            return Array.isArray(data) ? data.map(mapJournalEntryTag) : []
        } catch (error) {
            console.error('Error fetching journal entry tags:', error)
            return []
        }
    }

    async getByEntryId(entryId) {
        try {
            const data = await this.search({ entry_id: entryId })
            return Array.isArray(data) ? data.map(mapJournalEntryTag) : []
        } catch (error) {
            console.error(`Error fetching tags for journal entry ${entryId}:`, error)
            return []
        }
    }

    async save(relation) {
        try {
            const payload = toJournalEntryTagJSON(relation)
            const response = await super.create(payload)
            return mapJournalEntryTag(response)
        } catch (error) {
            console.error('Error saving journal entry tag relation:', error)
            throw error
        }
    }

    async update(id, relation) {
        try {
            const payload = toJournalEntryTagJSON(relation)
            const response = await super.update(id, payload)
            return mapJournalEntryTag(response)
        } catch (error) {
            console.error(`Error updating journal entry tag relation ${id}:`, error)
            throw error
        }
    }

    async delete(id) {
        try {
            return await super.delete(id)
        } catch (error) {
            console.error(`Error deleting journal entry tag relation ${id}:`, error)
            throw error
        }
    }
}

export class JournalTagsApiService extends BaseEndpoint {
    constructor() {
        super(JOURNAL_TAGS_URL)
    }

    async getAll() {
        try {
            const data = await super.getAll()
            return Array.isArray(data) ? data.map(mapJournalTag) : []
        } catch (error) {
            console.error('Error fetching journal tags:', error)
            return []
        }
    }
}

export class JournalMediaApiService extends BaseEndpoint {
    constructor() {
        super(JOURNAL_MEDIA_URL)
    }

    async getAll() {
        try {
            const data = await super.getAll()
            return Array.isArray(data) ? data.map(mapJournalMedia) : []
        } catch (error) {
            console.error('Error fetching journal media:', error)
            return []
        }
    }

    async getByEntryId(entryId) {
        try {
            const data = await this.search({ entry_id: entryId })
            return Array.isArray(data) ? data.map(mapJournalMedia) : []
        } catch (error) {
            console.error(`Error fetching media for journal entry ${entryId}:`, error)
            return []
        }
    }

    async create(mediaData) {
        try {
            const response = await super.create({
                entry_id: mediaData.entryId ?? mediaData.entry_id,
                url: mediaData.url,
                type: mediaData.type,
                created_at: new Date().toISOString()
            })
            return mapJournalMedia(response)
        } catch (error) {
            console.error('Error creating journal media:', error)
            throw error
        }
    }
}

export const JournalAPI = new JournalApiService()
export const JournalEntryTagsAPI = new JournalEntryTagsApiService()
export const JournalTagsAPI = new JournalTagsApiService()
export const JournalMediaAPI = new JournalMediaApiService()