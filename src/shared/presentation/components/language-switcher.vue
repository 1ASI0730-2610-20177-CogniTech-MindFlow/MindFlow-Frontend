<template>
  <button class="lang-btn" :class="{ switching }" @click="toggleLanguage">
    <span class="globe-wrapper" :class="{ spin }">
      <i class="pi pi-globe globe-icon"></i>
    </span>
    <span class="lang-text-wrapper">
      <span
          class="lang-text"
          :class="slideDir"
          :key="currentLang"
      >{{ currentLang.toUpperCase() }}</span>
    </span>
  </button>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()
const currentLang = ref(locale.value)
const spin = ref(false)
const switching = ref(false)
const slideDir = ref('')

const toggleLanguage = () => {
  const newLang = currentLang.value === 'es' ? 'en' : 'es'
  slideDir.value = newLang === 'es' ? 'slide-down' : 'slide-up'
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
  }, 700)
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
  background: var(--bg-primary);
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

.globe-wrapper {
  display: inline-flex;
  perspective: 200px;
}

.globe-icon {
  font-size: 16px;
  display: inline-block;
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}


.globe-wrapper.spin .globe-icon {
  animation: globe3DSpin 0.7s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes globe3DSpin {
  0% { transform: rotateY(0deg) scale(1); }
  40% { transform: rotateY(180deg) scale(1.2); }
  100% { transform: rotateY(360deg) scale(1); }
}

.lang-text-wrapper {
  display: inline-block;
  overflow: hidden;
  height: 1.2em;
  vertical-align: middle;
  line-height: 1.2;
}

.lang-text {
  display: inline-block;
  animation: textFlipIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

.lang-text.slide-up {
  animation: textSlideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

.lang-text.slide-down {
  animation: textSlideDown 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

@keyframes textFlipIn {
  0% {
    opacity: 0;
    transform: translateY(8px) scale(0.9);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes textSlideUp {
  0% {
    opacity: 0;
    transform: translateY(10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes textSlideDown {
  0% {
    opacity: 0;
    transform: translateY(-10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.lang-btn.switching {
  animation: btnGlow 0.7s ease;
}

@keyframes btnGlow {
  0% {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    background: var(--bg-surface-secondary);
  }
  30% {
    box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.12), 0 4px 16px rgba(99, 102, 241, 0.08);
    background: rgba(99, 102, 241, 0.04);
    border-color: rgba(99, 102, 241, 0.25);
  }
  100% {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    background: var(--bg-surface-secondary);
  }
}

:global(.dark-mode) .lang-btn {
  color: var(--text-secondary);
}

:global(.dark-mode) .lang-btn:hover {
  color: var(--text-primary);
}
</style>
