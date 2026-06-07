import { defineStore } from 'pinia'
import { AnalyticsSummary, KpiData } from '../domain/model/analytics.model'
import { analyticsApi } from '@/analytics/infrastructure/analytics.endpoint'
import { wordCloudApi } from '@/analytics/infrastructure/word-cloud.endpoint'
import { useSettingsStore } from '@/settings/application/settings.store'

function resolveCssVar(varName, fallback) {
    if (typeof window === 'undefined') return fallback

    const value = getComputedStyle(document.documentElement)
        .getPropertyValue(varName)
        .trim()

    return value || fallback
}

function resolveColorToken(value, fallback) {
    if (typeof value !== 'string') return value ?? fallback

    const match = value.match(/^var\((--[^,\)\s]+)(?:,\s*([^\)]+))?\)$/)
    if (!match) return value

    const [, varName, innerFallback] = match
    return resolveCssVar(varName, (innerFallback || fallback || '').trim())
}

function withResolvedChartColors(chartData) {
    if (!chartData) return null

    return {
        ...chartData,
        datasets: (chartData.datasets || []).map((dataset) => ({
            ...dataset,
            backgroundColor: resolveColorToken(dataset.backgroundColor, dataset.backgroundColor),
            hoverBackgroundColor: resolveColorToken(dataset.hoverBackgroundColor, dataset.hoverBackgroundColor),
            borderColor: resolveColorToken(dataset.borderColor, dataset.borderColor),
            pointBackgroundColor: resolveColorToken(dataset.pointBackgroundColor, '#ffffff'),
            pointBorderColor: resolveColorToken(dataset.pointBorderColor, dataset.pointBorderColor)
        }))
    }
}

function parseLegacyData(payload) {
    if (!payload?.data) return null

    if (typeof payload.data === 'object') return payload.data

    try {
        return JSON.parse(payload.data)
    } catch (e) {
        console.warn('Failed to parse legacy data:', e.message)
        return null
    }
}

function mapKpis(kpis = []) {
    return kpis.map((kpi) => new KpiData({
        labelKey: kpi.labelKey || kpi.label_key || null,
        label: kpi.label || '',
        valueKey: kpi.valueKey || kpi.value_key || null,
        value: kpi.value ?? '',
        unitKey: kpi.unitKey || kpi.unit_key || null,
        unit: kpi.unit || '',
        colorClass: kpi.colorClass || 'border-blue'
    }))
}

function mapChartDataset(dataset = {}, fallbackLabel = '') {
    return {
        labelKey: dataset.labelKey || dataset.label_key || null,
        label: dataset.label || fallbackLabel || '',
        data: dataset.data || [],
        backgroundColor: dataset.backgroundColor,
        hoverBackgroundColor: dataset.hoverBackgroundColor,
        borderRadius: dataset.borderRadius,
        borderSkipped: dataset.borderSkipped,
        barPercentage: dataset.barPercentage,
        categoryPercentage: dataset.categoryPercentage,
        fill: dataset.fill,
        borderColor: dataset.borderColor,
        tension: dataset.tension,
        pointBackgroundColor: dataset.pointBackgroundColor,
        pointBorderColor: dataset.pointBorderColor,
        pointBorderWidth: dataset.pointBorderWidth,
        pointRadius: dataset.pointRadius
    }
}

function mapSummary(record, legacyData) {
    return new AnalyticsSummary({
        score: record.score ?? legacyData?.score ?? 0,
        trendPercentage: record.trend_percentage ?? legacyData?.trend_percentage ?? '+0%',
        startDate: record.start_date ?? legacyData?.startDate ?? '',
        endDate: record.end_date ?? legacyData?.endDate ?? '',
        aiInsightLocalized: record.ai_insight_localized || record.aiInsightLocalized || null,
        aiInsight: record.ai_insight || record.aiInsight || legacyData?.aiInsight || ''
    })
}

function mapFluctuationData(record) {
    const data = record.fluctuation_data || {}
    return {
        labelsKeys: data.labels_keys || data.labelsKeys || [],
        labels: data.labels || [],
        datasets: (data.datasets || []).map((dataset) => mapChartDataset(dataset, data.dataset_label || ''))
    }
}

function mapTrendData(record) {
    const data = record.trend_data || {}
    return {
        labelsKeys: data.labels_keys || data.labelsKeys || [],
        labels: data.labels || [],
        datasets: (data.datasets || []).map((dataset) => mapChartDataset(dataset, data.dataset_label || ''))
    }
}

