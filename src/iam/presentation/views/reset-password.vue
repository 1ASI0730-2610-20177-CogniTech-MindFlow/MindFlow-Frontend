<template>
  <AuthLayout>
    <h1 class="view-title">{{ $t('auth.resetPassword.title') }}</h1>
    <p class="view-subtitle">{{ $t('auth.resetPassword.subtitle') }}</p>

    <form v-if="!success" @submit.prevent="handleSubmit" class="auth-form">
      <div class="form-group">
        <label class="form-label">{{ $t('auth.resetPassword.newPassword') }}</label>
        <input
          v-model="newPassword"
          type="password"
          class="form-input"
          :class="{ 'input-error': submitted && passwordError }"
          :placeholder="$t('auth.resetPassword.newPasswordPlaceholder')"
          autocomplete="new-password"
        />
        <p v-if="submitted && passwordError" class="form-error">{{ passwordError }}</p>
      </div>

      <div class="form-group">
        <label class="form-label">{{ $t('auth.resetPassword.confirmPassword') }}</label>
        <input
          v-model="confirmPassword"
          type="password"
          class="form-input"
          :class="{ 'input-error': submitted && confirmError }"
          :placeholder="$t('auth.resetPassword.confirmPasswordPlaceholder')"
          autocomplete="new-password"
        />
        <p v-if="submitted && confirmError" class="form-error">{{ confirmError }}</p>
      </div>

      <p v-if="error" class="form-error form-error-center">{{ error }}</p>

      <button type="submit" class="btn-primary" :disabled="isLoading">
        <template v-if="isLoading">
          <span class="spinner"></span>
          {{ $t('auth.resetPassword.sending') }}
        </template>
        <template v-else>
          {{ $t('auth.resetPassword.button') }}
        </template>
      </button>
    </form>

    <div v-else class="success-state">
      <div class="success-icon">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--accent-success, #22c55e)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 6L9 17l-5-5" />
        </svg>
      </div>
      <p class="success-message">{{ $t('auth.resetPassword.success') }}</p>
      <router-link to="/login" class="btn-primary btn-back">
        {{ $t('auth.resetPassword.backToLogin') }}
      </router-link>
    </div>
  </AuthLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { AuthAPI } from '@/iam/infrastructure/auth-api.js'
import AuthLayout from '@/iam/presentation/components/auth-layout.vue'

const route = useRoute()

const newPassword = ref('')
const confirmPassword = ref('')
const submitted = ref(false)
const isLoading = ref(false)
const success = ref(false)
const error = ref(null)

const passwordError = computed(() => {
  if (!submitted.value) return null
  if (!newPassword.value) return 'La contraseña es obligatoria'
  if (newPassword.value.length < 6) return 'Mínimo 6 caracteres'
  return null
})

const confirmError = computed(() => {
  if (!submitted.value) return null
  if (newPassword.value !== confirmPassword.value) return 'Las contraseñas no coinciden'
  return null
})

async function handleSubmit() {
  submitted.value = true
  error.value = null
  if (passwordError.value || confirmError.value) return

  const token = route.query.token
  if (!token) {
    error.value = 'Token inválido o expirado'
    return
  }

  isLoading.value = true
  try {
    await AuthAPI.resetPassword({ token, newPassword: newPassword.value })
    success.value = true
  } catch (e) {
    error.value = e.response?.data?.message || 'Error al restablecer la contraseña'
  } finally {
    isLoading.value = false
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
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease;
  box-shadow: 0 6px 20px rgba(99, 102, 241, 0.25);
  text-decoration: none;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 28px rgba(99, 102, 241, 0.35);
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
}

.btn-back {
  width: auto;
  margin-top: 8px;
}
</style>
