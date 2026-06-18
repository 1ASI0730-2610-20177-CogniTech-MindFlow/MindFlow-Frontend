<template>
  <div class="habit-tabs theme-transition">
    <button
        v-for="tab in localizedTabs"
        :key="tab.id"
        type="button"
        class="tab"
        :class="{ active: modelValue === tab.id }"
        @click="$emit('update:modelValue', tab.id)"
    >
      {{ tab.label }}
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

defineProps({
  modelValue: { type: String, required: true }
})

defineEmits(['update:modelValue'])

const localizedTabs = computed(() => [
  { id: 'routines', label: t('habits.tabs.routines') },
  { id: 'suggestions', label: t('habits.tabs.suggestions') },
  { id: 'history', label: t('habits.tabs.history') }
])
</script>

<style scoped>
.habit-tabs {
  display: flex;
  gap: 32px;
  border-bottom: 1px solid var(--border-light);
  margin-bottom: 28px;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.tab {
  background: none;
  border: none;
  padding: 0 0 14px;
  font: inherit;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-secondary);
  cursor: pointer;
  position: relative;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  letter-spacing: 0.3px;
}

.tab:hover {
  color: var(--text-primary);
  transform: translateY(-2px);
}

.tab.active {
  color: var(--accent-primary);
}

.tab.active::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: -1px;
  height: 3px;
  background: var(--accent-primary);
  border-radius: 3px 3px 0 0;
  animation: expandWidth 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes expandWidth {
  from {
    width: 0;
    left: 50%;
  }
  to {
    width: 100%;
    left: 0;
  }
}

.tab::before {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: -1px;
  height: 3px;
  background: transparent;
  border-radius: 3px 3px 0 0;
  transition: background 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.tab:hover::before {
  background: rgba(99, 102, 241, 0.1);
}
</style>