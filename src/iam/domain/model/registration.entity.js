export class Registration {
    constructor({ name, email, password, confirmPassword }) {
        this.name = name
        this.email = email
        this.password = password
        this.confirmPassword = confirmPassword
    }

    get isValid() {
        return !this.nameError && !this.emailError && !this.passwordError && !this.confirmPasswordError
    }

    get nameError() {
        if (!this.name || !this.name.trim()) return 'auth.register.error.nameRequired'
        if (this.name.trim().length < 2) return 'auth.register.error.nameTooShort'
        return null
    }

    get emailError() {
        if (!this.email) return 'auth.register.error.emailRequired'
        if (!this.email.includes('@')) return 'auth.register.error.emailInvalid'
        return null
    }

    get passwordError() {
        if (!this.password) return 'auth.register.error.passwordRequired'
        if (this.password.length < 6) return 'auth.register.error.passwordTooShort'
        if (!/[A-Z]/.test(this.password)) return 'auth.register.error.passwordUppercase'
        if (!/[0-9]/.test(this.password)) return 'auth.register.error.passwordNumber'
        return null
    }

    get confirmPasswordError() {
        if (!this.confirmPassword) return 'auth.register.error.confirmRequired'
        if (this.password !== this.confirmPassword) return 'auth.register.error.passwordsDoNotMatch'
        return null
    }

    toJSON() {
        return {
            name: this.name?.trim(),
            email: this.email?.trim().toLowerCase(),
            password: this.password
        }
    }
}
