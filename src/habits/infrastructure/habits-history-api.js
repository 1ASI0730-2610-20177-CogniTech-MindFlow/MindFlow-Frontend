import { BaseEndpoint } from '@/shared/infrastructure/base-endpoint.js'
import { HabitCompletionLog } from '../domain/model/habit-history.entity.js'

const HABIT_LOGS_URL = 'habit-logs'

function mapHabitLog(data) {
    return HabitCompletionLog.fromJSON(data)
}

function toHabitLogJSON(log) {
    const payload = log instanceof HabitCompletionLog ? log.toJSON() : HabitCompletionLog.fromJSON(log).toJSON()

    if (payload.id == null) {
        delete payload.id
    }

    return payload
}

export class HabitsHistoryApiService extends BaseEndpoint {
    constructor() {
        super(HABIT_LOGS_URL)
    }

    async getAll() {
        try {
            const data = await super.getAll()
            return Array.isArray(data) ? data.map(mapHabitLog) : []
        } catch (error) {
            console.error('Error fetching habit logs:', error)
            return []
        }
    }

    async getByHabitId(habitId) {
        try {
            const data = await this.search({ habitId })
            return Array.isArray(data) ? data.map(mapHabitLog) : []
        } catch (error) {
            console.error(`Error fetching habit logs for habit ${habitId}:`, error)
            return []
        }
    }

    async create(log) {
        try {
            const response = await super.create(toHabitLogJSON(log))
            return mapHabitLog(response)
        } catch (error) {
            console.error('Error creating habit log:', error)
            throw error
        }
    }

    async update(id, log) {
        try {
            const response = await super.update(id, toHabitLogJSON(log))
            return mapHabitLog(response)
        } catch (error) {
            console.error(`Error updating habit log ${id}:`, error)
            throw error
        }
    }

    async delete(id) {
        try {
            return await super.delete(id)
        } catch (error) {
            console.error(`Error deleting habit log ${id}:`, error)
            throw error
        }
    }
}

export const HabitsHistoryAPI = new HabitsHistoryApiService()
