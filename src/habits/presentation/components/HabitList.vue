<template>
  <section class="habit-list-card">
    <table class="habit-table">
      <thead>
        <tr>
          <th>Estado</th>
          <th>Hábito</th>
          <th>Categoría</th>
          <th>Racha Actual</th>
        </tr>
      </thead>
      <tbody>
        <HabitRow
            v-for="habit in habits"
            :key="habit.id"
            :habit="habit"
            @toggle="$emit('toggle', $event)"
        />
        <tr v-if="habits.length === 0">
          <td colspan="4" class="empty">No hay hábitos que coincidan con el filtro.</td>
        </tr>
      </tbody>
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
.habit-list-card {
  background: #fff;
  border: 1px solid #edf0f5;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02);
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
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  border-bottom: 1px solid #f1f5f9;
  background: #fafbfc;
}

.empty {
  text-align: center;
  padding: 28px;
  color: #94a3b8;
  font-size: 14px;
}
</style>
