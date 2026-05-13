<template>
  <aside class="sidebar">
    <div class="logo">
      <img src="/assets/mindflow-logo.png" alt="MindFlow Logo" class="logo-img" />
      <span class="logo-text">MindFlow</span>
    </div>

    <nav class="nav">
      <router-link
          v-for="item in menuItems"
          :key="item.path"
          :to="item.path"
          class="nav-item"
          active-class="active"
      >
        <span class="nav-icon"><i :class="['pi', item.icon]"></i></span>
        {{ item.label }}
      </router-link>
    </nav>

    <PremiumBanner />
  </aside>
</template>

<script setup>
import PremiumBanner from './premium-banner.vue'

const menuItems = [
  { path: '/dashboard', label: 'Dashboard', icon: 'pi-objects-column' },
  { path: '/journal', label: 'Diario (Journal)', icon: 'pi-book' },
  { path: '/habits', label: 'Hábitos', icon: 'pi-check-circle' },
  { path: '/analytics', label: 'Analíticas', icon: 'pi-chart-bar' },
  { path: '/settings', label: 'Configuración', icon: 'pi-cog' }
]
</script>

<style scoped>
.sidebar {
  width: 256px;
  background: #ffffff;
  border-right: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px 24px;
}

.logo-img {
  width: 32px;
  height: 32px;
  object-fit: contain;
  border-radius: 8px;
}

.logo-text {
  color: #4f46e5;
  font-weight: 600;
  font-size: 18px;
}

.nav {
  flex: 1;
  padding: 8px 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  border-radius: 8px;
  background: transparent;
  color: #475569;
  text-decoration: none;
  font: inherit;
  transition: background 0.15s;
}

.nav-item:hover {
  background: #f8fafc;
}

.nav-item.active {
  background: #eef2ff;
  color: #4f46e5;
  border: 1px solid #e0e7ff;
}

.nav-icon {
  width: 16px;
  display: inline-flex;
  justify-content: center;
}
</style>