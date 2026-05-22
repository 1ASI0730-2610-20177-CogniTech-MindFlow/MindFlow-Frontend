<template>
  <button class="lang-btn theme-transition" @click="toggleLanguage">
    <span>🌐</span>
    <span>{{ currentLang.toUpperCase() }}</span>
  </button>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()
const currentLang = ref(locale.value)

const toggleLanguage = () => {
  const newLang = currentLang.value === 'es' ? 'en' : 'es'
  locale.value = newLang
  currentLang.value = newLang
  localStorage.setItem('mindflow-lang', newLang)
}
</script>

<style scoped>
.lang-btn {
  height: 40px;
  padding: 0 12px;
  border-radius: 9999px;
  background: var(--bg-surface-secondary);
  border: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-secondary);
  cursor: pointer;
  font: inherit;
  transition: background 0.15s, border-color 0.15s, color 0.15s;
}

.lang-btn:hover {
  background: var(--border-color);
}

:global(.dark-mode) .lang-btn {
  color: var(--text-primary);
}
</style>
