<template>
  <form @submit.prevent="handleSubmit" class="auth-form">
    <div class="form-group">
      <label class="form-label">{{ $t('auth.login.email') }}</label>
      <input
        v-model="email"
        type="email"
        class="form-input"
        :class="{ 'input-error': submitted && emailError }"
        :placeholder="$t('auth.login.emailPlaceholder')"
        autocomplete="email"
        @input="clearError"
      />
      <p v-if="submitted && emailError" class="form-error">{{ $t(emailError) }}</p>
    </div>

    <div class="form-group">
      <label class="form-label">{{ $t('auth.login.password') }}</label>
      <input
        v-model="password"
        type="password"
        class="form-input"
        :class="{ 'input-error': submitted && passwordError }"
        :placeholder="$t('auth.login.passwordPlaceholder')"
        autocomplete="current-password"
        @input="clearError"
      />
      <p v-if="submitted && passwordError" class="form-error">{{ $t(passwordError) }}</p>
    </div>

    <div class="form-options">
      <router-link to="/forgot-password" class="form-link">
        {{ $t('auth.login.forgotPassword') }}
      </router-link>
    </div>

    <p v-if="serverError" class="form-error form-error-center">{{ $t(serverError) }}</p>

    <button type="submit" class="btn-primary" :disabled="isLoading">
      <template v-if="isLoading">
        <span class="spinner"></span>
        {{ $t('auth.login.loading') }}
      </template>
      <template v-else>
        {{ $t('auth.login.button') }}
      </template>
    </button>

    <p class="form-footer">
      {{ $t('auth.login.noAccount') }}
      <router-link to="/register" class="form-link">{{ $t('auth.login.registerLink') }}</router-link>
    </p>
  </form>
</template>

<script setup>
import { ref, computed } from 'vue'
import { LoginRequest } from '@/iam/domain/model/login-request.entity.js'

const emit = defineEmits(['login', 'clearError'])

const email = ref('')
const password = ref('')
const submitted = ref(false)

const props = defineProps({
  isLoading: { type: Boolean, default: false },
  serverError: { type: String, default: null }
})

const emailError = computed(() => {
  if (!submitted.value) return null
  const req = new LoginRequest({ email: email.value, password: '' })
  return req.emailError
})

const passwordError = computed(() => {
  if (!submitted.value) return null
  const req = new LoginRequest({ email: '', password: password.value })
  return req.passwordError
})

function clearError() {
  emit('clearError')
}

async function handleSubmit() {
  submitted.value = true
  const req = new LoginRequest({ email: email.value, password: password.value })
  if (!req.isValid) return
  emit('login', req.toJSON())
}
</script>

<style scoped>
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
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.08), 0 4px 16px rgba(99, 102, 241, 0.12);
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

.form-options {
  display: flex;
  justify-content: flex-end;
  margin-top: -8px;
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
</style>
