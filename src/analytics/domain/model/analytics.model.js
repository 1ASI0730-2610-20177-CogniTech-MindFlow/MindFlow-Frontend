export class AnalyticsSummary {
    constructor({
        score,
        trendPercentage,
        startDate,
        endDate,
        aiInsightLocalized = null,
        aiInsight = ''
    }) {
        this.score = score;
        this.trendPercentage = trendPercentage;
        this.startDate = startDate;
        this.endDate = endDate;
        this.aiInsightLocalized = aiInsightLocalized;
        this.aiInsight = aiInsight;
    }
}

export class KpiData {
    constructor({ labelKey = null, label = '', valueKey = null, value = '', unitKey = null, unit = '', colorClass }) {
        this.labelKey = labelKey;
        this.label = label;
        this.valueKey = valueKey;
        this.value = value;
        this.unitKey = unitKey;
        this.unit = unit;
        this.colorClass = colorClass; // 'border-blue', 'border-green', 'border-orange'
    }
}