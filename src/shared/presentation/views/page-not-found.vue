<template>
  <Layout>
    <div class="not-found-page theme-transition">
      <div class="not-found-content">
        <div class="error-visual">
          <span class="error-code">404</span>
          <div class="error-line"></div>
        </div>
        <h2 class="error-title">Página no encontrada</h2>
        <p class="error-message">La página que buscas no existe o ha sido movida a otra ubicación.</p>
        <div class="error-actions">
          <router-link to="/dashboard" class="btn-primary">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8L10 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            Volver al Dashboard
          </router-link>
          <button class="btn-secondary" @click="$router.back()">
            Página Anterior
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
  background: linear-gradient(135deg, var(--accent-primary, #4a9eff), #8b5cf6);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  letter-spacing: -0.04em;
}

.error-line {
  width: 60px;
  height: 3px;
  background: var(--accent-primary, #4a9eff);
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
  background: var(--accent-primary, #4a9eff);
  color: #fff;
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 14px;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  border: none;
  cursor: pointer;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(74, 158, 255, 0.3);
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
  border-color: var(--accent-primary, #4a9eff);
  color: var(--accent-primary, #4a9eff);
  transform: translateY(-2px);
}

@media (max-width: 640px) {
  .not-found-page { padding: 32px 16px; }
  .error-code { font-size: 80px; }
  .error-actions { flex-direction: column; width: 100%; }
  .btn-primary, .btn-secondary { width: 100%; justify-content: center; }
}
</style>
