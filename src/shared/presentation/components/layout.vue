<template>
  <div class="app theme-transition">
    <Sidebar :collapsed="sidebarCollapsed" @close="sidebarCollapsed = true" />
    <div class="main">
      <Topbar @toggle-sidebar="sidebarCollapsed = !sidebarCollapsed" />
      <main class="content theme-transition" @click="closeSidebarOnMobile">
        <slot />
      </main>
    </div>
    <Transition name="overlay-fade">
      <div v-if="!sidebarCollapsed && isMobile" class="sidebar-overlay" @click="sidebarCollapsed = true"></div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import Sidebar from './sidebar.vue'
import Topbar from './topbar.vue'

const sidebarCollapsed = ref(window.innerWidth < 768)
const windowWidth = ref(window.innerWidth)

const isMobile = computed(() => windowWidth.value < 768)

function onResize() {
  windowWidth.value = window.innerWidth
  if (windowWidth.value >= 768) sidebarCollapsed.value = false
  else sidebarCollapsed.value = true
}

function closeSidebarOnMobile() {
  if (isMobile.value) sidebarCollapsed.value = true
}

onMounted(() => window.addEventListener('resize', onResize))
onUnmounted(() => window.removeEventListener('resize', onResize))
</script>

<style scoped>
.app {
  display: flex;
  height: 100vh;
  overflow: hidden;
  background-color: var(--bg-primary);
}

.main {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100vh;
  min-width: 0;
}

.content {
  flex: 1;
  padding: 32px;
  overflow-y: auto;
  background-color: var(--bg-primary);
  background-image:
    radial-gradient(circle at 20% 50%, rgba(99, 102, 241, 0.03) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(34, 197, 94, 0.02) 0%, transparent 50%);
  animation: contentFade 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  scrollbar-width: thin;
  scrollbar-color: var(--border-color) transparent;
}

.content::-webkit-scrollbar {
  width: 6px;
}

.content::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border-radius: 3px;
}

.content::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 49;
}

.overlay-fade-enter-active,
.overlay-fade-leave-active {
  transition: opacity 0.3s ease;
}

.overlay-fade-enter-from,
.overlay-fade-leave-to {
  opacity: 0;
}

@keyframes contentFade {
  from { opacity: 0; }
  to { opacity: 1; }
}

@media (max-width: 768px) {
  .content {
    padding: 16px;
  }
}

@media (max-width: 380px) {
  .content {
    padding: 12px 8px;
  }
}
</style>
