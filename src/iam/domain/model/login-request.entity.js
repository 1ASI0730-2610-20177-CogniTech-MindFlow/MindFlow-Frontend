export class LoginRequest {
    constructor({ email, password }) {
        this.email = email
        this.password = password
    }

    get isValid() {
        return this.isEmailValid && this.isPasswordValid
    }

    get isEmailValid() {
        return typeof this.email === 'string' && this.email.length > 0 && this.email.includes('@')
    }

    get isPasswordValid() {
        return typeof this.password === 'string' && this.password.length >= 6
    }

    get emailError() {
        if (!this.email) return 'auth.login.error.emailRequired'
        if (!this.email.includes('@')) return 'auth.login.error.emailInvalid'
        return null
    }

    get passwordError() {
        if (!this.password) return 'auth.login.error.passwordRequired'
        if (this.password.length < 6) return 'auth.login.error.passwordTooShort'
        return null
    }

    toJSON() {
        return {
            email: this.email,
            password: this.password
        }
    }
}
