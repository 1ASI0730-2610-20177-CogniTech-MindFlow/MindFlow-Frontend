const TOKEN_KEY = 'auth_token'
const REFRESH_TOKEN_KEY = 'auth_refresh_token'
const USER_ID_KEY = 'auth_user_id'

export const SessionManager = {
    setToken(token) {
        localStorage.setItem(TOKEN_KEY, token)
    },

    getToken() {
        return localStorage.getItem(TOKEN_KEY)
    },

    setRefreshToken(token) {
        localStorage.setItem(REFRESH_TOKEN_KEY, token)
    },

    getRefreshToken() {
        return localStorage.getItem(REFRESH_TOKEN_KEY)
    },

    setUserId(id) {
        localStorage.setItem(USER_ID_KEY, id)
    },

    getUserId() {
        return localStorage.getItem(USER_ID_KEY)
    },

    isAuthenticated() {
        return !!this.getToken()
    },

    save({ token, refreshToken = null, userId }) {
        this.setToken(token)
        if (refreshToken) this.setRefreshToken(refreshToken)
        this.setUserId(userId)
    },

    clear() {
        localStorage.removeItem(TOKEN_KEY)
        localStorage.removeItem(REFRESH_TOKEN_KEY)
        localStorage.removeItem(USER_ID_KEY)
    },

    restore() {
        const token = this.getToken()
        const refreshToken = this.getRefreshToken()
        const userId = this.getUserId()
        if (!token || !userId) return null
        return { token, refreshToken, userId }
    }
}
