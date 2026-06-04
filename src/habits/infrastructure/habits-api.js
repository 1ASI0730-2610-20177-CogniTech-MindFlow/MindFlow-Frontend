import { BaseEndpoint } from '@/shared/infrastructure/base-endpoint.js'
import { Habit } from '../domain/model/habit.entity.js'

const HABITS_URL = 'habits'

const habitsEndpoint = new BaseEndpoint(HABITS_URL)

const mapHabit = (data) => Habit.fromJSON(data)

const toHabitJSON = (habit) => (habit instanceof Habit ? habit.toJSON() : Habit.fromJSON(habit).toJSON())

export const HabitsAPI = {
    async getAll() {
        try {
            const data = await habitsEndpoint.getAll()
            return Array.isArray(data) ? data.map(mapHabit) : []
        } catch (error) {
            console.error('Error fetching habits:', error)
            return []
        }
    },

    async getByUserId(userId) {
        try {
            const data = await habitsEndpoint.search({ user_id: userId })
            if (!Array.isArray(data)) return []
            return data
                .filter(item => String(item.user_id) === String(userId) || String(item.userId) === String(userId))
                .map(mapHabit)
        } catch (error) {
            console.error(`Error fetching habits for user ${userId}:`, error)
            return []
        }
    },

    async create(habit) {
        try {
            const response = await habitsEndpoint.create(toHabitJSON(habit))
            return mapHabit(response)
        } catch (error) {
            console.error('Error creating habit:', error)
            throw error
        }
    },

    async update(id, habit) {
        try {
            const response = await habitsEndpoint.update(id, toHabitJSON(habit))
            return mapHabit(response)
        } catch (error) {
            console.error(`Error updating habit ${id}:`, error)
            throw error
        }
    },

    async delete(id) {
        try {
            return await habitsEndpoint.delete(id)
        } catch (error) {
            console.error(`Error deleting habit ${id}:`, error)
            throw error
        }
    }
}
