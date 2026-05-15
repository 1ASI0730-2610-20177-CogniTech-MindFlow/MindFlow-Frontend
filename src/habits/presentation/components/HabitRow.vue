<template>
  <tr class="habit-row" :class="{ paused: habit.isPaused() }">
    <td class="status-cell">
      <button
          type="button"
          class="status-btn"
          :disabled="!habit.canToggle()"
          :aria-label="habit.isCompleted() ? 'Marcar pendiente' : 'Marcar completado'"
          @click="$emit('toggle', habit.id)"
      >
        <i v-if="habit.isPaused()" class="pi pi-pause-circle paused-icon"></i>
        <i v-else-if="habit.isCompleted()" class="pi pi-check-circle done-icon"></i>
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
          <i class="pi pi-bolt streak-icon"></i>
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
}

.name-cell {
  font-size: 14px;
  font-weight: 500;
  color: #1e293b;
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
