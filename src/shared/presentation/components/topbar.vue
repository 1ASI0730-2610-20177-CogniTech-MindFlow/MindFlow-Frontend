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

      <div class="avatar">A</div>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import LanguageSwitcher from './language-switcher.vue'

const route = useRoute()

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
}

.greeting {
  color: var(--text-primary);
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 4px 0;
}

.subtitle {
  color: var(--text-secondary);
  font-size: 13px;
  margin: 0;
}

.topbar-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.search { position: relative; }
.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted);
  font-size: 13px;
}
.search input {
  width: 256px;
  padding: 8px 12px 8px 36px;
  border-radius: 8px;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  outline: none;
  font: inherit;
  transition: border-color 0.15s, background 0.15s;
}
.search input:focus {
  border-color: var(--accent-primary);
  background: var(--bg-surface);
}
.avatar {
  width: 40px;
  height: 40px;
  border-radius: 9999px;
  background: linear-gradient(135deg, #2dd4bf, #14b8a6);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
}
</style>