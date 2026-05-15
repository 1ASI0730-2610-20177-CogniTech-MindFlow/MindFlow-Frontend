export class JournalEntry {
    constructor({ id, date, title, content, sentiment, tag }) {
        this.id = id
        this.date = date
        this.title = title
        this.content = content
        this.sentiment = sentiment // 'positive' | 'neutral' | 'negative'
        this.tag = tag // Trabajo, Estudios, Familia, etc.
    }
}
