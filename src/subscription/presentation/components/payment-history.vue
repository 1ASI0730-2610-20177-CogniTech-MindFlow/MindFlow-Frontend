<template>
  <section class="payment-history theme-transition">
    <h3 class="section-title theme-transition">{{ $t('plansPage.paymentHistory.title') }}</h3>

    <div v-if="payments.length === 0" class="empty theme-transition">
      {{ $t('plansPage.paymentHistory.empty') }}
    </div>

    <div v-else class="table-wrapper">
      <table class="payments-table">
        <thead>
          <tr>
            <th>{{ $t('plansPage.paymentHistory.date') }}</th>
            <th>{{ $t('plansPage.paymentHistory.amount') }}</th>
            <th>{{ $t('plansPage.paymentHistory.method') }}</th>
            <th>{{ $t('plansPage.paymentHistory.status') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="payment in payments" :key="payment.id">
            <td class="date-cell">{{ formatDate(payment.paidAt) }}</td>
            <td class="amount-cell">{{ formatCurrency(payment.amount, payment.currency) }}</td>
            <td>{{ formatMethod(payment.paymentMethod) }}</td>
            <td>
              <span class="status-badge" :class="payment.status">
                {{ statusLabel(payment.status) }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  payments: {
    type: Array,
    default: () => []
  }
})

function formatDate(date) {
  if (!date) return '-'
  return new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(new Date(date))
}

function formatCurrency(amount, currency) {
  if (amount == null) return '-'
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: currency || 'USD'
  }).format(amount)
}

function formatMethod(method) {
  if (!method) return '-'
  const labels = {
    credit_card: t('plansPage.paymentHistory.methods.creditCard'),
    paypal: t('plansPage.paymentHistory.methods.paypal'),
    free_trial: t('plansPage.paymentHistory.methods.freeTrial')
  }
  return labels[method] || method
}

function statusLabel(status) {
  const labels = {
    completed: t('plansPage.paymentHistory.statuses.completed'),
    pending: t('plansPage.paymentHistory.statuses.pending'),
    failed: t('plansPage.paymentHistory.statuses.failed'),
    refunded: t('plansPage.paymentHistory.statuses.refunded')
  }
  return labels[status] || status
}
</script>

<style scoped>
.payment-history {
  max-width: 800px;
  margin: 48px auto 0;
  padding-top: 32px;
  border-top: 1px solid var(--border-color);
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 20px;
}

.empty {
  text-align: center;
  color: var(--text-muted);
  font-size: 14px;
  padding: 24px;
}

.table-wrapper {
  overflow-x: auto;
}

.payments-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.payments-table th {
  text-align: left;
  padding: 10px 16px;
  font-weight: 500;
  color: var(--text-secondary);
  border-bottom: 2px solid var(--border-color);
  white-space: nowrap;
}

.payments-table td {
  padding: 12px 16px;
  border-bottom: 1px solid var(--border-color);
  color: var(--text-primary);
}

.date-cell {
  white-space: nowrap;
}

.amount-cell {
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}

.status-badge {
  display: inline-flex;
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 500;
}

.status-badge.completed {
  background: rgba(16, 185, 129, 0.12);
  color: var(--accent-success);
}

.status-badge.pending {
  background: rgba(245, 158, 11, 0.12);
  color: var(--accent-warning);
}

.status-badge.failed {
  background: rgba(239, 68, 68, 0.12);
  color: var(--accent-danger);
}

.status-badge.refunded {
  background: rgba(99, 102, 241, 0.12);
  color: var(--accent-primary);
}
</style>
