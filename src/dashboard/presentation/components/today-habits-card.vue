<template>
  <div class="card habits-card">
    <div class="habits-header">
      <h3>Hábitos de Hoy</h3>
      <span v-if="!store.isHabitsLoading && todayHabits.length > 0" class="habits-count">
        {{ completedCount }}/{{ todayHabits.length }}
      </span>
    </div>

    <div v-if="store.isHabitsLoading" class="skeleton">
      <div class="skeleton-line"></div>
      <div class="skeleton-line"></div>
      <div class="skeleton-line short"></div>
    </div>

    <div v-else-if="store.habitsError" class="error-state">
      <i class="pi pi-exclamation-circle"></i>
      <p>Error al cargar hábitos</p>
    </div>

    <div v-else-if="todayHabits.length === 0" class="empty-state">
      <i class="pi pi-check-circle"></i>
      <p>No hay hábitos programados para hoy</p>
    </div>

    <div v-else class="habits-list">
      <div
        v-for="habit in todayHabits"
        :key="habit.id"
        class="habit-item"
        :class="{ completed: habit.completed }"
      >
        <label class="habit-checkbox">
          <input
            type="checkbox"
            :checked="habit.completed"
            @change="toggleHabit(habit.id)"
          />
          <span class="checkmark">
            <i class="pi pi-check"></i>
          </span>
          <span class="habit-name">{{ habit.name }}</span>
        </label>
      </div>

      <div v-if="allCompleted" class="congrats-message">
        <i class="pi pi-star-fill"></i>
        ¡Todos los hábitos completados! 🎉
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useDashboardStore } from '../../infrastructure/dashboard-store'

const store = useDashboardStore()

const todayHabits = computed(() => store.todayHabits || [])
const completedCount = computed(() => todayHabits.value.filter(h => h.completed).length)
const allCompleted = computed(() =>
  todayHabits.value.length > 0 && completedCount.value === todayHabits.value.length
)

const toggleHabit = (habitId) => store.toggleHabitCompletion(habitId)
</script>

<style scoped>
.card {
  background: #ffffff;
  border-radius: 12px;
  padding: 24px;
  border: 1px solid #e2e8f0;
  transition: box-shadow 0.2s;
}

.card:hover { box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08); }

.habits-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.habits-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #0f172a;
  margin: 0;
}

.habits-count {
  font-size: 14px;
  font-weight: 600;
  color: #4F8DF5;
  background: #eef2ff;
  padding: 4px 12px;
  border-radius: 12px;
}

.habits-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.habit-item { transition: opacity 0.2s; }
.habit-item.completed { opacity: 0.6; }

.habit-checkbox {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  user-select: none;
}

.habit-checkbox input[type="checkbox"] { display: none; }

.checkmark {
  width: 24px;
  height: 24px;
  border: 2px solid #cbd5e1;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  flex-shrink: 0;
}

.checkmark i {
  font-size: 14px;
  color: #ffffff;
  opacity: 0;
  transition: opacity 0.2s;
}

.habit-checkbox input:checked + .checkmark {
  background: #6ED3A3;
  border-color: #6ED3A3;
}

.habit-checkbox input:checked + .checkmark i { opacity: 1; }

.habit-name {
  font-size: 14px;
  color: #0f172a;
  flex: 1;
}

.habit-item.completed .habit-name {
  text-decoration: line-through;
  color: #94a3b8;
}

.congrats-message {
  margin-top: 16px;
  padding: 12px;
  background: linear-gradient(135deg, #6ED3A3 0%, #4F8DF5 100%);
  color: #ffffff;
  border-radius: 8px;
  text-align: center;
  font-size: 14px;
  font-weight: 500;
}

.congrats-message i { margin-right: 8px; }

.empty-state {
  text-align: center;
  padding: 32px 0;
  color: #94a3b8;
}

.empty-state i {
  font-size: 48px;
  margin-bottom: 12px;
  display: block;
}

.empty-state p { font-size: 14px; margin: 0; }

.skeleton { padding: 20px 0; }

.skeleton-line {
  height: 20px;
  background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 4px;
  margin-bottom: 12px;
}

.skeleton-line.short { width: 60%; }

@keyframes loading {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.error-state {
  text-align: center;
  padding: 20px 0;
  color: #ef4444;
}

.error-state i { font-size: 32px; margin-bottom: 8px; }
.error-state p { font-size: 14px; margin: 0; }
</style>
