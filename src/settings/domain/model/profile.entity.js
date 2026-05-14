export class Profile {
    constructor({ id, name, email, occupation, isPremium }) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.occupation = occupation;
        this.isPremium = isPremium;
    }

    get initial() {
        return this.name ? this.name.charAt(0).toUpperCase() : '';
    }

    get planName() {
        return this.isPremium ? 'Premium' : 'Freemium';
    }
}