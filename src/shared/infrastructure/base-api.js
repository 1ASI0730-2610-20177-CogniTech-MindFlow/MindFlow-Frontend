import axios from 'axios'
import { SessionManager } from '@/iam/infrastructure/session-manager.js'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'https://mindflow-backend-mlbg.onrender.com'

// El backend responde 401 también en estos endpoints (p. ej. credenciales
// inválidas en sign-in); ahí el error debe llegar al formulario, no forzar logout.
const AUTH_PATHS = ['/sign-in', '/sign-up', '/google-auth', '/forgot-password', '/reset-password']

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const requestUrl = error.config?.url || ''
    const isAuthRequest = AUTH_PATHS.some((path) => requestUrl.includes(path))

    if (error.response?.status === 401 && !isAuthRequest) {
      SessionManager.clear()
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default apiClient
