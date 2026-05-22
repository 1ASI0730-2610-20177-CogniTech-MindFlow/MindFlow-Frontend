import apiClient from './base-api'
export class BaseEndpoint {
  constructor(resource) {
    this.resource = resource
  }
  async getAll(params = {}) {
    try {
      const response = await apiClient.get(`/${this.resource}`, { params })
      return response.data
    } catch (error) {
      console.error(`Error fetching ${this.resource}:`, error)
      throw error
    }
  }
  async getById(id) {
    try {
      const response = await apiClient.get(`/${this.resource}/${id}`)
      return response.data
    } catch (error) {
      console.error(`Error fetching ${this.resource}/${id}:`, error)
      throw error
    }
  }
  async create(data) {
    try {
      const response = await apiClient.post(`/${this.resource}`, data)
      return response.data
    } catch (error) {
      console.error(`Error creating ${this.resource}:`, error)
      throw error
    }
  }
  async update(id, data) {
    try {
      const response = await apiClient.put(`/${this.resource}/${id}`, data)
      return response.data
    } catch (error) {
      console.error(`Error updating ${this.resource}/${id}:`, error)
      throw error
    }
  }
  async delete(id) {
    try {
      const response = await apiClient.delete(`/${this.resource}/${id}`)
      return response.data
    } catch (error) {
      console.error(`Error deleting ${this.resource}/${id}:`, error)
      throw error
    }
  }
  async search(filters) {
    try {
      const response = await apiClient.get(`/${this.resource}`, { params: filters })
      return response.data
    } catch (error) {
      console.error(`Error searching ${this.resource}:`, error)
      throw error
    }
  }
}
export default BaseEndpoint
