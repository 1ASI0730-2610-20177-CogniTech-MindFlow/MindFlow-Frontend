<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-header">
        <div class="auth-logo">
          <img src="/assets/mindflow-logo.png" alt="MindFlow Logo" class="auth-logo-img" />
        </div>
        <span class="auth-brand">MindFlow</span>
      </div>
      <div class="auth-card">
        <slot />
      </div>
      <LanguageSwitcher class="auth-lang" />
    </div>
  </div>
</template>

<script setup>
import LanguageSwitcher from '@/shared/presentation/components/language-switcher.vue'
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--bg-primary);
  background-image:
    radial-gradient(circle at 20% 30%, rgba(99, 102, 241, 0.06) 0%, transparent 50%),
    radial-gradient(circle at 80% 70%, rgba(34, 197, 94, 0.04) 0%, transparent 50%);
  padding: 24px;
}

.auth-container {
  width: 100%;
  max-width: 420px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
}

.auth-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.auth-logo {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 16px rgba(99, 102, 241, 0.2);
}

.auth-logo-img {
  width: 48px;
  height: 48px;
  object-fit: contain;
  border-radius: 12px;
}

.auth-brand {
  font-weight: 800;
  font-size: 24px;
  background: linear-gradient(135deg, var(--accent-primary), var(--accent-hover));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: -0.02em;
}

.auth-card {
  width: 100%;
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  padding: 40px 32px;
  box-shadow: 0 20px 60px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.02);
  animation: cardEnter 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes cardEnter {
  from {
    opacity: 0;
    transform: translateY(16px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.auth-lang {
  opacity: 0.6;
  transition: opacity 0.2s;
}

.auth-lang:hover {
  opacity: 1;
}
</style>
