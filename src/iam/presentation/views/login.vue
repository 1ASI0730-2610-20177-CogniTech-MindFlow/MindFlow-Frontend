<template>
  <AuthLayout>
    <h1 class="view-title">{{ $t('auth.login.title') }}</h1>
    <p class="view-subtitle">{{ $t('auth.login.subtitle') }}</p>
    <LoginForm
      :is-loading="store.isLoading"
      :server-error="store.error"
      @login="handleLogin"
      @clear-error="store.clearError()"
    />
  </AuthLayout>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/iam/application/auth.store.js'
import AuthLayout from '@/iam/presentation/components/auth-layout.vue'
import LoginForm from '@/iam/presentation/components/login-form.vue'

const store = useAuthStore()
const router = useRouter()
const route = useRoute()

async function handleLogin(credentials) {
  const result = await store.login(credentials)
  if (result.success) {
    const target = route.query.redirect || store.returnUrl || '/dashboard'
    router.push(target)
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
