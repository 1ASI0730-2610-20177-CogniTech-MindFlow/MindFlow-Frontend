<template>
  <header class="topbar theme-transition">
    <div>
      <h2 class="greeting">{{ currentTitle }}</h2>
      <p class="subtitle">{{ formattedDate }} · Tu IA está lista para escucharte.</p>
    </div>

    <div class="topbar-actions">
      <div class="search">
        <span class="search-icon"><i class="pi pi-search"></i></span>
        <input type="text" placeholder="Buscar..." class="theme-transition" />
      </div>

      <LanguageSwitcher />

      <div class="avatar" v-if="store.profile">{{ store.profile.initial }}</div>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import LanguageSwitcher from './language-switcher.vue'
import { useSettingsStore } from '@/settings/application/settings.store.js'

const route = useRoute()
const store = useSettingsStore()

const currentTitle = computed(() => {
  return route.meta?.title || 'Hola, Usuario'
})

const formattedDate = computed(() => {
  const options = { weekday: 'long', day: 'numeric', month: 'long' }
  return new Date().toLocaleDateString('es-ES', options)
})
</script>

<style scoped>
.topbar {
  height: 80px;
  background: var(--bg-surface);
  border-bottom: 1px solid var(--border-color);
  padding: 0 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.greeting {
  color: var(--text-primary);
  font-size: 20px;
  font-weight: 700;
  margin: 0 0 4px 0;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.subtitle {
  color: var(--text-secondary);
  font-size: 13px;
  margin: 0;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.topbar-actions {
  display: flex;
  align-items: center;
  gap: 20px;
}

.search {
  position: relative;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.search-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted);
  font-size: 14px;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  pointer-events: none;
}

.search:focus-within .search-icon {
  color: var(--accent-primary);
  transform: translateY(-50%) scale(1.1);
}

.search input {
  width: 260px;
  padding: 10px 14px 10px 40px;
  border-radius: 12px;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  outline: none;
  font: inherit;
  font-size: 14px;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: inset 0 0 0 2px transparent;
}

.search input:hover {
  border-color: rgba(99, 102, 241, 0.3);
  background: var(--bg-surface-secondary);
}

.search input:focus {
  border-color: var(--accent-primary);
  background: var(--bg-surface);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1), inset 0 0 0 1px rgba(99, 102, 241, 0.2);
  transform: translateY(-2px);
}

.search input::placeholder {
  color: var(--text-muted);
  transition: color 0.3s ease;
}

.search input:focus::placeholder {
  color: var(--text-secondary);
}

.avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: linear-gradient(135deg, #2dd4bf, #14b8a6);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 16px;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(45, 212, 191, 0.3);
  position: relative;
  overflow: hidden;
}

.avatar::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(255,255,255,0.2), transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.avatar:hover {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 8px 20px rgba(45, 212, 191, 0.4);
}

.avatar:hover::before {
  opacity: 1;
}

@media (max-width: 768px) {
  .search input {
    width: 200px;
  }
}
</style>