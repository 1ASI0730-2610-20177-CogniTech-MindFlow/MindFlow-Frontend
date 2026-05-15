<template>
  <article class="entry-card hover-lift">
    <div class="entry-header">
      <div class="entry-meta">
        <span class="icon">🗓</span>
        <span class="date">{{ entry.date }}</span>
      </div>
      <span class="badge">{{ entry.category }}</span>
    </div>

    <h2 class="title">{{ entry.title }}</h2>
    <p class="content">{{ entry.content }}</p>

    <div v-if="entry.hasPreview" class="preview"></div>
  </article>
</template>

<script setup>
defineProps({
  entry: Object
})
</script>

<style scoped>
.entry-card {
  background: white;
  border-radius: 18px;
  padding: 24px;
  border: 1px solid #eceff3;
  box-shadow: 0 1px 2px rgba(0,0,0,.02), 0 8px 24px rgba(0,0,0,.03);
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  will-change: transform, box-shadow;
}

.hover-lift:hover {
  transform: translateY(-4px) scale(1.01);
  box-shadow: 0 16px 32px rgba(0,0,0,.08);
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
  color: #8b8b8b;
  font-weight: 500;
}

.badge {
  background: #eef4ff;
  color: #5b8def;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  transition: background-color 0.2s ease;
}
.entry-card:hover .badge {
  background: #e0ecff; /* Ligeramente más oscuro en hover de la tarjeta */
}

.title {
  font-size: 18px;
  font-weight: 700;
  color: #2b2b2b;
  margin-bottom: 14px;
  line-height: 1.3;
}

.content {
  font-size: 15px;
  line-height: 1.8;
  color: #555f6d;
}

.preview {
  margin-top: 20px;
  height: 160px;
  border-radius: 14px;
  border: 1px dashed #d6dbe3;
  background: #f8fafc;
}
</style>