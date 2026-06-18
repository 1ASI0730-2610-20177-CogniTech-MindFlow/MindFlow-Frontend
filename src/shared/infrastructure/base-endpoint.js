import apiClient from './base-api'
export class BaseEndpoint {
  constructor(resource) {
    this.resource = resource
  }
  getUrl(id = '') {
    const isAbsoluteUrl = /^https?:\/\//i.test(this.resource)
    const basePath = this.resource.replace(/\/$/, '')

    if (isAbsoluteUrl) {
      return id ? `${basePath}/${id}` : basePath
    }

    return id ? `/${basePath}/${id}` : `/${basePath}`
  }
  async getAll(params = {}) {
    try {
      const response = await apiClient.get(this.getUrl(), { params })
      return response.data
    } catch (error) {
      console.error(`Error fetching ${this.resource}:`, error)
      throw error
    }
  }
  async getById(id) {
    try {
      const response = await apiClient.get(this.getUrl(id))
      return response.data
    } catch (error) {
      console.error(`Error fetching ${this.resource}/${id}:`, error)
      throw error
    }
  }
  async create(data) {
    try {
      const response = await apiClient.post(this.getUrl(), data)
      return response.data
    } catch (error) {
      console.error(`Error creating ${this.resource}:`, error)
      throw error
    }
  }
  async update(id, data) {
    try {
      const response = await apiClient.put(this.getUrl(id), data)
      return response.data
    } catch (error) {
      console.error(`Error updating ${this.resource}/${id}:`, error)
      throw error
    }
  }
  async delete(id) {
    try {
      const response = await apiClient.delete(this.getUrl(id))
      return response.data
    } catch (error) {
      console.error(`Error deleting ${this.resource}/${id}:`, error)
      throw error
    }
  }
  async search(filters) {
    try {
      const response = await apiClient.get(this.getUrl(), { params: filters })
      return response.data
    } catch (error) {
      console.error(`Error searching ${this.resource}:`, error)
      throw error
    }
  }
}
