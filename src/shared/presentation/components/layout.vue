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
}
</style>