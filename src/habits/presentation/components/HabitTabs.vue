<template>
  <div class="habit-tabs">
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
  gap: 28px;
  border-bottom: 1px solid var(--border-light);
  margin-bottom: 22px;
}

.tab {
  background: none;
  border: none;
  padding: 0 0 12px;
  font: inherit;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-secondary);
  cursor: pointer;
  position: relative;
}

.tab.active {
  color: var(--accent-primary);
  font-weight: 600;
}

.tab.active::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: -1px;
  height: 2px;
  background: var(--accent-primary);
  border-radius: 2px 2px 0 0;
}
</style>