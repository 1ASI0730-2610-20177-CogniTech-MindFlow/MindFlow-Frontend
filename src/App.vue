<template>
  <div id="app" class="theme-transition">
    <router-view />
    <NotificationToast
      :notification="currentToast"
      :visible="showToast"
      type="reminder"
      @dismiss="dismissToast"
    />
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useSettingsStore } from '@/settings/application/settings.store'
import { useHydrationReminder } from '@/shared/presentation/composables/useHydrationReminder'
import NotificationToast from '@/notifications/presentation/components/notification-toast.vue'

const { t } = useI18n()

const { showToast, toastNotification } = useHydrationReminder({
  title: t('hydration.title'),
  message: t('hydration.message')
})

const currentToast = computed(() => toastNotification.value || { id: 0, title: '', message: '' })

function dismissToast() {
  showToast.value = false
  toastNotification.value = null
}

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