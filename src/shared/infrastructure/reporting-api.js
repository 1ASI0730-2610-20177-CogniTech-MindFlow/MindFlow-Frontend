import apiClient from './base-api'

const REPORTING_URL = '/api/v1/reporting/export'

export class ReportingApiService {
    async downloadPdf() {
        try {
            const response = await apiClient.get(`${REPORTING_URL}/pdf`, {
                responseType: 'blob'
            })
            return response.data
        } catch (error) {
            console.error('Error downloading PDF:', error)
            throw error
        }
    }

    async downloadCsv() {
        try {
            const response = await apiClient.get(`${REPORTING_URL}/csv`, {
                responseType: 'blob'
            })
            return response.data
        } catch (error) {
            console.error('Error downloading CSV:', error)
            throw error
        }
    }

    triggerDownload(blob, filename) {
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = filename
        a.click()
        URL.revokeObjectURL(url)
    }
}

export const ReportingAPI = new ReportingApiService()
