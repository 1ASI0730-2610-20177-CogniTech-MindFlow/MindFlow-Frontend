<template>
  <tr class="habit-row hover-lift" :class="{ paused: habit.isPaused() }">
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
    <td class="name-cell" :class="{ done: habit.isCompleted() }">
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
        <span v-if="habit.currentStreak > 0" class="streak">
          <i class="pi pi-bolt streak-icon animate-bounce-subtle"></i>
          {{ habit.currentStreak }} días
        </span>
        <span v-else class="streak muted">0 días</span>
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
/* Animations */
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
  50% { transform: translateY(-2px); }
}

.animate-pop-in {
  animation: popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}

.animate-pulse-slow {
  animation: pulseSlow 2s ease-in-out infinite;
}

.animate-bounce-subtle {
  animation: bounceSubtle 2s ease-in-out infinite;
}

/* Interactions */
.hover-lift {
  transition: transform 0.2s ease, background-color 0.2s ease;
}
.hover-lift:hover {
  transform: translateX(4px); /* Slight nudge instead of vertical lift for table rows */
  background-color: #f8fafc;
}

.hover-scale {
  transition: transform 0.2s ease;
}
.hover-scale:hover:not(:disabled) {
  transform: scale(1.1);
}

.habit-row td {
  padding: 14px 12px;
  border-bottom: 1px solid #f1f5f9;
  vertical-align: middle;
}

.habit-row.paused td {
  color: #94a3b8;
}

.status-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 0;
}

.status-btn:disabled {
  cursor: default;
}

.done-icon {
  color: #22c55e;
  font-size: 22px;
}

.paused-icon {
  color: #f59e0b;
  font-size: 22px;
}

.pending-ring {
  width: 20px;
  height: 20px;
  border: 2px solid #cbd5e1;
  border-radius: 50%;
  display: inline-block;
  transition: border-color 0.2s ease;
}
.status-btn:hover:not(:disabled) .pending-ring {
  border-color: #94a3b8; /* Darken slightly on hover */
}

.name-cell {
  font-size: 14px;
  font-weight: 500;
  color: #1e293b;
  transition: color 0.3s ease; /* Smooth transition for strike-through */
}

.name-cell.done {
  text-decoration: line-through;
  color: #94a3b8;
}

.category-tag {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
}

.streak {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: #475569;
}

.streak-icon {
  color: #f97316;
  font-size: 12px;
}

.streak.muted {
  color: #94a3b8;
}

.paused-label {
  font-size: 13px;
  font-weight: 600;
  color: #d97706;
}
</style>