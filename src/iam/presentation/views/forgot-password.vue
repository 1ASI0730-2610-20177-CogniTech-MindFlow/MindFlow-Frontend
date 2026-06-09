<template>
  <AuthLayout>
    <h1 class="view-title">{{ $t('auth.forgotPassword.title') }}</h1>
    <p class="view-subtitle">{{ $t('auth.forgotPassword.subtitle') }}</p>

    <form v-if="!sent" @submit.prevent="handleSubmit" class="auth-form">
      <div class="form-group">
        <label class="form-label">{{ $t('auth.forgotPassword.email') }}</label>
        <input
          v-model="email"
          type="email"
          class="form-input"
          :class="{ 'input-error': submitted && emailError }"
          :placeholder="$t('auth.forgotPassword.emailPlaceholder')"
          autocomplete="email"
          @input="store.clearError()"
        />
        <p v-if="submitted && emailError" class="form-error">{{ $t(emailError) }}</p>
      </div>

      <p v-if="store.error" class="form-error form-error-center">{{ $t(store.error) }}</p>

      <button type="submit" class="btn-primary" :disabled="store.isLoading">
        <template v-if="store.isLoading">
          <span class="spinner"></span>
          {{ $t('auth.forgotPassword.sending') }}
        </template>
        <template v-else>
          {{ $t('auth.forgotPassword.button') }}
        </template>
      </button>

      <p class="form-footer">
        <router-link to="/login" class="form-link">{{ $t('auth.forgotPassword.backToLogin') }}</router-link>
      </p>
    </form>

    <div v-else class="success-state">
      <div class="success-icon">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--accent-success, #22c55e)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 2L11 13" /><path d="M22 2L15 22L11 13L2 9L22 2Z" />
        </svg>
      </div>
      <p class="success-message">{{ $t('auth.forgotPassword.sent') }}</p>
      <router-link to="/login" class="btn-primary btn-back">
        {{ $t('auth.forgotPassword.backToLogin') }}
      </router-link>
    </div>
  </AuthLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '@/iam/application/auth.store.js'
import AuthLayout from '@/iam/presentation/components/auth-layout.vue'

const store = useAuthStore()

const email = ref('')
const submitted = ref(false)
const sent = ref(false)

const emailError = computed(() => {
  if (!submitted.value) return null
  if (!email.value) return 'auth.login.error.emailRequired'
  if (!email.value.includes('@')) return 'auth.login.error.emailInvalid'
  return null
})

async function handleSubmit() {
  submitted.value = true
  if (emailError.value) return

  const result = await store.forgotPassword(email.value)
  if (result.success) {
    sent.value = true
  }
}
</script>

<style scoped>
.view-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--text-primary);
  text-align: center;
  margin: 0 0 8px;
  letter-spacing: -0.01em;
}

.view-subtitle {
  font-size: 14px;
  color: var(--text-secondary);
  text-align: center;
  margin: 0 0 24px;
  line-height: 1.5;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-secondary);
  letter-spacing: 0.01em;
}

.form-input {
  padding: 12px 16px;
  border-radius: 10px;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  font: inherit;
  font-size: 14px;
  outline: none;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.form-input:hover {
  border-color: rgba(99, 102, 241, 0.2);
}

.form-input:focus {
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.08);
  background: var(--bg-surface);
}

.form-input.input-error {
  border-color: var(--accent-danger, #ef4444);
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.08);
}

.form-error {
  font-size: 12px;
  color: var(--accent-danger, #ef4444);
  margin: 0;
}

.form-error-center {
  text-align: center;
  font-size: 13px;
}

.form-link {
  color: var(--accent-primary);
  text-decoration: none;
  font-size: 13px;
  font-weight: 500;
  transition: opacity 0.2s;
}

.form-link:hover {
  opacity: 0.8;
  text-decoration: underline;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 14px 28px;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--accent-primary), var(--accent-hover));
  color: var(--text-on-accent, #fff);
  font-weight: 700;
  font-size: 15px;
  border: none;
  cursor: pointer;
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease, opacity 0.25s ease;
  box-shadow: 0 6px 20px rgba(99, 102, 241, 0.25);
  text-decoration: none;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 28px rgba(99, 102, 241, 0.35);
}

.btn-primary:active:not(:disabled) {
  transform: translateY(0) scale(0.98);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.form-footer {
  text-align: center;
  font-size: 13px;
  color: var(--text-secondary);
  margin: 0;
}

.success-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 16px 0;
}

.success-icon {
  animation: iconPop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes iconPop {
  0% { transform: scale(0); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}

.success-message {
  text-align: center;
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.6;
  margin: 0;
}

.btn-back {
  width: auto;
  margin-top: 8px;
}
</style>
