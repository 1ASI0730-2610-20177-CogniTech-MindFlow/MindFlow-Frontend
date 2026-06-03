export const PaymentStatus = {
    PENDING: 'pending',
    COMPLETED: 'completed',
    FAILED: 'failed',
    REFUNDED: 'refunded'
}

export const PAYMENT_METHODS = {
    CREDIT_CARD: 'credit_card',
    PAYPAL: 'paypal',
    FREE_TRIAL: 'free_trial'
}

export class Payment {
    constructor({
        id,
        subscriptionId = null,
        userId = null,
        amount = 0,
        currency = 'USD',
        status = PaymentStatus.PENDING,
        paymentMethod = null,
        transactionId = null,
        paidAt = null,
        createdAt = null,
        updatedAt = null
    }) {
        this.id = id
        this.subscriptionId = subscriptionId
        this.userId = userId
        this.amount = amount
        this.currency = currency
        this.status = status
        this.paymentMethod = paymentMethod
        this.transactionId = transactionId
        this.paidAt = paidAt ? new Date(paidAt) : null
        this.createdAt = createdAt ? new Date(createdAt) : null
        this.updatedAt = updatedAt ? new Date(updatedAt) : null
    }

    get isCompleted() {
        return this.status === PaymentStatus.COMPLETED
    }

    get isFailed() {
        return this.status === PaymentStatus.FAILED
    }

    get isRefunded() {
        return this.status === PaymentStatus.REFUNDED
    }

    get isPending() {
        return this.status === PaymentStatus.PENDING
    }

    toJSON() {
        return {
            id: this.id,
            subscription_id: this.subscriptionId,
            user_id: this.userId,
            amount: this.amount,
            currency: this.currency,
            status: this.status,
            payment_method: this.paymentMethod,
            transaction_id: this.transactionId,
            paid_at: this.paidAt ? this.paidAt.toISOString() : null,
            created_at: this.createdAt ? this.createdAt.toISOString() : null,
            updated_at: this.updatedAt ? this.updatedAt.toISOString() : null
        }
    }

    static fromJSON(data) {
        return new Payment({
            id: data.id,
            subscriptionId: data.subscription_id ?? data.subscriptionId ?? null,
            userId: data.user_id ?? data.userId ?? null,
            amount: data.amount,
            currency: data.currency,
            status: data.status,
            paymentMethod: data.payment_method ?? data.paymentMethod ?? null,
            transactionId: data.transaction_id ?? data.transactionId ?? null,
            paidAt: data.paid_at ?? data.paidAt ?? null,
            createdAt: data.created_at ?? data.createdAt ?? null,
            updatedAt: data.updated_at ?? data.updatedAt ?? null
        })
    }
}
