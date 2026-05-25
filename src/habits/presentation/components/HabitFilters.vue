<template>
  <div class="habit-filters">
    <div class="search-wrap">
      <i class="pi pi-search"></i>
      <input
          :value="searchQuery"
          type="text"
          :placeholder="$t('habits.filters.searchPlaceholder')"
          @input="$emit('update:searchQuery', $event.target.value)"
          class="theme-transition"
      />
    </div>
    <select
        :value="statusFilter"
        @change="$emit('update:statusFilter', $event.target.value)"
        class="theme-transition"
    >
      <option value="all">{{ $t('habits.filters.status.all') }}</option>
      <option value="completed">{{ $t('habits.filters.status.completed') }}</option>
      <option value="pending">{{ $t('habits.filters.status.pending') }}</option>
      <option value="paused_by_ai">{{ $t('habits.filters.status.paused_by_ai') }}</option>
    </select>
  </div>
</template>

<script setup>
defineProps({
  searchQuery: { type: String, default: '' },
  statusFilter: { type: String, default: 'all' }
})

defineEmits(['update:searchQuery', 'update:statusFilter'])
</script>

<style scoped>
.habit-filters {
  display: grid;
  grid-template-columns: 1fr 210px;
  gap: 14px;
  margin-bottom: 20px;
}

.search-wrap {
  position: relative;
}

.search-wrap i {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted);
  font-size: 15px;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  pointer-events: none;
}

.search-wrap:focus-within i {
  color: var(--accent-primary);
  transform: translateY(-50%) scale(1.1);
}

.search-wrap input,
.habit-filters select {
  width: 100%;
  height: 44px;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  font: inherit;
  font-size: 14px;
  color: var(--text-primary);
  background: var(--bg-surface-secondary);
  outline: none;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.search-wrap input {
  padding: 0 14px 0 40px;
}

.habit-filters select {
  padding: 0 12px;
  cursor: pointer;
}

.search-wrap input:hover,
.habit-filters select:hover {
  border-color: rgba(99, 102, 241, 0.2);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
}

.search-wrap input:focus,
.habit-filters select:focus {
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  transform: translateY(-2px);
}

.search-wrap input::placeholder {
  color: var(--text-muted);
  transition: color 0.3s ease;
}

.search-wrap input:focus::placeholder {
  color: var(--text-secondary);
}

@media (max-width: 768px) {
  .habit-filters {
    grid-template-columns: 1fr;
  }
}
</style>