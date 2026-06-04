import { BaseEndpoint } from '@/shared/infrastructure/base-endpoint.js'
import { HabitCompletionLog } from '../domain/model/habit-history.entity.js'

const HABIT_LOGS_URL = 'habitLogs'

const habitLogsEndpoint = new BaseEndpoint(HABIT_LOGS_URL)

const mapHabitLog = (data) => HabitCompletionLog.fromJSON(data)

const toHabitLogJSON = (log) => {
    const payload = log instanceof HabitCompletionLog ? log.toJSON() : HabitCompletionLog.fromJSON(log).toJSON()

    if (payload.id == null) {
        delete payload.id
    }

    return payload
}

export const HabitsHistoryAPI = {
    async getAll() {
        try {
            const data = await habitLogsEndpoint.getAll()
            return Array.isArray(data) ? data.map(mapHabitLog) : []
        } catch (error) {
            console.error('Error fetching habit logs:', error)
            return []
        }
    },

    async getByHabitId(habitId) {
        try {
            const data = await habitLogsEndpoint.search({ habit_id: habitId })
            return Array.isArray(data) ? data.map(mapHabitLog) : []
        } catch (error) {
            console.error(`Error fetching habit logs for habit ${habitId}:`, error)
            return []
        }
    },

    async create(log) {
        try {
            const response = await habitLogsEndpoint.create(toHabitLogJSON(log))
            return mapHabitLog(response)
        } catch (error) {
            console.error('Error creating habit log:', error)
            throw error
        }
    },

    async update(id, log) {
        try {
            const response = await habitLogsEndpoint.update(id, toHabitLogJSON(log))
            return mapHabitLog(response)
        } catch (error) {
            console.error(`Error updating habit log ${id}:`, error)
            throw error
        }
    },

    async delete(id) {
        try {
            return await habitLogsEndpoint.delete(id)
        } catch (error) {
            console.error(`Error deleting habit log ${id}:`, error)
            throw error
        }
    }
}
