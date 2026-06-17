<template>
  <div v-if="visible" class="pin-overlay">
    <div class="pin-modal">
      <div class="pin-icon">
        <i class="pi pi-lock"></i>
      </div>
      <h2>{{ $t('pin.title') }}</h2>
      <p class="pin-subtitle">{{ $t('pin.subtitle') }}</p>

      <div class="pin-inputs">
        <input
          v-for="(_, i) in pinDigits"
          :key="i"
          ref="inputRefs"
          type="password"
          inputmode="numeric"
          maxlength="1"
          class="pin-digit"
          :class="{ error: hasError }"
          v-model="pinDigits[i]"
          @input="onInput(i)"
          @keydown.backspace="onBackspace(i, $event)"
          @paste.prevent="onPaste"
        />
      </div>

      <p v-if="hasError" class="pin-error">{{ $t('pin.error') }}</p>
      <p v-if="isVerifying" class="pin-verifying">{{ $t('pin.verifying') }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted } from 'vue'
import { PinAPI } from '@/iam/infrastructure/pin-api'

const emit = defineEmits(['verified'])

const visible = ref(false)
const pinDigits = ref(['', '', '', ''])
const hasError = ref(false)
const isVerifying = ref(false)
const inputRefs = ref([])

onMounted(async () => {
  if (sessionStorage.getItem('mindflow_pin_verified')) {
    emit('verified')
    return
  }
  try {
    const status = await PinAPI.getStatus()
    if (status.has_pin) {
      visible.value = true
      await nextTick()
      inputRefs.value[0]?.focus()
    } else {
      emit('verified')
    }
  } catch {
    emit('verified')
  }
})

function onInput(index) {
  hasError.value = false
  if (pinDigits.value[index] && index < 3) {
    nextTick(() => inputRefs.value[index + 1]?.focus())
  }
  if (pinDigits.value.every(d => d !== '')) {
    verifyPin()
  }
}

function onBackspace(index, event) {
  if (!pinDigits.value[index] && index > 0) {
    event.preventDefault()
    pinDigits.value[index - 1] = ''
    nextTick(() => inputRefs.value[index - 1]?.focus())
  }
}

function onPaste(event) {
  const text = (event.clipboardData?.getData('text') || '').replace(/\D/g, '').slice(0, 4)
  for (let i = 0; i < 4; i++) {
    pinDigits.value[i] = text[i] || ''
  }
  if (text.length === 4) verifyPin()
}

async function verifyPin() {
  const pin = pinDigits.value.join('')
  if (pin.length < 4) return

  isVerifying.value = true
  try {
    const result = await PinAPI.verifyPin(pin)
    if (result.valid) {
      sessionStorage.setItem('mindflow_pin_verified', '1')
      visible.value = false
      emit('verified')
    } else {
      hasError.value = true
      pinDigits.value = ['', '', '', '']
      nextTick(() => inputRefs.value[0]?.focus())
    }
  } catch {
    hasError.value = true
    pinDigits.value = ['', '', '', '']
    nextTick(() => inputRefs.value[0]?.focus())
  } finally {
    isVerifying.value = false
  }
}
</script>

<style scoped>
.pin-overlay {
  position: fixed;
  inset: 0;
  background: var(--bg-primary);
  z-index: 99999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pin-modal {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 48px;
  max-width: 360px;
  width: 100%;
}

.pin-icon {
  width: 64px;
  height: 64px;
  border-radius: 20px;
  background: rgba(99, 102, 241, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  color: var(--accent-primary);
}

h2 {
  margin: 0;
  font-size: 22px;
  font-weight: 700;
  color: var(--text-primary);
}

.pin-subtitle {
  margin: 0;
  font-size: 14px;
  color: var(--text-secondary);
  text-align: center;
}

.pin-inputs {
  display: flex;
  gap: 12px;
  margin-top: 8px;
}

.pin-digit {
  width: 52px;
  height: 60px;
  border-radius: 14px;
  border: 2px solid var(--border-color);
  background: var(--bg-surface);
  color: var(--text-primary);
  font-size: 24px;
  font-weight: 700;
  text-align: center;
  outline: none;
  transition: all 0.2s ease;
}

.pin-digit:focus {
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
}

.pin-digit.error {
  border-color: var(--accent-danger);
  animation: shake 0.4s ease;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-6px); }
  75% { transform: translateX(6px); }
}

.pin-error {
  margin: 0;
  font-size: 13px;
  color: var(--accent-danger);
  font-weight: 500;
}

.pin-verifying {
  margin: 0;
  font-size: 13px;
  color: var(--text-muted);
}
</style>
