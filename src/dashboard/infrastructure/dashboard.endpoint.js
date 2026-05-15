import { BaseEndpoint } from '@/shared/infrastructure/base-endpoint.js'

export class DashboardEndpoint extends BaseEndpoint {
    constructor() {
        super('dashboard')
    }

    // Método específico para la Inteligencia Artificial
    async processJournalEntry(text, tag) {
        // En producción, esto llamaría a tu API real que se conecta con Gemini:
        // const response = await this.create({ text, tag, type: 'ai_analysis' })
        // return response

        // Simulación del backend para desarrollo:
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    aiFeedback: "✨ MindFlow AI: Noto algo de tensión en tus palabras hoy. Es completamente válido sentirse abrumado a veces. Recuerda que está bien tomar una pausa. ¿Te gustaría intentar un ejercicio rápido de respiración?"
                })
            }, 1500)
        })
    }

    // Aquí puedes agregar más métodos como getHabits(), etc.
}

export const dashboardApi = new DashboardEndpoint()