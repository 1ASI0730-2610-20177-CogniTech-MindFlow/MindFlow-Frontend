export class User {
    constructor({
        id,
        name,
        email,
        occupation = null,
        isPremium = false,
        timezone = 'GMT-5',
        darkModeEnabled = false,
        createdAt = null,
        updatedAt = null,
        deletedAt = null
    }) {
        this.id = id
        this.name = name
        this.email = email
        this.occupation = occupation
        this.isPremium = isPremium
        this.timezone = timezone
        this.darkModeEnabled = darkModeEnabled
        this.createdAt = createdAt
        this.updatedAt = updatedAt
        this.deletedAt = deletedAt
    }

    get initial() {
        return this.name ? this.name.charAt(0).toUpperCase() : 'U'
    }

    get planName() {
        return this.isPremium ? 'Premium' : 'Freemium'
    }

    get isActive() {
        return !this.deletedAt
    }

    static fromJSON(data) {
        if (!data) return null
        return new User({
            id: data.id,
            name: data.name,
            email: data.email,
            occupation: data.occupation || null,
            isPremium: data.is_premium || data.isPremium || false,
            timezone: data.timezone || 'GMT-5',
            darkModeEnabled: data.dark_mode_enabled || data.darkModeEnabled || false,
            createdAt: data.created_at || data.createdAt || null,
            updatedAt: data.updated_at || data.updatedAt || null,
            deletedAt: data.deleted_at || data.deletedAt || null
        })
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            email: this.email,
            occupation: this.occupation,
            is_premium: this.isPremium,
            timezone: this.timezone,
            dark_mode_enabled: this.darkModeEnabled,
            created_at: this.createdAt,
            updated_at: this.updatedAt,
            deleted_at: this.deletedAt
        }
    }
}
