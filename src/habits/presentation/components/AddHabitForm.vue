<template>
  <section class="add-habit-card">
    <h3>{{ $t('habits.addForm.title') }}</h3>
    <form class="add-form" @submit.prevent="submit">
      <input
          v-model="name"
          type="text"
          :placeholder="$t('habits.addForm.placeholder')"
      />
      <select v-model="category" required>
        <option disabled value="">{{ $t('habits.addForm.category') }}</option>
        <option v-for="cat in categories" :key="cat" :value="cat">
          {{ cat }}
        </option>
      </select>
      <select v-model="frequency">
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
  background: #fff;
  border: 1px solid #edf0f5;
  border-radius: 14px;
  padding: 18px 20px;
  margin-bottom: 20px;
}

.add-habit-card h3 {
  margin: 0 0 14px;
  font-size: 15px;
  font-weight: 600;
  color: #1e293b;
}

.add-form {
  display: grid;
  grid-template-columns: 1fr 160px 130px auto;
  gap: 12px;
}

.add-form input,
.add-form select {
  height: 42px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 0 14px;
  font: inherit;
  font-size: 14px;
  color: #334155;
  background: #fff;
  outline: none;
}

.add-form input:focus,
.add-form select:focus {
  border-color: #a5b4fc;
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
  background: #22c55e;
  color: #fff;
  font: inherit;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
}

.create-btn:hover:not(:disabled) {
  background: #16a34a;
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