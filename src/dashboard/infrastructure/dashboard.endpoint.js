import { BaseEndpoint } from '@/shared/infrastructure/base-endpoint.js'

export class DashboardEndpoint extends BaseEndpoint {
    constructor() {
        super('dashboard')
    }

    async processJournalEntry(text, tag) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    aiFeedback: "✨ MindFlow AI: Noto algo de tensión en tus palabras hoy. Es completamente válido sentirse abrumado a veces. Recuerda que está bien tomar una pausa. ¿Te gustaría intentar un ejercicio rápido de respiración?"
                })
            }, 1500)
        })
    }
}

export const dashboardApi = new DashboardEndpoint()