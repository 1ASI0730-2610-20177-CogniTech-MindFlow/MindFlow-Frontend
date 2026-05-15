export class AnalyticsSummary {
    constructor({ score, trendPercentage, startDate, endDate, aiInsight }) {
        this.score = score;
        this.trendPercentage = trendPercentage;
        this.startDate = startDate;
        this.endDate = endDate;
        this.aiInsight = aiInsight;
    }
}

export class KpiData {
    constructor({ label, value, colorClass }) {
        this.label = label;
        this.value = value;
        this.colorClass = colorClass; // 'border-blue', 'border-green', 'border-orange'
    }
}