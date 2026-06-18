<template>
  <Layout>
    <div class="home-page theme-transition">
      <section class="hero-section">
        <div class="hero-badge">
          <span class="badge-dot"></span>
          <span>{{ $t('home.badge') }}</span>
        </div>
        <h1 class="hero-title">{{ $t('home.hero.title') }}</h1>
        <p class="hero-subtitle">{{ $t('home.hero.subtitle') }}</p>
        <div class="hero-actions">
          <router-link to="/dashboard" class="btn-primary">
            <span>{{ $t('home.hero.cta') }}</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3L11 8L6 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </router-link>

        </div>
      </section>

      <section class="features-grid">
        <div class="feature-card">
          <div class="feature-icon mood-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><path d="M8 14C8 14 9.5 16 12 16C14.5 16 16 14 16 14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="9" cy="9" r="1" fill="currentColor"/><circle cx="15" cy="9" r="1" fill="currentColor"/></svg>
          </div>
          <h3>{{ $t('home.features.moodJournal.title') }}</h3>
          <p>{{ $t('home.features.moodJournal.desc') }}</p>
        </div>

        <div class="feature-card">
          <div class="feature-icon habit-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M9 12L11 14L15 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><rect x="3" y="3" width="18" height="18" rx="4" stroke="currentColor" stroke-width="2"/></svg>
          </div>
          <h3>{{ $t('home.features.habitTracking.title') }}</h3>
          <p>{{ $t('home.features.habitTracking.desc') }}</p>
        </div>

        <div class="feature-card">
          <div class="feature-icon analytics-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M3 17V21H7V17H3Z" fill="currentColor" opacity="0.6"/><path d="M10 13V21H14V13H10Z" fill="currentColor" opacity="0.8"/><path d="M17 9V21H21V9H17Z" fill="currentColor"/></svg>
          </div>
          <h3>{{ $t('home.features.analytics.title') }}</h3>
          <p>{{ $t('home.features.analytics.desc') }}</p>
        </div>

        <div class="feature-card">
          <div class="feature-icon premium-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>
          </div>
          <h3>{{ $t('home.features.premium.title') }}</h3>
          <p>{{ $t('home.features.premium.desc') }}</p>
        </div>
      </section>
    </div>
  </Layout>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Layout from '../components/layout.vue'

const router = useRouter()

onMounted(() => {
  if (router.currentRoute.value.path === '/') {
    const hasVisited = localStorage.getItem('mindflow_visited')
    if (!hasVisited) {
      localStorage.setItem('mindflow_visited', 'true')
    }
  }
})
</script>

<style scoped>
.home-page {
  padding: 80px 48px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.hero-section {
  text-align: center;
  margin-bottom: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: 50px;
  padding: 6px 16px;
  font-size: 11px;
  font-weight: 600;
  color: var(--text-muted);
  letter-spacing: 0.05em;
}

.badge-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent-success);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

.hero-title {
  font-size: 48px;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin: 0;
  color: var(--text-primary);
  line-height: 1.15;
  max-width: 700px;
}

.hero-subtitle {
  font-size: 18px;
  color: var(--text-muted);
  margin: 0;
  max-width: 500px;
  line-height: 1.6;
}

.hero-actions {
  display: flex;
  gap: 16px;
  align-items: center;
  margin-top: 8px;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--accent-primary);
  color: var(--text-on-accent);
  padding: 14px 28px;
  border-radius: var(--btn-radius);
  font-weight: var(--btn-font-weight);
  font-size: 15px;
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
  padding: 14px 28px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 15px;
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

.features-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

.feature-card {
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  padding: 32px 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.feature-card:hover {
  transform: translateY(-6px);
  box-shadow: var(--shadow-lg);
  border-color: var(--accent-primary);
}

.feature-card:active {
  transform: translateY(-2px) scale(0.98);
}

.feature-icon {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-on-accent);
}

.mood-icon { background: var(--feature-mood); }
.habit-icon { background: var(--feature-habit); }
.analytics-icon { background: var(--feature-analytics); }
.premium-icon { background: var(--feature-premium); }

.feature-card h3 {
  font-size: 17px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

.feature-card p {
  font-size: 14px;
  color: var(--text-muted);
  margin: 0;
  line-height: 1.6;
}

@media (max-width: 1024px) {
  .home-page { padding: 60px 32px; }
  .hero-title { font-size: 36px; }
  .features-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 640px) {
  .home-page { padding: 40px 16px; }
  .hero-title { font-size: 28px; }
  .hero-actions { flex-direction: column; width: 100%; }
  .btn-primary, .btn-secondary { width: 100%; justify-content: center; }
  .features-grid { grid-template-columns: 1fr; }
}
</style>
