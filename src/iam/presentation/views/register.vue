<template>
  <AuthLayout>
    <h1 class="view-title">{{ $t('auth.register.title') }}</h1>
    <p class="view-subtitle">{{ $t('auth.register.subtitle') }}</p>
    <RegisterForm
      :is-loading="store.isLoading"
      :server-error="store.error"
      @register="handleRegister"
      @clear-error="store.clearError()"
    />
  </AuthLayout>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/iam/application/auth.store.js'
import AuthLayout from '@/iam/presentation/components/auth-layout.vue'
import RegisterForm from '@/iam/presentation/components/register-form.vue'

const store = useAuthStore()
const router = useRouter()

async function handleRegister(data) {
  const result = await store.register(data)
  if (result.success) {
    router.push('/dashboard')
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
</style>
