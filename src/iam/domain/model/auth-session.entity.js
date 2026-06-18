export class AuthSession {
    constructor({
        token,
        refreshToken = null,
        expiresAt = null,
        userId
    }) {
        this.token = token
        this.refreshToken = refreshToken
        this.expiresAt = expiresAt ? new Date(expiresAt) : null
        this.userId = userId
    }

    get isExpired() {
        if (!this.expiresAt) return false
        return new Date() >= this.expiresAt
    }

    get timeUntilExpiry() {
        if (!this.expiresAt) return Infinity
        return this.expiresAt.getTime() - Date.now()
    }

    static fromJSON(data) {
        if (!data) return null
        return new AuthSession({
            token: data.token,
            refreshToken: data.refreshToken || data.refresh_token || null,
            expiresAt: data.expiresAt || data.expires_at || null,
            userId: data.userId || data.user_id
        })
    }

    toJSON() {
        return {
            token: this.token,
            refresh_token: this.refreshToken,
            expires_at: this.expiresAt?.toISOString() || this.expiresAt,
            user_id: this.userId
        }
    }
}
