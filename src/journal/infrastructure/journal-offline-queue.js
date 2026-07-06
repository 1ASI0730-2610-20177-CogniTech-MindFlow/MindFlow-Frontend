import { openDB } from 'idb'

const DB_NAME = 'mindflow-offline'
const STORE_NAME = 'journal-sync-queue'
const DB_VERSION = 1

function getDb() {
    return openDB(DB_NAME, DB_VERSION, {
        upgrade(db) {
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'clientId' })
            }
        }
    })
}

export const JournalOfflineQueue = {
    async enqueue(item) {
        const db = await getDb()
        await db.put(STORE_NAME, item)
    },

    async getAllForUser(userId) {
        const db = await getDb()
        const all = await db.getAll(STORE_NAME)
        return all.filter((item) => String(item.userId) === String(userId))
    },

    async remove(clientId) {
        const db = await getDb()
        await db.delete(STORE_NAME, clientId)
    }
}
