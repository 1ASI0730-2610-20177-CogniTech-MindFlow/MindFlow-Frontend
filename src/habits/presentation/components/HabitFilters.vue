<template>
  <div class="habit-filters">
    <div class="search-wrap">
      <i class="pi pi-search"></i>
      <input
          :value="searchQuery"
          type="text"
          :placeholder="$t('habits.filters.searchPlaceholder')"
          @input="$emit('update:searchQuery', $event.target.value)"
      />
    </div>
    <select
        :value="statusFilter"
        @change="$emit('update:statusFilter', $event.target.value)"
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
  color: #94a3b8;
  font-size: 14px;
}

.search-wrap input,
.habit-filters select {
  width: 100%;
  height: 42px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  font: inherit;
  font-size: 14px;
  color: #334155;
  background: #fff;
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
  border-color: #a5b4fc;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.12);
}
</style>