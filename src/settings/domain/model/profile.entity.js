export class Profile {
    constructor({
        id,
        name,
        email,
        occupation,
        isPremium,
        timezone = 'GMT-5',
        darkModeEnabled = false,
        createdAt,
        updatedAt,
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
        return this.name ? this.name.charAt(0).toUpperCase() : ''
    }

    get planName() {
        return this.isPremium ? 'Premium' : 'Freemium'
    }

    static fromJSON(data) {
        return new Profile({
            id: data.id,
            name: data.name,
            email: data.email,
            occupation: data.occupation,
            isPremium: data.is_premium,
            timezone: data.timezone || 'GMT-5',
            darkModeEnabled: data.dark_mode_enabled || false,
            createdAt: data.created_at,
            updatedAt: data.updated_at,
            deletedAt: data.deleted_at
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