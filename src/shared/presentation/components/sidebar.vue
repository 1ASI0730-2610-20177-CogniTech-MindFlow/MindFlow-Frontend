<template>
  <aside class="sidebar theme-transition">
    <div class="logo">
      <img src="/assets/mindflow-logo.png" alt="MindFlow Logo" class="logo-img" />
      <span class="logo-text">MindFlow</span>
    </div>

    <nav class="nav">
      <router-link
          v-for="item in menuItems"
          :key="item.path"
          :to="item.path"
          class="nav-item theme-transition"
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
  background: var(--bg-surface);
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 24px;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.logo-img {
  width: 40px;
  height: 40px;
  object-fit: contain;
  border-radius: 10px;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.15);
}

.logo-img:hover {
  transform: scale(1.05) rotate(4deg);
  box-shadow: 0 8px 20px rgba(99, 102, 241, 0.25);
}

.logo-text {
  color: var(--accent-primary);
  font-weight: 700;
  font-size: 18px;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  background: linear-gradient(135deg, var(--accent-primary), var(--accent-hover));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.nav {
  flex: 1;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  border-radius: 12px;
  background: transparent;
  color: var(--text-secondary);
  text-decoration: none;
  font: inherit;
  font-weight: 500;
  font-size: 14px;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
  overflow: hidden;
}

.nav-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  width: 3px;
  height: 100%;
  background: var(--accent-primary);
  opacity: 0;
  transition: opacity 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.nav-item:hover {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(99, 102, 241, 0.04));
  color: var(--text-primary);
  transform: translateX(4px);
  box-shadow: inset 0 0 0 1px rgba(99, 102, 241, 0.1);
}

.nav-item.active {
  background: linear-gradient(135deg, var(--accent-primary), var(--accent-hover));
  color: #fff;
  box-shadow: 0 8px 16px rgba(99, 102, 241, 0.3);
  transform: translateX(2px);
  border: none;
}

.nav-item.active::before {
  opacity: 1;
}

.nav-icon {
  width: 18px;
  display: inline-flex;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.nav-item:hover .nav-icon {
  transform: scale(1.1);
}

.nav-item.active .nav-icon {
  animation: iconBounce 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes iconBounce {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
}
</style>