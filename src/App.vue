<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useSettingsStore } from '@/settings/application/settings.store'

onMounted(() => {
  const settingsStore = useSettingsStore()
  settingsStore.initDarkMode()
})
</script>

<style scoped>
#app {
  width: 100%;
  height: 100vh;
  overflow: hidden;
}
</style>