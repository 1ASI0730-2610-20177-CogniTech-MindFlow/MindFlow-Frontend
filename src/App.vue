<template>
  <div id="app" class="theme-transition">
    <PinVerificationModal
      v-if="requiresPinCheck"
      @verified="pinVerified = true"
    />
    <router-view v-if="!requiresPinCheck || pinVerified" />
    <NotificationToast
      :notification="currentToast"
      :visible="showToast"
      type="reminder"
      @dismiss="dismissToast"
    />
  </div>
</template>

<script setup>
import { computed, ref, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { useSettingsStore } from '@/settings/application/settings.store'
import { useHydrationReminder } from '@/shared/presentation/composables/useHydrationReminder'
import { SessionManager } from '@/iam/infrastructure/session-manager'
import NotificationToast from '@/notifications/presentation/components/notification-toast.vue'
import PinVerificationModal from '@/iam/presentation/components/pin-verification-modal.vue'

const route = useRoute()
const pinVerified = ref(false)
// route.path fuerza la reevaluación en cada navegación: isAuthenticated()
// lee localStorage, que por sí solo no es reactivo.
const requiresPinCheck = computed(() =>
  route.path !== null && SessionManager.isAuthenticated() && !pinVerified.value
)

const { locale } = useI18n()

watch(locale, (val) => {
  document.documentElement.lang = val
})

const { showToast, toastNotification } = useHydrationReminder()

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