<template>
  <div class="premium-card word-cloud-container theme-transition">
    <div class="card-header">
      <h3 class="card-title theme-transition">{{ t('analytics.components.wordCloud.title') }}</h3>
      <span class="mono-subtitle">{{ t('analytics.components.wordCloud.subtitle') }}</span>
    </div>

    <div class="mock-word-cloud">
      <template v-if="styledWords.length">
        <span
            v-for="(word, index) in styledWords"
            :key="`${word.text || word.i18nKey || 'word'}-${index}`"
            class="cloud-word"
            :class="[word.weight >= 700 ? 'is-strong' : 'is-soft', { hovered: word.hovered }]"
            :style="wordStyle(word)"
            @mouseenter="hoveredWord = index"
            @mouseleave="hoveredWord = null"
        >
          {{ resolveWordText(word) }}
          <span v-if="hoveredWord === index && word.score" class="word-badge">{{ Math.round(word.score * 100) }}%</span>
        </span>
      </template>
      <div v-else class="empty-cloud">
        <i class="pi pi-cloud"></i>
        <p>{{ t('analytics.components.wordCloud.empty') || 'No hay datos suficientes' }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const hoveredWord = ref(null)

const props = defineProps({
  words: {
    type: Array,
    default: () => []
  }
})

const renderedWords = computed(() => props.words || [])

const styledWords = computed(() => {
  const tilts = ['-7deg', '3deg', '-2deg', '8deg', '-5deg', '2deg', '-4deg', '6deg']

  return renderedWords.value.map((word, index) => ({
    ...word,
    tilt: word.tilt || tilts[index % tilts.length],
    delay: `${index * 60}ms`,
    duration: `${4 + (index % 3) * 0.5}s`,
    hovered: hoveredWord.value === index
  }))
})

const resolveWordText = (word) => {
  if (word?.i18nKey) {
    const translated = t(word.i18nKey)
    return translated === word.i18nKey ? (word.text || word.i18nKey) : translated
  }

  return word?.text || ''
}

const wordStyle = (word) => {
  const baseTransform = `translate(-50%, -50%) rotate(${word.tilt || '0deg'})`

  return {
    fontSize: `${word.size ?? 14}px`,
    color: word.color || 'var(--text-primary)',
    fontWeight: word.weight ?? 600,
    top: word.top || '50%',
    left: word.left || '50%',
    transform: word.hovered ? `${baseTransform} scale(1.12)` : baseTransform,
    animationDelay: word.delay,
    animationDuration: word.duration,
    zIndex: word.hovered ? 10 : 1
  }
}
</script>

<style scoped>
.word-cloud-container {
  height: 100%;
  min-height: 300px;
  position: relative;
  display: flex;
  flex-direction: column;
}

.premium-card {
  background: var(--bg-surface);
  border: 1px solid var(--border-light);
  border-radius: 24px;
  box-shadow: var(--shadow-md);
  padding: 32px;
  transition: all 0.4s ease;
}

.card-header { margin-bottom: 24px; }
.card-title { font-size: 18px; color: var(--text-primary); margin: 0 0 4px 0; font-weight: 700; }
.mono-subtitle { font-size: 9px; font-weight: 600; color: var(--text-muted); letter-spacing: 0.1em; text-transform: uppercase; }

.mock-word-cloud {
  position: relative;
  flex: 1;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 18px;
  background:
      radial-gradient(circle at 20% 20%, color-mix(in srgb, var(--accent-primary) 14%, transparent), transparent 46%),
      radial-gradient(circle at 80% 65%, color-mix(in srgb, var(--accent-success) 13%, transparent), transparent 43%),
      radial-gradient(circle at 50% 85%, color-mix(in srgb, var(--accent-warning) 8%, transparent), transparent 42%),
      linear-gradient(180deg, color-mix(in srgb, var(--text-primary) 4%, transparent), transparent);
  overflow: hidden;
}

.cloud-word {
  position: absolute;
  line-height: 1;
  white-space: nowrap;
  user-select: none;
  letter-spacing: 0.01em;
  text-shadow: 0 1px 0 color-mix(in srgb, var(--bg-surface) 75%, transparent);
  opacity: 0;
  animation-name: cloudIn, cloudFloat;
  animation-fill-mode: forwards, both;
  animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1), ease-in-out;
  animation-duration: 420ms, 4.2s;
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), filter 0.3s ease, opacity 0.24s ease;
  cursor: default;
  padding: 4px 8px;
  border-radius: 6px;
  margin: -4px -8px;
}

.cloud-word.is-strong {
  letter-spacing: 0;
}

.cloud-word.is-soft {
  opacity: 0.92;
}

.cloud-word:hover {
  filter: brightness(1.05) drop-shadow(0 6px 20px color-mix(in srgb, var(--text-primary) 15%, transparent));
  background: color-mix(in srgb, var(--bg-surface) 70%, transparent);
}

.word-badge {
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 9px;
  font-weight: 700;
  color: var(--accent-primary);
  background: var(--bg-surface);
  border: 1px solid var(--border-light);
  border-radius: 4px;
  padding: 1px 5px;
  white-space: nowrap;
  box-shadow: 0 2px 6px rgba(0,0,0,0.08);
  pointer-events: none;
  animation: badgePop 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes badgePop {
  from { transform: translateX(-50%) scale(0.7); opacity: 0; }
  to { transform: translateX(-50%) scale(1); opacity: 1; }
}

@keyframes cloudIn {
  from { opacity: 0; transform: translate(-50%, -50%) scale(0.86); }
  to { opacity: 1; }
}

@keyframes cloudFloat {
  0%, 100% { margin-top: 0; }
  50% { margin-top: -3px; }
}

.empty-cloud {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: var(--text-muted);
}

.empty-cloud i {
  font-size: 32px;
  opacity: 0.4;
}

.empty-cloud p {
  margin: 0;
  font-size: 14px;
}
</style>