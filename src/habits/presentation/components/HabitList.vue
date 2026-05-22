<template>
  <section class="habit-list-card theme-transition">
    <table class="habit-table">
      <thead>
        <tr>
          <th class="theme-transition">Estado</th>
          <th class="theme-transition">Hábito</th>
          <th class="theme-transition">Categoría</th>
          <th class="theme-transition">Racha Actual</th>
        </tr>
      </thead>
      <TransitionGroup name="list" tag="tbody">
        <HabitRow
            v-for="habit in habits"
            :key="habit.id"
            :habit="habit"
            @toggle="$emit('toggle', $event)"
        />
        <tr v-if="habits.length === 0" key="empty-row">
          <td colspan="4" class="empty">No hay hábitos que coincidan con el filtro.</td>
        </tr>
      </TransitionGroup>
    </table>
  </section>
</template>

<script setup>
import HabitRow from './HabitRow.vue'

defineProps({
  habits: { type: Array, default: () => [] }
})

defineEmits(['toggle'])
</script>

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.4s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
.list-leave-active {
  position: absolute;
}

.habit-list-card {
  background: var(--bg-surface);
  border: 1px solid var(--border-light);
  border-radius: 14px;
  overflow: hidden;
  box-shadow: var(--shadow-sm);
}

.habit-table {
  width: 100%;
  border-collapse: collapse;
}

.habit-table thead th {
  text-align: left;
  padding: 14px 12px;
  font-size: 12px;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  border-bottom: 1px solid var(--border-color);
  background: var(--bg-surface-secondary);
}

.empty {
  text-align: center;
  padding: 28px;
  color: var(--text-muted);
  font-size: 14px;
}
</style>