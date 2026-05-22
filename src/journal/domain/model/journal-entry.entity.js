export class JournalEntry {
    constructor({
        id,
        userId,
        date,
        title,
        content,
        sentiment,
        category,
        hasPreview
    }) {
        this.id = id
        this.userId = userId
        this.date = date
        this.title = title
        this.content = content
        this.sentiment = sentiment
        this.category = category
        this.hasPreview = hasPreview || false
    }

    get formattedDate() {
        const [year, month, day] = this.date.split('-')
        const dateObj = new Date(year, parseInt(month) - 1, day)
        
        const daysOfWeek = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
        const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
        
        const dayName = daysOfWeek[dateObj.getDay()]
        const monthName = months[dateObj.getMonth()]
        
        return `${dayName}, ${parseInt(day)} de ${monthName}`
    }

    static fromJSON(data) {
        return new JournalEntry({
            id: data.id,
            userId: data.user_id,
            date: data.date,
            title: data.title,
            content: data.content,
            sentiment: data.sentiment || 'neutral',
            category: data.category || 'Sin categoría',
            hasPreview: data.hasPreview || false
        })
    }

    toJSON() {
        return {
            id: this.id,
            user_id: this.userId,
            date: this.date,
            title: this.title,
            content: this.content,
            sentiment: this.sentiment,
            category: this.category,
            hasPreview: this.hasPreview
        }
    }
}
