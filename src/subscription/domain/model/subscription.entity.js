export class Subscription {
    constructor(data = {}) {
        this.id = data.id;
        this.userId = data.user_id ?? data.userId;
        this.plan = data.plan ?? data.type ?? 'free';
        this.status = data.status || 'inactive';
        this.isPremium = data.is_premium ?? data.isPremium ?? false;
        this.expiresAt = data.expires_at ?? data.expiresAt ?? null;
    }

    get isPremiumActive() {
        return this.status === 'active' && this.plan === 'premium';
    }
}
