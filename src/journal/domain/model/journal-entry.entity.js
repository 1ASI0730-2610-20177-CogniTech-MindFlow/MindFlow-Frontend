export class JournalEntry {
    constructor({
        id,
        userId,
        date,
        title,
        content,
        sentiment,
        category,
        aiResponse = null,
        hasPreview,
        createdAt,
        updatedAt,
        deletedAt,
        tags = [],
        media = [],
        pendingSync = false
    }) {
        this.id = id
        this.userId = userId
        this.date = date
        this.title = title
        this.content = content
        this.sentiment = sentiment
        this.category = category
        this.aiResponse = aiResponse
        this.hasPreview = hasPreview || false
        this.createdAt = createdAt || null
        this.updatedAt = updatedAt || null
        this.deletedAt = deletedAt || null
        this.tags = Array.isArray(tags) ? tags : []
        this.media = Array.isArray(media) ? media : []
        this.pendingSync = Boolean(pendingSync)
    }

    get formattedDate() {
        const [year, month, day] = this.date.split('-')
        const dateObj = new Date(year, parseInt(month) - 1, day)
        const locale = typeof localStorage !== 'undefined' ? localStorage.getItem('mindflow-lang') || 'es' : 'es'
        return dateObj.toLocaleDateString(locale, { weekday: 'long', day: 'numeric', month: 'long' })
    }

    static fromJSON(data) {
        return new JournalEntry({
            id: data.id,
            userId: data.userId ?? data.user_id,
            date: data.date,
            title: data.title,
            content: data.content,
            sentiment: data.sentiment || 'neutral',
            category: data.category || 'Sin categoría',
            aiResponse: data.ai_response ?? data.aiResponse ?? null,
            hasPreview: data.hasPreview || false,
            createdAt: data.created_at || data.createdAt || null,
            updatedAt: data.updated_at || data.updatedAt || null,
            deletedAt: data.deleted_at || data.deletedAt || null,
            tags: data.tags || [],
            media: data.media || []
        })
    }

    toJSON() {
        return {
            date: this.date,
            title: this.title,
            content: this.content,
            sentiment: this.sentiment,
            category: this.category
        }
    }
}
