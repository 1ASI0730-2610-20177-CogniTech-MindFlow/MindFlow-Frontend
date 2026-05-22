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
  grid-template-columns: 1fr 200px;
  gap: 12px;
  margin-bottom: 16px;
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
  font-size: 14px;
}

.search-wrap input,
.habit-filters select {
  width: 100%;
  height: 42px;
  border: 1px solid var(--border-color);
  border-radius: 10px;
  font: inherit;
  font-size: 14px;
  color: var(--text-primary);
  background: var(--bg-surface);
  outline: none;
}

.search-wrap input {
  padding: 0 14px 0 40px;
}

.habit-filters select {
  padding: 0 12px;
}

.search-wrap input:focus,
.habit-filters select:focus {
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.18);
}
</style>