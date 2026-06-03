<template>
  <div id="app" class="theme-transition">
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
  overflow: hidden;
}
</style>