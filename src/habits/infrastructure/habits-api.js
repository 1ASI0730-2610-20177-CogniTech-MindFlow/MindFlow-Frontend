import { BaseEndpoint } from '@/shared/infrastructure/base-endpoint.js'
import { Habit } from '../domain/model/habit.entity.js'

const HABITS_URL = 'habits'

function mapHabit(data) {
    return Habit.fromJSON(data)
}

function toHabitJSON(habit) {
    return habit instanceof Habit ? habit.toJSON() : Habit.fromJSON(habit).toJSON()
}

export class HabitsApiService extends BaseEndpoint {
    constructor() {
        super(HABITS_URL)
    }

    async getAll() {
        try {
            const data = await super.getAll()
            return Array.isArray(data) ? data.map(mapHabit) : []
        } catch (error) {
            console.error('Error fetching habits:', error)
            return []
        }
    }

    async getByUserId(userId) {
        try {
            const data = await this.search({ userId })
            if (!Array.isArray(data)) return []
            return data.map(mapHabit)
        } catch (error) {
            console.error(`Error fetching habits for user ${userId}:`, error)
            return []
        }
    }

    async create(habit) {
        try {
            const response = await super.create(toHabitJSON(habit))
            return mapHabit(response)
        } catch (error) {
            console.error('Error creating habit:', error)
            throw error
        }
    }

    async update(id, habit) {
        try {
            const response = await super.update(id, toHabitJSON(habit))
            return mapHabit(response)
        } catch (error) {
            console.error(`Error updating habit ${id}:`, error)
            throw error
        }
    }

    async delete(id) {
        try {
            return await super.delete(id)
        } catch (error) {
            console.error(`Error deleting habit ${id}:`, error)
            throw error
        }
    }
}

export const HabitsAPI = new HabitsApiService()
