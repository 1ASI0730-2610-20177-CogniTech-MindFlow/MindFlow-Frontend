import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://mindflow-mockapi.azure-api.net/api/v1'
const API_ACCESS_KEY = import.meta.env.VITE_API_ACCESS_KEY || ''

function tryParseJson(data) {
  if (typeof data !== 'string') return data
  const trimmed = data.trim()
  if (trimmed.length === 0) return data
  const openChar = trimmed[0]
  const closeChar = openChar === '[' ? ']' : openChar === '{' ? '}' : null
  if (!closeChar) return data
  let depth = 0
  let inString = false
  let escape = false
  for (let i = 0; i < trimmed.length; i++) {
    const ch = trimmed[i]
    if (escape) { escape = false; continue }
    if (ch === '\\' && inString) { escape = true; continue }
    if (ch === '"') { inString = !inString; continue }
    if (!inString) {
      if (ch === openChar) depth++
      else if (ch === closeChar) {
        depth--
        if (depth === 0) {
          try { return JSON.parse(trimmed.slice(0, i + 1)) } catch (e) { console.warn('JSON parse fallback:', e.message); return data }
        }
      }
    }
  }
  return data
}

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  transformResponse: [
    ...axios.defaults.transformResponse,
    (data) => tryParseJson(data)
  ]
})

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    if (API_ACCESS_KEY) {
      config.headers['Ocp-Apim-Subscription-Key'] = API_ACCESS_KEY
    }
    return config
  },
  (error) => Promise.reject(error)
)

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default apiClient
