import { BaseEndpoint } from '@/shared/infrastructure/base-endpoint.js'

export class AnalyticsEndpoint extends BaseEndpoint {
    constructor() {
        // Esto asume que tu backend tendrá rutas como /api/v1/analytics
        super('analytics')
    }

    // Puedes agregar métodos personalizados que no sean solo CRUD
    // Ejemplo: Obtener el reporte de estados de ánimo de los últimos X días
    async getMoodTrends(days = 30) {
        // Llama al método GET usando axios configurado en base-api.js
        const response = await this.getAll({ days, type: 'mood' })
        return response
    }
}

// Exportamos una instancia lista para usar
export const analyticsApi = new AnalyticsEndpoint()