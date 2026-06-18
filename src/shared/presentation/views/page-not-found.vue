<template>
  <Layout>
    <div class="not-found-page theme-transition">
      <div class="not-found-content">
        <div class="error-visual">
          <span class="error-code">404</span>
          <div class="error-line"></div>
        </div>
        <h2 class="error-title">{{ $t('notFound.title') }}</h2>
        <p class="error-message">{{ $t('notFound.message') }}</p>
        <div class="error-actions">
          <router-link to="/dashboard" class="btn-primary">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8L10 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            {{ $t('notFound.backToDashboard') }}
          </router-link>
          <button class="btn-secondary" @click="$router.back()">
            {{ $t('notFound.previousPage') }}
          </button>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import Layout from '../components/layout.vue'
</script>

<style scoped>
.not-found-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
  padding: 48px;
}

.not-found-content {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  max-width: 440px;
}

.error-visual {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.error-code {
  font-size: 120px;
  font-weight: 800;
  line-height: 1;
  background: linear-gradient(135deg, var(--accent-primary), var(--accent-hover));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  letter-spacing: -0.04em;
}

.error-line {
  width: 60px;
  height: 3px;
  background: var(--accent-primary);
  border-radius: 4px;
  opacity: 0.5;
}

.error-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

.error-message {
  font-size: 15px;
  color: var(--text-muted);
  margin: 0;
  line-height: 1.6;
}

.error-actions {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-top: 12px;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--accent-primary);
  color: var(--text-on-accent);
  padding: var(--btn-padding-y) var(--btn-padding-x);
  border-radius: var(--btn-radius);
  font-weight: var(--btn-font-weight);
  font-size: var(--btn-font-size);
  text-decoration: none;
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1),
              box-shadow 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  border: none;
  cursor: pointer;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(99, 102, 241, 0.3);
}

.btn-primary:active {
  transform: translateY(0) scale(0.98);
}

.btn-secondary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--bg-surface);
  color: var(--text-primary);
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 14px;
  text-decoration: none;
  border: 1px solid var(--border-color);
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  cursor: pointer;
}

.btn-secondary:hover {
  border-color: var(--accent-primary);
  color: var(--accent-primary);
  transform: translateY(-2px);
}

.btn-secondary:active {
  transform: translateY(0) scale(0.98);
}

@media (max-width: 640px) {
  .not-found-page { padding: 32px 16px; }
  .error-code { font-size: 80px; }
  .error-actions { flex-direction: column; width: 100%; }
  .btn-primary, .btn-secondary { width: 100%; justify-content: center; }
}
</style>
