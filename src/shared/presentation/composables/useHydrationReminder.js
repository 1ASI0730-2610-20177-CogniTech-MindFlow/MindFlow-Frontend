import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import i18n from '@/i18n'

const INACTIVITY_THRESHOLD = 7200000
const CHECK_INTERVAL = 60000

export function useHydrationReminder() {
  const route = useRoute()
  const showToast = ref(false)
  const toastNotification = ref(null)

  let startTime = Date.now()
  let notificationSent = false
  let checkTimer = null

  function resetTimer() {
    startTime = Date.now()
    notificationSent = false
  }

  function showHydrationToast() {
    // Se traduce aquí (y no en el setup) para respetar cambios de idioma en caliente.
    toastNotification.value = {
      id: 'hydration-' + Date.now(),
      title: i18n.global.t('hydration.title'),
      message: i18n.global.t('hydration.message'),
      type: 'REMINDER',
      sentAt: new Date().toISOString()
    }
    showToast.value = true

    setTimeout(() => {
      showToast.value = false
      toastNotification.value = null
    }, 5000)
  }

  function checkTime() {
    if (notificationSent) return
    const elapsed = Date.now() - startTime
    if (elapsed >= INACTIVITY_THRESHOLD) {
      notificationSent = true
      showHydrationToast()
    }
  }

  watch(() => route.path, () => {
    resetTimer()
  })

  onMounted(() => {
    resetTimer()
    checkTimer = setInterval(checkTime, CHECK_INTERVAL)
  })

  onUnmounted(() => {
    if (checkTimer) clearInterval(checkTimer)
  })

  return { showToast, toastNotification }
}
