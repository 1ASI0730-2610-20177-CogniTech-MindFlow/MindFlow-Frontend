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
        <i class="pi pi-plus" aria-hidden="true"></i> {{ $t('habits.addForm.create') }}
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
  border-radius: 16px;
  padding: 20px 22px;
  margin-bottom: 24px;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.add-habit-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
  border-color: rgba(99, 102, 241, 0.2);
}

.add-habit-card h3 {
  margin: 0 0 16px;
  font-size: 15px;
  font-weight: 700;
  color: var(--text-primary);
  transition: color 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.add-form {
  display: grid;
  grid-template-columns: 1fr 160px 130px auto;
  gap: 12px;
}

.add-form input,
.add-form select {
  height: 44px;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 0 14px;
  font: inherit;
  font-size: 14px;
  color: var(--text-primary);
  outline: none;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.add-form input {
  background: var(--bg-surface-secondary);
}

.add-form select {
  background: var(--bg-surface-secondary);
  cursor: pointer;
}

.add-form input:hover,
.add-form select:hover {
  border-color: rgba(99, 102, 241, 0.2);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.03);
}

.add-form input:focus,
.add-form select:focus {
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  transform: translateY(-2px);
}

.add-form input::placeholder {
  color: var(--text-muted);
  transition: color 0.3s ease;
}

.create-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 44px;
  padding: 0 20px;
  border: none;
  border-radius: 12px;
  background: var(--accent-success);
  color: #fff;
  font: inherit;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
}

.create-btn::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: width 0.5s, height 0.5s;
}

.create-btn:hover:not(:disabled)::before {
  width: 300px;
  height: 300px;
}

.create-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(34, 197, 94, 0.4);
}

.create-btn:active:not(:disabled) {
  transform: translateY(0);
}

.create-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  box-shadow: 0 2px 6px rgba(34, 197, 94, 0.1);
}

.create-btn i {
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.create-btn:hover:not(:disabled) i {
  transform: rotate(90deg) scale(1.1);
}

@media (max-width: 768px) {
  .add-form {
    grid-template-columns: 1fr 1fr;
  }

  .add-form input {
    grid-column: 1 / -1;
  }
}

@media (max-width: 480px) {
  .add-form {
    grid-template-columns: 1fr;
  }

  .create-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>