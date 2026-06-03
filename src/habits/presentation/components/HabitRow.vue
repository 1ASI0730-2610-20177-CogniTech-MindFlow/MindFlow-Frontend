<template>
  <tr class="habit-row hover-lift theme-transition" :class="{ paused: habit.isPaused() }">
    <td class="status-cell">
      <button
          type="button"
          class="status-btn hover-scale"
          :disabled="!habit.canToggle()"
          :aria-label="habit.isCompleted() ? 'Marcar pendiente' : 'Marcar completado'"
          @click="$emit('toggle', habit.id)"
      >
        <i v-if="habit.isPaused()" class="pi pi-pause-circle paused-icon animate-pulse-slow"></i>
        <i v-else-if="habit.isCompleted()" class="pi pi-check-circle done-icon animate-pop-in"></i>
        <span v-else class="pending-ring"></span>
      </button>
    </td>
    <td class="name-cell theme-transition" :class="{ done: habit.isCompleted() }">
      {{ habit.name }}
    </td>
    <td>
      <span class="category-tag" :style="categoryStyle">
        {{ habit.category }}
      </span>
    </td>
    <td class="streak-cell">
      <template v-if="habit.isPaused()">
        <span class="paused-label">Pausado por IA</span>
      </template>
      <template v-else>
        <span v-if="habit.currentStreak > 0" class="streak theme-transition">
          <i class="pi pi-bolt streak-icon animate-bounce-subtle"></i>
          {{ habit.currentStreak }} días
        </span>
        <span v-else class="streak muted theme-transition">0 días</span>
      </template>
    </td>
  </tr>
</template>

<script setup>
import { computed } from 'vue'
import { HABIT_CATEGORIES } from '../../domain/model/habit.entity.js'

const props = defineProps({
  habit: { type: Object, required: true }
})

defineEmits(['toggle'])

const categoryStyle = computed(() => {
  const palette = HABIT_CATEGORIES[props.habit.category] || HABIT_CATEGORIES.Bienestar
  return {
    background: palette.bg,
    color: palette.color
  }
})
</script>

<style scoped>
@keyframes popIn {
  0% { transform: scale(0.5); opacity: 0; }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); opacity: 1; }
}

@keyframes pulseSlow {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.7; transform: scale(0.95); }
}

@keyframes bounceSubtle {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
}

.animate-pop-in {
  animation: popIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

.animate-pulse-slow {
  animation: pulseSlow 2s ease-in-out infinite;
}

.animate-bounce-subtle {
  animation: bounceSubtle 2s ease-in-out infinite;
}

.hover-lift {
  transition: all 0.25s ease;
}

.hover-lift:hover {
  background-color: rgba(99, 102, 241, 0.04);
}

.hover-scale {
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.hover-scale:hover:not(:disabled) {
  transform: scale(1.15);
}

.habit-row td {
  padding: 13px 16px;
  border-bottom: 1px solid var(--border-color);
  vertical-align: middle;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.habit-row:last-child td {
  border-bottom: none;
}

.habit-row td:first-child {
  padding-left: 20px;
  width: 52px;
}

.habit-row td:last-child {
  padding-right: 20px;
}

.habit-row.paused td {
  color: var(--text-muted);
  opacity: 0.7;
}

.status-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 0;
  border-radius: 50%;
  transition: all 0.25s ease;
  position: relative;
}

.status-btn:hover:not(:disabled) {
  background: rgba(99, 102, 241, 0.08);
}

.status-btn:active:not(:disabled) {
  transform: scale(0.92);
}

.status-btn:disabled {
  cursor: default;
}

.done-icon {
  color: #fff;
  font-size: 14px;
  filter: drop-shadow(0 2px 4px rgba(34, 197, 94, 0.3));
  background: var(--accent-success);
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
}

.paused-icon {
  color: #fff;
  font-size: 14px;
  filter: drop-shadow(0 2px 4px rgba(245, 158, 11, 0.3));
  background: var(--accent-warning);
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.2);
}

.pending-ring {
  width: 24px;
  height: 24px;
  border: 2.5px solid var(--text-secondary);
  border-radius: 50%;
  display: inline-block;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.status-btn:hover:not(:disabled) .pending-ring {
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
  transform: scale(1.1);
}

.name-cell {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  transition: all 0.25s ease;
}

.name-cell.done {
  text-decoration: line-through;
  color: var(--text-muted);
  text-decoration-color: var(--accent-success);
}

.category-tag {
  display: inline-block;
  padding: 5px 11px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 700;
  border: 1px solid transparent;
  transition: all 0.25s ease;
  letter-spacing: 0.02em;
}

.streak {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: var(--text-secondary);
  font-weight: 600;
  transition: all 0.25s ease;
}

.streak-icon {
  color: var(--accent-warning);
  font-size: 13px;
  filter: drop-shadow(0 1px 3px rgba(245, 158, 11, 0.25));
}

.streak.muted {
  color: var(--text-muted);
}

.paused-label {
  font-size: 13px;
  font-weight: 700;
  color: var(--accent-warning);
  letter-spacing: 0.02em;
}
</style>