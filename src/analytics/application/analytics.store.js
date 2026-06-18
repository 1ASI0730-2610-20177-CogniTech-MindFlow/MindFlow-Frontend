import { defineStore } from 'pinia'
import { AnalyticsSummary, KpiData } from '../domain/model/analytics.model'
import { analyticsApi } from '@/analytics/infrastructure/analytics.endpoint'
import { wordCloudApi } from '@/analytics/infrastructure/word-cloud.endpoint'
import { moodCalendarApi } from '@/analytics/infrastructure/mood-calendar.endpoint'
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

function parseJson(raw, fallback) {
    if (!raw) return fallback
    if (typeof raw === 'object') return raw
    try { return JSON.parse(raw) } catch { return fallback }
}

function mapKpis(kpis = []) {
    const parsed = parseJson(kpis, [])
    return parsed.map((kpi) => new KpiData({
        labelKey: kpi.labelKey || kpi.label_key || null,
        label: kpi.label || '',
        valueKey: kpi.valueKey || kpi.value_key || null,
        value: kpi.value ?? '',
        unitKey: kpi.unitKey || kpi.unit_key || null,
        unit: kpi.unit || '',
        colorClass: kpi.colorClass || kpi.color_class || 'border-blue'
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
    const data = parseJson(record.fluctuation_data, {})
    return {
        labelsKeys: data.labels_keys || data.labelsKeys || [],
        labels: data.labels || [],
        datasets: (data.datasets || []).map((dataset) => mapChartDataset(dataset, data.dataset_label || ''))
    }
}

function mapTrendData(record) {
    const data = parseJson(record.trend_data, {})
    return {
        labelsKeys: data.labels_keys || data.labelsKeys || [],
        labels: data.labels || [],
        datasets: (data.datasets || []).map((dataset) => mapChartDataset(dataset, data.dataset_label || ''))
    }
}

function parseWords(raw) {
    if (Array.isArray(raw)) return raw
    if (typeof raw === 'string') {
        try { return JSON.parse(raw) } catch { return [] }
    }
    return []
}

function mapWordCloudWords(wordCloudRecord) {
    let wordsToMap = [];

    if (Array.isArray(wordCloudRecord) && wordCloudRecord.length > 0) {
       if (wordCloudRecord[0] && wordCloudRecord[0].words) {
           wordsToMap = parseWords(wordCloudRecord[0].words);
       } else {
           wordsToMap = wordCloudRecord;
       }
    }
    else if (wordCloudRecord && wordCloudRecord.words) {
        wordsToMap = parseWords(wordCloudRecord.words);
    }

    if (wordsToMap.length === 0) return []

    const words = [...wordsToMap].sort((a, b) => b.score - a.score).slice(0, 15);

    const positions = [
        { top: '45%', left: '50%' },
        { top: '20%', left: '25%' },
        { top: '70%', left: '70%' },
        { top: '25%', left: '75%' },
        { top: '65%', left: '20%' },
        { top: '82%', left: '45%' },
        { top: '12%', left: '50%' },
        { top: '50%', left: '85%' },
        { top: '85%', left: '15%' },
        { top: '10%', left: '12%' },
        { top: '40%', left: '15%' },
        { top: '75%', left: '85%' },
        { top: '55%', left: '38%' },
        { top: '30%', left: '55%' },
        { top: '85%', left: '65%' },
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

async function loadAnalyticsRecord() {
    const today = new Date()
    const dayOfWeek = today.getDay()
    const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1)
    const weekStart = new Date(today.setDate(diff)).toISOString().slice(0, 10)

    try {
        const result = await analyticsApi.getByWeekStart(weekStart)
        if (Array.isArray(result) && result.length > 0) return result[0]
        if (result && !Array.isArray(result)) return result
    } catch {
        // fall through
    }

    const all = await analyticsApi.getAll()
    return Array.isArray(all) && all.length > 0 ? all[0] : all || null
}

async function loadWordCloudRecord() {
    try {
        const all = await wordCloudApi.getAll()
        if (Array.isArray(all) && all.length > 0) return all[0]
        return all || null
    } catch {
        return null
    }
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
        moodCalendar: null,
        isLoading: true
    }),

    actions: {
        async fetchDashboardData() {
            this.isLoading = true

            try {
                const now = new Date()
                const [record, wordCloudRecord, moodData] = await Promise.all([
                    loadAnalyticsRecord(),
                    loadWordCloudRecord(),
                    moodCalendarApi.get(now.getFullYear(), now.getMonth() + 1).catch(() => null)
                ]);

                this.moodCalendar = moodData

                const legacyData = parseLegacyData(record)

                const tickColor = resolveCssVar('--text-secondary', '#64748b')
                const chartGridColor = resolveCssVar('--chart-grid', '#e5e7eb')

                if (record) {
                    this.summary = mapSummary(record, legacyData)
                    this.kpis = mapKpis(record.kpis || legacyData?.kpis || [])
                    this.fluctuationData = withResolvedChartColors(mapFluctuationData(record))
                    this.trendData = withResolvedChartColors(mapTrendData(record))
                }

                this.wordCloudWords = mapWordCloudWords(wordCloudRecord)

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
                                    const label = val >= 7 ? 'High' : val >= 4 ? 'Moderate' : 'Low'
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