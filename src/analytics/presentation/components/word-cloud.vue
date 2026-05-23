<template>
  <div class="premium-card word-cloud-container theme-transition">
    <div class="card-header">
      <h3 class="card-title theme-transition">{{ t('analytics.components.wordCloud.title') }}</h3>
      <span class="mono-subtitle">{{ t('analytics.components.wordCloud.subtitle') }}</span>
    </div>

    <div class="mock-word-cloud">
      <span
          v-for="(word, index) in styledWords"
          :key="`${word.text || word.i18nKey || 'word'}-${index}`"
          class="cloud-word"
          :class="word.weight >= 700 ? 'is-strong' : 'is-soft'"
          :style="wordStyle(word)"
      >
        {{ resolveWordText(word) }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  words: {
    type: Array,
    default: () => []
  }
})

const fallbackWords = computed(() => ([
  { i18nKey: 'analytics.components.wordCloud.words.calm', size: 28, color: 'var(--accent-success)', weight: 600, top: '30%', left: '20%' },
  { i18nKey: 'analytics.components.wordCloud.words.anxious', size: 12, color: 'var(--accent-danger)', weight: 600, top: '60%', left: '25%' },
  { i18nKey: 'analytics.components.wordCloud.words.productive', size: 14, color: 'var(--text-secondary)', weight: 500, top: '40%', left: '50%' },
  { i18nKey: 'analytics.components.wordCloud.words.grateful', size: 32, color: 'var(--accent-primary)', weight: 700, top: '50%', left: '45%' },
  { i18nKey: 'analytics.components.wordCloud.words.family', size: 14, color: 'var(--text-primary)', weight: 700, top: '35%', left: '75%' },
  { i18nKey: 'analytics.components.wordCloud.words.tired', size: 18, color: 'var(--accent-warning)', weight: 600, top: '55%', left: '75%' }
]))

const renderedWords = computed(() => (props.words?.length ? props.words : fallbackWords.value))

const styledWords = computed(() => {
  const tilts = ['-8deg', '4deg', '-3deg', '9deg', '-6deg', '2deg']

  return renderedWords.value.map((word, index) => ({
    ...word,
    tilt: word.tilt || tilts[index % tilts.length],
    delay: `${index * 70}ms`,
    duration: `${3.8 + (index % 4) * 0.35}s`
  }))
})

const resolveWordText = (word) => {
  if (word?.i18nKey) {
    const translated = t(word.i18nKey)
    return translated === word.i18nKey ? (word.text || word.i18nKey) : translated
  }

  return word?.text || ''
}

const wordStyle = (word) => ({
  fontSize: `${word.size ?? 14}px`,
  color: word.color || 'var(--text-primary)',
  fontWeight: word.weight ?? 600,
  top: word.top || '50%',
  left: word.left || '50%',
  transform: `translate(-50%, -50%) rotate(${word.tilt || '0deg'})`,
  animationDelay: word.delay,
  animationDuration: word.duration
})
</script>

<style scoped>
.word-cloud-container {
  height: 380px;
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
  transition: transform 0.24s ease, filter 0.24s ease, opacity 0.24s ease;
}

.cloud-word.is-strong {
  letter-spacing: 0;
}

.cloud-word.is-soft {
  opacity: 0.92;
}

.cloud-word:hover {
  filter: brightness(1.07) drop-shadow(0 8px 16px color-mix(in srgb, var(--text-primary) 18%, transparent));
  transform: translate(-50%, -50%) scale(1.06);
}

@keyframes cloudIn {
  from {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.86);
  }

  to {
    opacity: 1;
  }
}

@keyframes cloudFloat {
  0%,
  100% {
    margin-top: 0;
  }

  50% {
    margin-top: -3px;
  }
}
</style>