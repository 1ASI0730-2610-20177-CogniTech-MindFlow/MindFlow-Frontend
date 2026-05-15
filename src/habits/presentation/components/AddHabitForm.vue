<template>
  <section class="add-habit-card theme-transition">
    <h3 class="theme-transition">{{ $t('habits.addForm.title') }}</h3>
    <form class="add-form" @submit.prevent="submit">
      <input
          v-model="name"
          type="text"
          :placeholder="$t('habits.addForm.placeholder')"
          class="theme-transition"
      />
      <select v-model="category" required class="theme-transition">
        <option disabled value="">{{ $t('habits.addForm.category') }}</option>
        <option v-for="cat in categories" :key="cat" :value="cat">
          {{ cat }}
        </option>
      </select>
      <select v-model="frequency" class="theme-transition">
        <option value="diario">{{ $t('habits.addForm.frequency.daily') }}</option>
        <option value="semanal">{{ $t('habits.addForm.frequency.weekly') }}</option>
        <option value="mensual">{{ $t('habits.addForm.frequency.monthly') }}</option>
      </select>
      <button type="submit" class="create-btn" :disabled="!canSubmit">
        <i class="pi pi-plus"></i> {{ $t('habits.addForm.create') }}
      </button>
    </form>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue'
import { HABIT_CATEGORY_OPTIONS } from '../../domain/model/habit.entity.js'

const emit = defineEmits(['create'])

const name = ref('')
const category = ref('')
const frequency = ref('diario')
const categories = HABIT_CATEGORY_OPTIONS

const canSubmit = computed(() => name.value.trim() && category.value)

const submit = () => {
  if (!canSubmit.value) return
  emit('create', {
    name: name.value,
    category: category.value,
    frequency: frequency.value
  })
  name.value = ''
  category.value = ''
  frequency.value = 'diario'
}
</script>

<style scoped>
.add-habit-card {
  background: var(--bg-surface);
  border: 1px solid var(--border-light);
  border-radius: 14px;
  padding: 18px 20px;
  margin-bottom: 20px;
}

.add-habit-card h3 {
  margin: 0 0 14px;
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
}

.add-form {
  display: grid;
  grid-template-columns: 1fr 160px 130px auto;
  gap: 12px;
}

.add-form input,
.add-form select {
  height: 42px;
  border: 1px solid var(--border-color);
  border-radius: 10px;
  padding: 0 14px;
  font: inherit;
  font-size: 14px;
  color: var(--text-primary);
  background: var(--bg-surface);
  outline: none;
}

.add-form input:focus,
.add-form select:focus {
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.12);
}

.create-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 42px;
  padding: 0 18px;
  border: none;
  border-radius: 10px;
  background: var(--accent-success);
  color: #fff;
  font: inherit;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.2s ease, opacity 0.2s ease;
}

.create-btn:hover:not(:disabled) {
  opacity: 0.9;
}

.create-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 900px) {
  .add-form {
    grid-template-columns: 1fr 1fr;
  }

  .add-form input {
    grid-column: 1 / -1;
  }
}
</style>