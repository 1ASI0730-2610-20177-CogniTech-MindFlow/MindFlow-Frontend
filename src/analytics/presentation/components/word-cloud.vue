<template>
  <div class="premium-card word-cloud-container theme-transition">
    <div class="card-header">
      <h3 class="card-title theme-transition">{{ t('analytics.components.wordCloud.title') }}</h3>
      <span class="mono-subtitle">{{ t('analytics.components.wordCloud.subtitle') }}</span>
    </div>

    <div class="mock-word-cloud">
      <span
          v-for="(word, index) in renderedWords"
          :key="`${word.text || word.i18nKey || 'word'}-${index}`"
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
  { i18nKey: 'analytics.components.wordCloud.words.calm', size: 28, color: 'var(--global-green)', weight: 600, top: '30%', left: '20%' },
  { i18nKey: 'analytics.components.wordCloud.words.anxious', size: 12, color: '#ef4444', weight: 600, top: '60%', left: '25%' },
  { i18nKey: 'analytics.components.wordCloud.words.productive', size: 14, color: 'var(--text-muted)', weight: 500, top: '40%', left: '50%' },
  { i18nKey: 'analytics.components.wordCloud.words.grateful', size: 32, color: 'var(--global-blue)', weight: 700, top: '50%', left: '45%' },
  { i18nKey: 'analytics.components.wordCloud.words.family', size: 14, color: 'var(--text-primary)', weight: 700, top: '35%', left: '75%' },
  { i18nKey: 'analytics.components.wordCloud.words.tired', size: 18, color: '#f59e0b', weight: 600, top: '55%', left: '75%' }
]))

const renderedWords = computed(() => (props.words?.length ? props.words : fallbackWords.value))

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
  transition: 'color 0.3s ease'
})
</script>

<style scoped>
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

.word-cloud-container { height: 380px; position: relative; display: flex; flex-direction: column; }
.mock-word-cloud { position: relative; flex: 1; width: 100%; display: flex; align-items: center; justify-content: center; }
.mock-word-cloud span { position: absolute; transform: translate(-50%, -50%); }
</style>