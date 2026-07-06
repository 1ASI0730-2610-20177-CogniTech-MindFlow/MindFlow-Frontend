<template>
  <article class="entry-card hover-lift theme-transition">
    <div class="entry-header">
      <div class="entry-meta">
        <i class="pi pi-calendar icon"></i>
        <span class="date">{{ entry.formattedDate }}</span>
        <span v-if="entry.sentiment" class="sentiment-dot" :class="entry.sentiment"></span>
      </div>
      <div class="badge-group">
        <span v-if="entry.pendingSync" class="badge pending-badge theme-transition">
          <i class="pi pi-clock"></i> {{ $t('journal.offline.pendingBadge') }}
        </span>
        <span class="badge theme-transition">{{ entry.category }}</span>
      </div>
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
      <div class="media-title">{{ $t('journal.entryCard.attachments') }}</div>
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
            <i :class="mediaIcon(item.type)"></i>
            <span class="media-type">{{ item.type }}</span>
          </div>
        </a>
      </div>
    </div>

    <div v-if="entry.aiResponse" class="ai-response theme-transition">
      <div class="ai-response-header">
        <i class="pi pi-sparkles ai-icon"></i>
        <span class="ai-label">MindFlow AI</span>
      </div>
      <p class="ai-text">{{ entry.aiResponse }}</p>
    </div>

    <div v-if="entry.hasPreview && !entry.media?.length" class="preview theme-transition"></div>
  </article>
</template>

<script setup>
defineProps({
  entry: Object
})

const mediaIcon = (type) => {
  if (type === 'audio') return 'pi pi-headphones'
  if (type === 'document') return 'pi pi-file'
  if (type === 'video') return 'pi pi-video'
  return 'pi pi-paperclip'
}
</script>

<style scoped>
.entry-card {
  background: var(--bg-surface);
  border-radius: 18px;
  padding: 24px;
  border: 1px solid var(--border-light);
  box-shadow: var(--shadow-sm), var(--shadow-lg);
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.3s ease, border-color 0.3s ease;
}

.hover-lift:hover {
  will-change: transform, box-shadow;
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.entry-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
  gap: 12px;
}

.entry-meta {
  display: flex;
  align-items: center;
  gap: 8px;
}

.badge-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.icon {
  font-size: 13px;
  color: var(--text-muted);
}

.date {
  font-size: 13px;
  color: var(--text-secondary);
  font-weight: 500;
}

.sentiment-dot {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  flex-shrink: 0;
}
.sentiment-dot.positive {
  background: var(--accent-success);
  box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.2);
}
.sentiment-dot.neutral {
  background: var(--accent-warning);
  box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.2);
}
.sentiment-dot.negative {
  background: var(--accent-danger);
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.2);
}

.badge {
  background: rgba(99, 102, 241, 0.1);
  color: var(--accent-primary);
  padding: 5px 12px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
  transition: background-color 0.2s ease;
}
.entry-card:hover .badge {
  background: rgba(99, 102, 241, 0.15);
}

.pending-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: rgba(245, 158, 11, 0.12);
  color: var(--accent-warning, #f59e0b);
}

.entry-card:hover .pending-badge {
  background: rgba(245, 158, 11, 0.18);
}

.title {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 12px;
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
  padding: 5px 10px;
  border-radius: 8px;
  background: var(--bg-surface-secondary);
  color: var(--text-secondary);
  font-size: 12px;
  font-weight: 500;
  border: 1px solid var(--border-light);
  border-left: 2px solid var(--accent-primary);
  transition: all 0.2s ease;
}
.tag-chip:hover {
  background: rgba(99, 102, 241, 0.08);
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
  transition: transform 0.2s, box-shadow 0.2s;
}

.media-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.08);
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
  color: var(--text-muted);
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

.ai-response {
  margin-top: 18px;
  padding: 16px;
  background: rgba(99, 102, 241, 0.05);
  border: 1px solid rgba(99, 102, 241, 0.12);
  border-radius: 14px;
}

.ai-response-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.ai-icon {
  color: var(--accent-primary);
  font-size: 14px;
}

.ai-label {
  font-size: 12px;
  font-weight: 700;
  color: var(--accent-primary);
  letter-spacing: 0.02em;
}

.ai-text {
  font-size: 14px;
  line-height: 1.7;
  color: var(--text-secondary);
  margin: 0;
}

.preview {
  margin-top: 20px;
  height: 160px;
  border-radius: 14px;
  border: 1px dashed var(--border-color);
  background: var(--bg-surface-secondary);
}
</style>