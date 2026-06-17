const TOKEN_KEY = 'auth_token'
const REFRESH_TOKEN_KEY = 'auth_refresh_token'
const USER_ID_KEY = 'auth_user_id'
const USER_EMAIL_KEY = 'auth_user_email'
const USER_NAME_KEY = 'auth_user_name'

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

    setUserEmail(email) {
        localStorage.setItem(USER_EMAIL_KEY, email)
    },

    getUserEmail() {
        return localStorage.getItem(USER_EMAIL_KEY)
    },

    setUserName(name) {
        if (name) localStorage.setItem(USER_NAME_KEY, name)
    },

    getUserName() {
        return localStorage.getItem(USER_NAME_KEY)
    },

    isAuthenticated() {
        return !!this.getToken()
    },

    save({ token, refreshToken = null, userId, email = null, name = null }) {
        this.setToken(token)
        if (refreshToken) this.setRefreshToken(refreshToken)
        this.setUserId(userId)
        if (email) this.setUserEmail(email)
        if (name) this.setUserName(name)
    },

    clear() {
        localStorage.removeItem(TOKEN_KEY)
        localStorage.removeItem(REFRESH_TOKEN_KEY)
        localStorage.removeItem(USER_ID_KEY)
        localStorage.removeItem(USER_EMAIL_KEY)
        localStorage.removeItem(USER_NAME_KEY)
    },

    restore() {
        const token = this.getToken()
        const refreshToken = this.getRefreshToken()
        const userId = this.getUserId()
        const email = this.getUserEmail()
        const name = this.getUserName()
        if (!token || !userId) return null
        return { token, refreshToken, userId, email, name }
    }
}
