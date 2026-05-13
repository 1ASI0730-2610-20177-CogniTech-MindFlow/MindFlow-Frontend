<template>
  <button class="lang-btn" @click="toggleLanguage">
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
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #475569;
  cursor: pointer;
  font: inherit;
  transition: background 0.15s;
}

.lang-btn:hover {
  background: #f1f5f9;
}
</style>