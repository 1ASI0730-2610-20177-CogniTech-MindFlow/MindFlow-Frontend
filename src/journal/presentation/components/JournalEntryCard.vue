<template>
  <article class="entry-card hover-lift theme-transition">
    <div class="entry-header">
      <div class="entry-meta">
        <span class="icon">🗓</span>
        <span class="date">{{ entry.formattedDate }}</span>
      </div>
      <span class="badge theme-transition">{{ entry.category }}</span>
    </div>

    <h2 class="title theme-transition">{{ entry.title }}</h2>
    <p class="content theme-transition">{{ entry.content }}</p>

    <div v-if="entry.hasPreview" class="preview theme-transition"></div>
  </article>
</template>

<script setup>
defineProps({
  entry: Object
})
</script>

<style scoped>
.entry-card {
  background: var(--bg-surface);
  border-radius: 18px;
  padding: 24px;
  border: 1px solid var(--border-light);
  box-shadow: 0 1px 2px var(--shadow-sm), 0 8px 24px var(--shadow-lg);
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.3s ease, border-color 0.3s ease;
  will-change: transform, box-shadow;
}

.hover-lift:hover {
  transform: translateY(-4px) scale(1.01);
  box-shadow: 0 16px 32px var(--shadow-lg);
}

.entry-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
}

.entry-meta {
  display: flex;
  align-items: center;
  gap: 8px;
}

.icon {
  font-size: 13px;
}

.date {
  font-size: 13px;
  color: var(--text-secondary);
  font-weight: 500;
}

.badge {
  background: rgba(99, 102, 241, 0.1);
  color: var(--accent-primary);
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  transition: background-color 0.2s ease;
}
.entry-card:hover .badge {
  background: rgba(99, 102, 241, 0.15);
}

.title {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 14px;
  line-height: 1.3;
}

.content {
  font-size: 15px;
  line-height: 1.8;
  color: var(--text-secondary);
}

.preview {
  margin-top: 20px;
  height: 160px;
  border-radius: 14px;
  border: 1px dashed var(--border-color);
  background: var(--bg-surface-secondary);
}
</style>