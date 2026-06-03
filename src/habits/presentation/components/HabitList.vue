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
.list-move {
  transition: transform 0.4s ease;
}

.list-enter-active {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.list-leave-active {
  transition: all 0.3s ease;
  position: absolute;
  left: 0;
  right: 0;
}

.list-enter-from {
  opacity: 0;
  transform: translateY(12px);
}

.list-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}

.habit-list-card {
  position: relative;
  background: var(--bg-surface);
  border: 1px solid var(--border-light);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04), 0 4px 12px rgba(0, 0, 0, 0.03);
  transition: box-shadow 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), border-color 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.habit-list-card:empty {
  min-height: 120px;
}

.habit-list-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06), 0 12px 24px rgba(0, 0, 0, 0.05);
  border-color: rgba(99, 102, 241, 0.12);
}

.habit-table {
  width: 100%;
  border-collapse: collapse;
}

.habit-table thead th {
  text-align: left;
  padding: 14px 16px;
  font-size: 11px;
  font-weight: 700;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  border-bottom: 1px solid var(--border-color);
  background: var(--bg-surface-secondary);
}

.habit-table thead th:first-child {
  padding-left: 20px;
}

.habit-table thead th:last-child {
  padding-right: 20px;
}

.empty {
  text-align: center;
  padding: 48px 28px;
  color: var(--text-muted);
  font-size: 14px;
  font-weight: 500;
  animation: fadeInEmpty 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes fadeInEmpty {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>