import { onMounted, onUnmounted, ref, watch } from 'vue'

export function useFocusTrap(containerRef, isActive) {
  const previousActiveElement = ref(null)

  function getFocusableElements() {
    if (!containerRef.value) return []
    const selectors = [
      'a[href]', 'button:not([disabled])', 'input:not([disabled])',
      'select:not([disabled])', 'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])', 'area[href]',
      'iframe', 'object', 'embed', '[contenteditable]'
    ]
    return Array.from(containerRef.value.querySelectorAll(selectors.join(', ')))
  }

  function handleKeydown(e) {
    if (e.key !== 'Tab') return
    const focusable = getFocusableElements()
    if (focusable.length === 0) return

    const first = focusable[0]
    const last = focusable[focusable.length - 1]

    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault()
        last.focus()
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
  }

  function activate() {
    previousActiveElement.value = document.activeElement
    document.addEventListener('keydown', handleKeydown)
    const focusable = getFocusableElements()
    if (focusable.length > 0) {
      focusable[0].focus()
    }
  }

  function deactivate() {
    document.removeEventListener('keydown', handleKeydown)
    if (previousActiveElement.value && typeof previousActiveElement.value.focus === 'function') {
      previousActiveElement.value.focus()
    }
  }

  if (isActive !== undefined) {
    watch(isActive, (val) => {
      if (val) {
        activate()
      } else {
        deactivate()
      }
    })
  } else {
    onMounted(() => activate())
  }

  onUnmounted(() => deactivate())

  return { activate, deactivate }
}
