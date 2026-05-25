<template>
  <div class="app theme-transition">
    <Sidebar />
    <div class="main">
      <Topbar />
      <main class="content theme-transition">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import Sidebar from './sidebar.vue'
import Topbar from './topbar.vue'
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
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.content::-webkit-scrollbar {
  display: none;
}

@keyframes contentFade {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}


/* Scroll padding para Scroll suave */
html {
  scroll-padding-top: 80px;
}
</style>