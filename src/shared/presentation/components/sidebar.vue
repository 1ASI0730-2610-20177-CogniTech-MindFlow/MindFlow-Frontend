<template>
  <aside class="sidebar" :class="{ collapsed: collapsed }">
    <div class="logo">
      <div class="logo-icon">
        <img src="/assets/mindflow-logo.png" alt="MindFlow Logo" class="logo-img" />
      </div>
      <span class="logo-text">MindFlow</span>
      <button class="close-sidebar" @click="$emit('close')" aria-label="Close menu">
        <i class="pi pi-times"></i>
      </button>
    </div>

    <div class="nav-wrapper">
      <nav class="nav">
        <router-link
            v-for="(item, index) in menuItems"
            :key="item.path"
            :to="item.path"
            class="nav-item"
            :style="{ '--index': index }"
            active-class="active"
            @click="$emit('close')"
        >
          <span class="nav-indicator"></span>
          <span class="nav-icon"><i :class="['pi', item.icon]"></i></span>
          <span class="nav-label">{{ $t(item.label) }}</span>
        </router-link>
      </nav>
    </div>

    <PremiumBanner />
  </aside>
</template>

<script setup>
import PremiumBanner from './premium-banner.vue'

defineProps({
  collapsed: { type: Boolean, default: false }
})

defineEmits(['close'])

const menuItems = [
  { path: '/dashboard', label: 'menu.dashboard', icon: 'pi-objects-column' },
  { path: '/journal', label: 'menu.journal', icon: 'pi-book' },
  { path: '/habits', label: 'menu.habits', icon: 'pi-check-circle' },
  { path: '/analytics', label: 'menu.analytics', icon: 'pi-chart-bar' },
  { path: '/settings', label: 'menu.settings', icon: 'pi-cog' }
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
  height: 100vh;
  position: sticky;
  top: 0;
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.close-sidebar {
  display: none;
  width: 28px;
  height: 28px;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  background: var(--bg-surface-secondary);
  color: var(--text-secondary);
  cursor: pointer;
  align-items: center;
  justify-content: center;
  margin-left: auto;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 24px 24px 16px;
  border-bottom: 1px solid var(--border-color);
}

.logo-icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.4s ease;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.15);
}

.logo:hover .logo-icon {
  transform: scale(1.06) rotate(-4deg);
  box-shadow: 0 8px 24px rgba(99, 102, 241, 0.25);
}

.logo-img {
  width: 40px;
  height: 40px;
  object-fit: contain;
  border-radius: 10px;
}

.logo-text {
  font-weight: 800;
  font-size: 19px;
  background: linear-gradient(135deg, var(--accent-primary), var(--accent-hover));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: -0.02em;
}

.nav-wrapper {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
  display: flex;
  flex-direction: column;
}

.nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 10px;
  color: var(--text-secondary);
  text-decoration: none;
  font: inherit;
  font-weight: 500;
  font-size: 14px;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: background 0.25s ease, color 0.25s ease, transform 0.25s ease, box-shadow 0.25s ease;
}

.nav-item:hover {
  background: rgba(99, 102, 241, 0.06);
  color: var(--text-primary);
  transform: translateX(3px);
}

.nav-item:active {
  transform: translateX(0) scale(0.98);
  background: rgba(99, 102, 241, 0.1);
}

.nav-item.active {
  background: linear-gradient(135deg, var(--accent-primary), var(--accent-hover));
  color: #fff;
  box-shadow: 0 6px 16px rgba(99, 102, 241, 0.3);
  transform: translateX(0);
}

.nav-item.active:active {
  transform: scale(0.98);
}

.nav-indicator {
  position: absolute;
  left: -4px;
  top: 50%;
  width: 4px;
  height: 0;
  border-radius: 0 4px 4px 0;
  background: #fff;
  transform: translateY(-50%);
  transition: height 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.35s ease;
  opacity: 0;
}

.nav-item.active .nav-indicator {
  height: 20px;
  opacity: 1;
}

.nav-icon {
  width: 20px;
  display: inline-flex;
  justify-content: center;
  font-size: 15px;
  transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
  flex-shrink: 0;
}

.nav-item:hover .nav-icon {
  transform: scale(1.15);
}

.nav-item.active .nav-icon {
  animation: iconPop 0.45s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes iconPop {
  0% { transform: scale(1); }
  40% { transform: scale(1.25); }
  100% { transform: scale(1); }
}

.nav-label {
  transition: transform 0.25s ease;
}

.nav-item:hover .nav-label {
  transform: translateX(2px);
}

@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    z-index: 50;
    box-shadow: 4px 0 24px rgba(0, 0, 0, 0.15);
  }

  .sidebar.collapsed {
    transform: translateX(-100%);
  }

  .close-sidebar {
    display: flex;
  }
}
</style>
