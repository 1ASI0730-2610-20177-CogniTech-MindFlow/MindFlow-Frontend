<template>
  <button class="lang-btn" :class="{ switching }" @click="toggleLanguage">
    <span class="globe-icon" :class="{ spin }">🌐</span>
    <span class="lang-text" :key="currentLang">{{ currentLang.toUpperCase() }}</span>
  </button>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()
const currentLang = ref(locale.value)
const spin = ref(false)
const switching = ref(false)
const toggleLanguage = () => {
  const newLang = currentLang.value === 'es' ? 'en' : 'es'
  locale.value = newLang
  currentLang.value = newLang
  localStorage.setItem('mindflow-lang', newLang)

  spin.value = false
  switching.value = false
  nextTick(() => {
    spin.value = true
    switching.value = true
  })

  setTimeout(() => {
    spin.value = false
    switching.value = false
  }, 600)
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
  user-select: none;
  -webkit-tap-highlight-color: transparent;
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
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
}

.lang-btn:hover::before {
  left: 100%;
}

.lang-btn:active {
  transform: translateY(0px) scale(0.97);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.globe-icon {
  font-size: 16px;
  display: inline-block;
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.lang-btn:hover .globe-icon {
  transform: rotate(20deg) scale(1.1);
}

.globe-icon.spin {
  animation: globeSpin 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes globeSpin {
  0% { transform: rotate(0deg) scale(1); }
  25% { transform: rotate(120deg) scale(1.15); }
  50% { transform: rotate(240deg) scale(1.1); }
  100% { transform: rotate(360deg) scale(1); }
}

.lang-text {
  display: inline-block;
  animation: textSlideIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

@keyframes textSlideIn {
  0% {
    opacity: 0;
    transform: translateY(8px) scale(0.9);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.lang-btn.switching {
  animation: btnPulse 0.6s ease;
}

@keyframes btnPulse {
  0% { box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04); }
  50% { box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.15); }
  100% { box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04); }
}

:global(.dark-mode) .lang-btn {
  color: var(--text-secondary);
}

:global(.dark-mode) .lang-btn:hover {
  color: var(--text-primary);
}
</style>
