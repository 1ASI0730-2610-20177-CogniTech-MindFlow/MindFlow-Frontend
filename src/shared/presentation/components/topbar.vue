<template>
  <header class="topbar">
    <div>
      <h2 class="greeting">{{ currentTitle }}</h2>
      <p class="subtitle">{{ formattedDate }} · Tu IA está lista para escucharte.</p>
    </div>

    <div class="topbar-actions">
      <div class="search">
        <span class="search-icon"><i class="pi pi-search"></i></span>
        <input type="text" placeholder="Buscar..." />
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
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  padding: 0 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.greeting {
  color: #0f172a;
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 4px 0;
}

.subtitle {
  color: #64748b;
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
  color: #94a3b8;
  font-size: 13px;
}
.search input {
  width: 256px;
  padding: 8px 12px 8px 36px;
  border-radius: 8px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  outline: none;
  font: inherit;
  transition: border-color 0.15s, background 0.15s;
}
.search input:focus {
  border-color: #a5b4fc;
  background: #fff;
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