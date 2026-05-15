<template>
  <div class="app">
    <Sidebar />
    <div class="main">
      <Topbar />
      <main class="content">
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
  height: 100vh; /* Cambiamos min-height por height estricto */
  overflow: hidden; /* Evita scroll a nivel global */
}

.main {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100vh; /* El área principal no debe superar la ventana */
}

.content {
  flex: 1;
  padding: 32px;
  overflow-y: auto;
}
</style>