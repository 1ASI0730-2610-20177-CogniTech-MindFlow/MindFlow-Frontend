export class JournalEntry {
    constructor({ id, time, text, tag }) {
        this.id = id || Date.now();
        this.time = time || 'Justo ahora';
        this.text = text;
        this.tag = tag;
    }
}

export class DailyHabit {
    constructor({ id, title, completed, streak }) {
        this.id = id;
        this.title = title;
        this.completed = completed || false;
        this.streak = streak || 0;
    }
}