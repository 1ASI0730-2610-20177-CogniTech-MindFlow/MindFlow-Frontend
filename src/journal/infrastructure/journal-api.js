const STORAGE_KEY = 'mindflow_journal_entries'

export const JournalAPI = {
    getAll() {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    },

    save(entry) {
        const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
        data.push(entry)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
        return entry
    }
}
