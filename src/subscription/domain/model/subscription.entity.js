export class Subscription {
    constructor({ id, user_id, type, status, start_date, end_date }) {
        this.id = id;
        this.userId = user_id;
        this.type = type || 'free';
        this.status = status || 'inactive';
        this.startDate = start_date ? new Date(start_date) : null;
        this.endDate = end_date ? new Date(end_date) : null;
    }
    
    get isPremiumActive() {
        return this.status === 'active' && this.type.includes('premium');
    }
}