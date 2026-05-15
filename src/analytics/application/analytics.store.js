import { defineStore } from 'pinia'
import { AnalyticsSummary, KpiData } from '../domain/model/analytics.model'

export const useAnalyticsStore = defineStore('analytics', {
    state: () => ({
        summary: null,
        kpis: [],
        fluctuationData: null,
        fluctuationOptions: null,
        trendData: null,
        trendOptions: null,
        isLoading: true
    }),

    actions: {
        async fetchDashboardData() {
            this.isLoading = true

            setTimeout(() => {
                this.summary = new AnalyticsSummary({
                    score: 78,
                    trendPercentage: '+12%',
                    startDate: '12 oct',
                    endDate: '18 oct',
                    aiInsight: 'Has mostrado una gran resiliencia esta semana. El estrés relacionado con el trabajo disminuyó significativamente después del miércoles.'
                })

                this.kpis = [
                    new KpiData({ label: 'ENTRADAS ESTE MES', value: '24', colorClass: 'border-blue' }),
                    new KpiData({ label: 'ÁNIMO PROMEDIO', value: 'Positivo', colorClass: 'border-green' }),
                    new KpiData({ label: 'MAYOR RACHA HÁBITOS', value: '12 días', colorClass: 'border-orange' })
                ]

                this.fluctuationData = {
                    labels: ['Assessment', 'Growth', 'Reflection', 'Action', 'Integration'],
                    datasets: [{
                        label: 'Interacciones',
                        data: [4, 2, 6, 5, 3],
                        backgroundColor: 'rgba(165, 180, 252, 0.7)',
                        hoverBackgroundColor: 'rgba(99, 102, 241, 0.9)',
                        borderRadius: { topLeft: 4, topRight: 4 },
                        borderSkipped: false,
                        barPercentage: 0.35,
                        categoryPercentage: 0.8
                    }]
                }

                this.fluctuationOptions = {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            backgroundColor: 'rgba(15, 23, 42, 0.9)',
                            titleFont: { size: 11 },
                            bodyFont: { size: 14 },
                            padding: 12,
                            cornerRadius: 8,
                            displayColors: false
                        }
                    },
                    scales: {
                        x: {
                            grid: { display: false },
                            border: { display: false },
                            ticks: {
                                font: { size: 10 },
                                color: '#94a3b8',
                                maxRotation: 45,
                                minRotation: 45
                            }
                        },
                        y: {
                            display: true,
                            grid: { color: 'rgba(15, 23, 42, 0.04)', drawBorder: false },
                            border: { display: false },
                            ticks: { stepSize: 5, font: { size: 10 }, color: '#cbd5e1' },
                            min: 0,
                            max: 10
                        }
                    }
                }

                this.trendData = {
                    labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
                    datasets: [{
                        label: 'Nivel de Bienestar',
                        data: [6, 4, 7, 8, 5, 9, 8],
                        fill: true,
                        borderColor: '#3b82f6',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        tension: 0.4,
                        pointBackgroundColor: '#ffffff',
                        pointBorderColor: '#3b82f6',
                        pointBorderWidth: 2,
                        pointRadius: 4
                    }]
                }

                this.trendOptions = {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        x: {
                            grid: { display: false },
                            border: { display: false },
                            ticks: { font: { size: 10 }, color: '#94a3b8' }
                        },
                        y: {
                            grid: { color: 'rgba(15, 23, 42, 0.04)' },
                            border: { display: false },
                            min: 0,
                            max: 10,
                            ticks: { stepSize: 2, font: { size: 10 }, color: '#cbd5e1' }
                        }
                    }
                }

                this.isLoading = false
            }, 800)
        }
    }
})