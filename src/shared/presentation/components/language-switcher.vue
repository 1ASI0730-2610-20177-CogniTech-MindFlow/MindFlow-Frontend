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
  height: 44px;
  padding: 0 14px;
  border-radius: 50px;
  background: var(--bg-surface-secondary);
  border: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-secondary);
  cursor: pointer;
  font: inherit;
  font-weight: 500;
  font-size: 13px;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.lang-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.15), transparent);
  transition: left 0.6s ease;
}

.lang-btn:hover {
  background: linear-gradient(135deg, var(--bg-primary), var(--bg-surface-secondary));
  border-color: rgba(99, 102, 241, 0.2);
  color: var(--text-primary);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.06);
}

.lang-btn:hover::before {
  left: 100%;
}

.lang-btn span:first-child {
  font-size: 16px;
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  display: inline-block;
}

.lang-btn:hover span:first-child {
  transform: rotate(20deg) scale(1.1);
}

.lang-btn:active {
  transform: translateY(0px);
}

:global(.dark-mode) .lang-btn {
  color: var(--text-secondary);
}

:global(.dark-mode) .lang-btn:hover {
  color: var(--text-primary);
}
</style>
