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

    <div v-if="entry.tags?.length" class="tags">
      <span
          v-for="tag in entry.tags"
          :key="tag.id"
          class="tag-chip theme-transition"
      >
        #{{ tag.name }}
      </span>
    </div>

    <div v-if="entry.media?.length" class="media-section theme-transition">
      <div class="media-title">Adjuntos</div>
      <div class="media-grid">
        <a
            v-for="item in entry.media"
            :key="item.id"
            class="media-item theme-transition"
            :href="item.url"
            target="_blank"
            rel="noreferrer"
        >
          <img
              v-if="item.type === 'image'"
              class="media-image"
              :src="item.url"
              :alt="`Adjunto ${item.id}`"
          />
          <div v-else class="media-fallback">
            <span class="media-icon">{{ mediaIcon(item.type) }}</span>
            <span class="media-type">{{ item.type }}</span>
          </div>
        </a>
      </div>
    </div>

    <div v-if="entry.hasPreview && !entry.media?.length" class="preview theme-transition"></div>
  </article>
</template>

<script setup>
defineProps({
  entry: Object
})

const mediaIcon = (type) => {
  if (type === 'audio') return '🎧'
  if (type === 'document') return '📄'
  if (type === 'video') return '🎬'
  return '📎'
}
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

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 18px;
}

.tag-chip {
  padding: 6px 10px;
  border-radius: 999px;
  background: var(--bg-surface-secondary);
  color: var(--text-primary);
  font-size: 12px;
  font-weight: 600;
  border: 1px solid var(--border-light);
}

.media-section {
  margin-top: 18px;
}

.media-title {
  font-size: 12px;
  font-weight: 700;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-bottom: 10px;
}

.media-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 10px;
}

.media-item {
  display: block;
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid var(--border-light);
  background: var(--bg-surface-secondary);
  min-height: 90px;
}

.media-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px var(--shadow-lg);
}

.media-image {
  width: 100%;
  height: 120px;
  object-fit: cover;
  display: block;
}

.media-fallback {
  min-height: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  color: var(--text-secondary);
  padding: 14px;
}

.media-icon {
  font-size: 20px;
}

.media-type {
  font-size: 12px;
  font-weight: 600;
  text-transform: capitalize;
}

.preview {
  margin-top: 20px;
  height: 160px;
  border-radius: 14px;
  border: 1px dashed var(--border-color);
  background: var(--bg-surface-secondary);
}
</style>