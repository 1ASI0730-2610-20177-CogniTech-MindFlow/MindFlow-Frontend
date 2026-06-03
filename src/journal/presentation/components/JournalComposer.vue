<template>
  <div v-if="open" class="composer-backdrop" @click.self="$emit('close')">
    <section class="composer-card theme-transition">
      <header class="composer-header">
        <div>
          <p class="eyebrow">{{ $t('journal.composer.eyebrow') }}</p>
          <h2>{{ $t('journal.composer.title') }}</h2>
        </div>

        <button type="button" class="close-btn" @click="$emit('close')" :aria-label="$t('journal.composer.close')">
          <span class="close-symbol">×</span>
        </button>
      </header>

      <form class="composer-form" @submit.prevent="submit">
        <label>
          <span>{{ $t('journal.composer.fields.title') }}</span>
          <input v-model="form.title" type="text" class="theme-transition" :placeholder="$t('journal.composer.placeholders.title')" />
        </label>

        <label>
          <span>{{ $t('journal.composer.fields.category') }}</span>
          <select v-model="form.category" class="theme-transition">
            <option value="Reflexión Personal">{{ $t('journal.composer.categories.reflection') }}</option>
            <option value="Trabajo">{{ $t('journal.composer.categories.work') }}</option>
            <option value="Estudios">{{ $t('journal.composer.categories.studies') }}</option>
            <option value="Familia">{{ $t('journal.composer.categories.family') }}</option>
          </select>
        </label>

        <div class="two-columns">
          <label>
            <span>{{ $t('journal.composer.fields.date') }}</span>
            <input v-model="form.date" type="date" class="theme-transition" />
          </label>

          <label>
            <span>{{ $t('journal.composer.fields.sentiment') }}</span>
            <select v-model="form.sentiment" class="theme-transition">
              <option value="positive">{{ $t('journal.composer.sentiments.positive') }}</option>
              <option value="neutral">{{ $t('journal.composer.sentiments.neutral') }}</option>
              <option value="negative">{{ $t('journal.composer.sentiments.negative') }}</option>
            </select>
          </label>
        </div>

        <label>
          <span>{{ $t('journal.composer.fields.content') }}</span>
          <textarea
            v-model="form.content"
            rows="6"
            class="theme-transition"
            :placeholder="$t('journal.composer.placeholders.content')"
          />
        </label>

        <div class="actions">
          <button type="button" class="secondary-btn theme-transition" @click="$emit('close')">
            {{ $t('journal.composer.cancel') }}
          </button>
          <button type="submit" class="primary-btn theme-transition" :disabled="!canSubmit || isSaving">
            <i class="pi pi-send"></i>
            {{ isSaving ? $t('journal.composer.saving') : $t('journal.composer.save') }}
          </button>
        </div>
      </form>
    </section>
  </div>
</template>

<script setup>
import { computed, reactive, watch } from 'vue'

const props = defineProps({
  open: { type: Boolean, default: false },
  isSaving: { type: Boolean, default: false },
  initialDate: { type: String, default: '' }
})

const emit = defineEmits(['close', 'submit'])

const today = new Date().toISOString().slice(0, 10)

const form = reactive({
  title: '',
  category: 'Reflexión Personal',
  date: props.initialDate || today,
  sentiment: 'neutral',
  content: ''
})

const canSubmit = computed(() => Boolean(form.title.trim() && form.content.trim() && form.date))

watch(
  () => props.open,
  (value) => {
    if (value) {
      form.title = ''
      form.category = 'Reflexión Personal'
      form.date = props.initialDate || today
      form.sentiment = 'neutral'
      form.content = ''
    }
  }
)

watch(
  () => props.initialDate,
  (value) => {
    if (value) {
      form.date = value
    }
  }
)

const submit = () => {
  if (!canSubmit.value) return

  emit('submit', {
    title: form.title.trim(),
    category: form.category,
    date: form.date,
    sentiment: form.sentiment,
    content: form.content.trim(),
    hasPreview: false
  })
}
</script>

<style scoped>
.composer-backdrop {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(15, 23, 42, 0.5);
  backdrop-filter: blur(8px);
  animation: backdropIn 0.2s ease;
}
@keyframes backdropIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.composer-card {
  width: min(720px, 100%);
  background: var(--bg-surface);
  border: 1px solid var(--border-light);
  border-radius: 24px;
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.25);
  padding: 28px;
}

.composer-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;
}

.eyebrow {
  margin: 0 0 6px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--accent-primary);
}

.composer-header h2 {
  margin: 0;
  font-size: 22px;
  font-weight: 700;
  color: var(--text-primary);
}

.close-btn {
  width: 40px;
  height: 40px;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  background: var(--bg-surface-secondary);
  color: var(--text-muted);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  transition: background 0.2s, color 0.2s, border-color 0.2s, box-shadow 0.2s;
}
.close-btn:active {
  transform: scale(0.92);
}
.close-btn:hover {
  background: var(--accent-primary);
  border-color: var(--accent-primary);
  color: #fff;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
}

.composer-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.composer-form label {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.composer-form span {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-secondary);
}

.composer-form input,
.composer-form select,
.composer-form textarea {
  width: 100%;
  border: 1px solid var(--border-color);
  border-radius: 14px;
  background: var(--bg-surface-secondary);
  color: var(--text-primary);
  font: inherit;
  font-size: 14px;
  padding: 14px 16px;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.composer-form input:focus,
.composer-form select:focus,
.composer-form textarea:focus {
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.12);
  background: var(--bg-surface);
}

.composer-form textarea {
  resize: vertical;
  min-height: 160px;
}

.two-columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 8px;
}

.secondary-btn,
.primary-btn {
  height: 44px;
  border-radius: 12px;
  padding: 0 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: transform 0.2s, box-shadow 0.2s;
}

.secondary-btn {
  border: 1px solid var(--border-color);
  background: transparent;
  color: var(--text-secondary);
}
.secondary-btn:hover {
  background: var(--bg-surface-secondary);
  color: var(--text-primary);
}

.primary-btn {
  border: none;
  background: linear-gradient(135deg, var(--accent-primary), var(--accent-hover));
  color: white;
  box-shadow: 0 8px 20px rgba(99, 102, 241, 0.25);
}
.primary-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 12px 28px rgba(99, 102, 241, 0.3);
}

.primary-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 720px) {
  .composer-card {
    padding: 20px;
  }

  .two-columns {
    grid-template-columns: 1fr;
  }

  .actions {
    flex-direction: column-reverse;
  }

  .secondary-btn,
  .primary-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>