function mapWordCloudWords(wordCloudRecord, legacyData) {
    let wordsToMap = [];
    
    if (Array.isArray(wordCloudRecord) && wordCloudRecord.length > 0) {
       if (wordCloudRecord[0] && Array.isArray(wordCloudRecord[0].words)) {
           wordsToMap = wordCloudRecord[0].words;
       } else {
           wordsToMap = wordCloudRecord;
       }
    } 
    // Check if it's an object with a 'words' property
    else if (wordCloudRecord && Array.isArray(wordCloudRecord.words)) {
        wordsToMap = wordCloudRecord.words;
    }
    // Fallback to legacy
    else if (legacyData && Array.isArray(legacyData.wordCloud)) {
        wordsToMap = legacyData.wordCloud;
    }

    if (wordsToMap.length > 0) {
        const words = [...wordsToMap].sort((a, b) => b.score - a.score);

        const positions = [
            { top: '45%', left: '50%' },
            { top: '25%', left: '35%' },
            { top: '65%', left: '65%' },
            { top: '30%', left: '70%' },
            { top: '60%', left: '25%' },
            { top: '80%', left: '45%' },
            { top: '15%', left: '60%' },
            { top: '50%', left: '85%' },
            { top: '85%', left: '15%' },
            { top: '15%', left: '15%' },
        ];

        const negativeWords = ['ansiedad', 'estres', 'cansado', 'triste', 'frustracion', 'miedo'];

        const getColor = (word) => {
            const normalizedTag = String(word.tag || '')
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')

            if (negativeWords.includes(normalizedTag)) {
                return word.score > 0.7 ? 'var(--accent-danger)' : 'var(--text-muted)';
            }

            if (word.score >= 0.85) return 'var(--accent-primary)';
            if (word.score >= 0.7) return 'var(--accent-success)';
            if (word.score >= 0.55) return 'var(--accent-warning)';
            return 'var(--text-muted)';
        };

        return words.map((word, index) => {
            const position = positions[index % positions.length];
            return {
                text: word.tag,
                size: Math.max(14, 10 + (word.score * 25)),
                color: getColor(word),
                weight: word.score > 0.7 ? 700 : 500,
                ...position
            };
        });
    }
    
    if (legacyData?.mostUsedTag) {
        return [
            {
                text: legacyData.mostUsedTag,
                size: 32,
                color: 'var(--global-blue)',
                weight: 700,
                top: '50%',
                left: '45%'
            }
        ]
    }

    return []
}

async function loadAnalyticsRecord() {
    const settingsStore = useSettingsStore()
    const currentUserId = settingsStore.currentUserId

    if (currentUserId) {
        const byUser = await analyticsApi.getByUserId(currentUserId)
        if (byUser.length > 0) return byUser[0]
    }

    const all = await analyticsApi.getAll()
    return all[0] || null
}

async function loadWordCloudRecord() {
    const settingsStore = useSettingsStore()
    const currentUserId = settingsStore.currentUserId
    if (currentUserId) {
        return await wordCloudApi.getByUserId(currentUserId)
    }

    const all = await wordCloudApi.getAll();
    return all.length > 0 ? all[0] : null;
}

export const useAnalyticsStore = defineStore('analytics', {
    state: () => ({
        summary: null,
        kpis: [],
        wordCloudWords: [],
        fluctuationData: null,
        fluctuationOptions: null,
        trendData: null,
        trendOptions: null,
        isLoading: true
    }),

    actions: {
        async fetchDashboardData() {
            this.isLoading = true

            try {
                const [record, wordCloudRecord] = await Promise.all([
                    loadAnalyticsRecord(),
                    loadWordCloudRecord()
                ]);

                const legacyData = parseLegacyData(record)

                const tickColor = resolveCssVar('--text-secondary', '#64748b')
                const chartGridColor = resolveCssVar('--chart-grid', '#e5e7eb')

                if (record) {
                    this.summary = mapSummary(record, legacyData)
                    this.kpis = mapKpis(record.kpis || legacyData?.kpis || [])
                    this.fluctuationData = withResolvedChartColors(mapFluctuationData(record))
                    this.trendData = withResolvedChartColors(mapTrendData(record))
                }

                this.wordCloudWords = mapWordCloudWords(wordCloudRecord, legacyData)

                const tooltipBase = {
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    titleFont: { size: 11, weight: '600' },
                    bodyFont: { size: 13, weight: '500' },
                    padding: 12,
                    cornerRadius: 8,
                    displayColors: true,
                    borderColor: 'rgba(255,255,255,0.08)',
                    borderWidth: 1
                }

                this.fluctuationOptions = {
                    responsive: true,
                    maintainAspectRatio: false,
                    animation: { duration: 600, easing: 'easeOutQuart' },
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            ...tooltipBase,
                            callbacks: {
                                label: (ctx) => {
                                    const val = ctx.parsed.y
                                    const label = val >= 7 ? 'Alto' : val >= 4 ? 'Moderado' : 'Bajo'
                                    return ` ${val} — ${label}`
                                }
                            }
                        }
                    },
                    scales: {
                        x: {
                            grid: { display: false },
                            border: { display: false },
                            ticks: {
                                font: { size: 10 },
                                color: tickColor,
                                maxRotation: 40,
                                minRotation: 40
                            }
                        },
                        y: {
                            display: true,
                            grid: { color: chartGridColor, drawBorder: false },
                            border: { display: false },
                            ticks: { stepSize: 5, font: { size: 10 }, color: tickColor },
                            min: 0,
                            max: 10
                        }
                    }
                }

                this.trendOptions = {
                    responsive: true,
                    maintainAspectRatio: false,
                    animation: { duration: 800, easing: 'easeOutQuart' },
                    interaction: {
                        mode: 'index',
                        intersect: false
                    },
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            ...tooltipBase,
                            callbacks: {
                                title: (items) => items[0]?.label || '',
                                label: (ctx) => {
                                    const label = ctx.dataset.label || ''
                                    const val = ctx.parsed.y
                                    return ` ${label}: ${val}`
                                }
                            }
                        }
                    },
                    scales: {
                        x: {
                            grid: { display: false },
                            border: { display: false },
                            ticks: { font: { size: 10 }, color: tickColor }
                        },
                        y: {
                            grid: { color: chartGridColor },
                            border: { display: false },
                            min: 0,
                            max: 10,
                            ticks: { stepSize: 2, font: { size: 10 }, color: tickColor }
                        }
                    },
                    elements: {
                        point: {
                            hoverRadius: 6,
                            hoverBorderWidth: 2
                        },
                        line: {
                            tension: 0.35
                        }
                    }
                }
            } catch (error) {
                console.error('Error loading analytics dashboard data:', error)
            } finally {
                this.isLoading = false
            }
        }
    }
})