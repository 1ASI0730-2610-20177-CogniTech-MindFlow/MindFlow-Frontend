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
  min-height: 100vh;
}

.main {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.content {
  flex: 1;
  padding: 32px;
  overflow-y: auto;
}
</style>