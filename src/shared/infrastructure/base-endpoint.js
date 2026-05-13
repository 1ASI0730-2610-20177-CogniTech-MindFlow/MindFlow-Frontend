import apiClient from './base-api'
/**
 * Clase base para todas las operaciones CRUD
 * Proporciona m�todos genéricos para interactuar con la API
 */
export class BaseEndpoint {
  constructor(resource) {
    this.resource = resource
  }
  /**
   * Obtiene todos los registros
   * @returns {Promise}
   */
  async getAll(params = {}) {
    try {
      const response = await apiClient.get(`/${this.resource}`, { params })
      return response.data
    } catch (error) {
      console.error(`Error fetching ${this.resource}:`, error)
      throw error
    }
  }
  /**
   * Obtiene un registro por ID
   * @param {string|number} id
   * @returns {Promise}
   */
  async getById(id) {
    try {
      const response = await apiClient.get(`/${this.resource}/${id}`)
      return response.data
    } catch (error) {
      console.error(`Error fetching ${this.resource}/${id}:`, error)
      throw error
    }
  }
  /**
   * Crea un nuevo registro
   * @param {Object} data
   * @returns {Promise}
   */
  async create(data) {
    try {
      const response = await apiClient.post(`/${this.resource}`, data)
      return response.data
    } catch (error) {
      console.error(`Error creating ${this.resource}:`, error)
      throw error
    }
  }
  /**
   * Actualiza un registro
   * @param {string|number} id
   * @param {Object} data
   * @returns {Promise}
   */
  async update(id, data) {
    try {
      const response = await apiClient.put(`/${this.resource}/${id}`, data)
      return response.data
    } catch (error) {
      console.error(`Error updating ${this.resource}/${id}:`, error)
      throw error
    }
  }
  /**
   * Elimina un registro
   * @param {string|number} id
   * @returns {Promise}
   */
  async delete(id) {
    try {
      const response = await apiClient.delete(`/${this.resource}/${id}`)
      return response.data
    } catch (error) {
      console.error(`Error deleting ${this.resource}/${id}:`, error)
      throw error
    }
  }
  /**
   * Realiza una b�squeda avanzada
   * @param {Object} filters
   * @returns {Promise}
   */
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
