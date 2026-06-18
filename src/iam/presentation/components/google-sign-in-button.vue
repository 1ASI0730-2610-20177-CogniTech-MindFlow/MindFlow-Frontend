<template>
  <div class="google-divider">
    <span class="divider-line"></span>
    <span class="divider-text">{{ $t('auth.google.or') }}</span>
    <span class="divider-line"></span>
  </div>
  <div ref="googleBtnRef" class="google-btn-wrapper"></div>
  <p v-if="error" class="google-error">{{ error }}</p>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const emit = defineEmits(['credential'])

const googleBtnRef = ref(null)
const error = ref(null)
const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID

onMounted(() => {
  if (!clientId) return
  if (!window.google?.accounts?.id) {
    const check = setInterval(() => {
      if (window.google?.accounts?.id) {
        clearInterval(check)
        initGoogle()
      }
    }, 200)
    setTimeout(() => clearInterval(check), 5000)
  } else {
    initGoogle()
  }
})

function initGoogle() {
  window.google.accounts.id.initialize({
    client_id: clientId,
    callback: handleCredential
  })
  window.google.accounts.id.renderButton(
    googleBtnRef.value,
    { theme: 'outline', size: 'large', text: 'continue_with', width: '100%' }
  )
}

function handleCredential(response) {
  error.value = null
  emit('credential', response.credential)
}
</script>

<style scoped>
.google-divider {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 4px 0;
}

.divider-line {
  flex: 1;
  height: 1px;
  background: var(--border-color);
}

.divider-text {
  font-size: 12px;
  color: var(--text-muted);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.google-btn-wrapper {
  display: flex;
  justify-content: center;
}

.google-error {
  text-align: center;
  font-size: 12px;
  color: var(--accent-danger, #ef4444);
  margin: 0;
}
</style>
