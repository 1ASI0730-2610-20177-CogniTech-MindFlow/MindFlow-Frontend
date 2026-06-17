<template>
  <div class="chat-container theme-transition">
    <div class="chat-header">
      <div class="chat-title">
        <i class="pi pi-sparkles"></i>
        <h3>MindFlow AI</h3>
      </div>
      <div class="chat-header-actions">
        <div class="ai-status">
          <span class="status-dot"></span> {{ t('dashboard.moodInput.aiActive') }}
        </div>
        <button class="close-btn" @click="$emit('close')" :aria-label="t('journal.composer.close')">
          <i class="pi pi-times"></i>
        </button>
      </div>
    </div>

    <div ref="messagesRef" class="chat-messages">
      <div v-if="!store.conversations.length" class="chat-welcome">
        <div class="welcome-icon">
          <i class="pi pi-sparkles"></i>
        </div>
        <h4>{{ t('dashboard.chat.welcomeTitle') }}</h4>
        <p>{{ t('dashboard.chat.welcomeDesc') }}</p>
        <div class="suggestion-chips">
          <button v-for="s in suggestions" :key="s" class="chip" @click="sendSuggestion(s)">
            {{ s }}
          </button>
        </div>
      </div>

      <template v-for="msg in reversedConversations" :key="msg.id">
        <div class="message user-message">
          <div class="message-avatar user-avatar">{{ userInitial }}</div>
          <div class="message-content">
            <div class="message-header">
              <span class="message-author">{{ t('dashboard.recentEntries.you') }}</span>
              <span class="message-time">{{ msg.time }}</span>
            </div>
            <p class="message-text">{{ msg.text }}</p>
            <span class="message-tag">{{ msg.tag }}</span>
          </div>
        </div>

        <div v-if="msg.aiResponse" class="message ai-message">
          <div class="message-avatar ai-avatar">
            <i class="pi pi-sparkles"></i>
          </div>
          <div class="message-content">
            <div class="message-header">
              <span class="message-author ai-name">MindFlow AI</span>
            </div>
            <p class="message-text">{{ msg.aiResponse }}</p>
            <div v-if="store.conversations[0]?.id === msg.id && !store.ratingSubmitted" class="rating-inline">
              <span
                v-for="star in 5"
                :key="star"
                class="star"
                :class="{ filled: star <= hoverRating || star <= store.aiRating }"
                @click="store.submitAiRating(star)"
                @mouseenter="hoverRating = star"
                @mouseleave="hoverRating = 0"
              >&#9733;</span>
            </div>
            <p v-if="store.conversations[0]?.id === msg.id && store.ratingSubmitted" class="rating-thanks">
              {{ t('dashboard.moodInput.ratingThanks') }}
            </p>
          </div>
        </div>

        <div v-else-if="store.isAnalyzing && store.conversations[0]?.id === msg.id" class="message ai-message">
          <div class="message-avatar ai-avatar">
            <i class="pi pi-sparkles"></i>
          </div>
          <div class="message-content">
            <div class="typing-indicator">
              <span></span><span></span><span></span>
            </div>
          </div>
        </div>
      </template>
    </div>

    <div class="chat-input-area">
      <select v-model="selectedTag" class="tag-select">
        <option value="Personal">{{ t('dashboard.moodInput.tags.personal') }}</option>
        <option value="Estudios">{{ t('dashboard.moodInput.tags.studies') }}</option>
        <option value="Trabajo">{{ t('dashboard.moodInput.tags.work') }}</option>
        <option value="Familia">{{ t('dashboard.moodInput.tags.family') }}</option>
      </select>
      <div class="input-row">
        <textarea
          v-model="message"
          :placeholder="t('dashboard.moodInput.placeholder')"
          class="chat-textarea"
          rows="1"
          @keydown.enter.exact.prevent="send"
          @input="autoResize"
          ref="textareaRef"
        ></textarea>
        <button class="send-btn" @click="send" :disabled="!message.trim() || store.isAnalyzing">
          <i class="pi pi-send"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useDashboardStore } from '@/dashboard/application/dashboard.store'
import { useAuthStore } from '@/iam/application/auth.store.js'

defineEmits(['close'])

const { t } = useI18n()
const store = useDashboardStore()
const authStore = useAuthStore()

const message = ref('')
const selectedTag = ref('Personal')
const hoverRating = ref(0)
const messagesRef = ref(null)
const textareaRef = ref(null)

const userInitial = computed(() => authStore.userInitial || 'U')

const reversedConversations = computed(() => [...store.conversations].reverse())

const suggestions = [
  'Hoy me siento ansioso por el trabajo',
  'Tuve un buen dia, estoy agradecido',
  'No puedo dormir bien ultimamente',
  'Me siento estresado por los examenes'
]

async function send() {
  if (!message.value.trim() || store.isAnalyzing) return
  const text = message.value.trim()
  message.value = ''
  if (textareaRef.value) textareaRef.value.style.height = 'auto'
  await store.submitMessage(text, selectedTag.value)
  await nextTick()
  scrollToBottom()
}

function sendSuggestion(text) {
  message.value = text
  send()
}

function scrollToBottom() {
  if (messagesRef.value) {
    messagesRef.value.scrollTop = messagesRef.value.scrollHeight
  }
}

function autoResize(e) {
  const el = e.target
  el.style.height = 'auto'
  el.style.height = Math.min(el.scrollHeight, 120) + 'px'
}

watch(() => store.conversations.length, () => {
  nextTick(() => scrollToBottom())
})
</script>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  height: 600px;
  padding: 0;
  overflow: hidden;
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: 24px;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid var(--border-color);
}

.chat-title {
  display: flex;
  align-items: center;
  gap: 10px;
}

.chat-title i {
  color: var(--accent-primary);
  font-size: 18px;
}

.chat-title h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: var(--text-primary);
}

.chat-header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.close-btn {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  background: var(--bg-surface-secondary);
  color: var(--text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  position: relative;
  z-index: 10;
}

.close-btn:hover {
  background: var(--accent-danger);
  color: #fff;
  border-color: var(--accent-danger);
}

.ai-status {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  font-weight: 600;
  color: var(--text-secondary);
}

.status-dot {
  width: 8px;
  height: 8px;
  background: var(--accent-success);
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.chat-welcome {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  flex: 1;
  gap: 12px;
  padding: 32px;
}

.welcome-icon {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: rgba(99, 102, 241, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: var(--accent-primary);
}

.chat-welcome h4 {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
}

.chat-welcome p {
  margin: 0;
  font-size: 14px;
  color: var(--text-secondary);
  max-width: 360px;
  line-height: 1.5;
}

.suggestion-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
  margin-top: 8px;
}

.chip {
  padding: 8px 16px;
  border-radius: 20px;
  border: 1px solid var(--border-color);
  background: var(--bg-surface-secondary);
  color: var(--text-secondary);
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.chip:hover {
  border-color: var(--accent-primary);
  color: var(--accent-primary);
  background: rgba(99, 102, 241, 0.05);
}

.message {
  display: flex;
  gap: 12px;
  max-width: 85%;
}

.user-message {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.ai-message {
  align-self: flex-start;
}

.message-avatar {
  width: 32px;
  height: 32px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 700;
  flex-shrink: 0;
}

.user-avatar {
  background: var(--accent-primary);
  color: #fff;
}

.ai-avatar {
  background: rgba(99, 102, 241, 0.1);
  color: var(--accent-primary);
  font-size: 14px;
}

.message-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.message-header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.message-author {
  font-size: 12px;
  font-weight: 700;
  color: var(--text-primary);
}

.ai-name {
  color: var(--accent-primary);
}

.message-time {
  font-size: 11px;
  color: var(--text-muted);
}

.message-text {
  margin: 0;
  font-size: 14px;
  line-height: 1.65;
  color: var(--text-primary);
  padding: 12px 16px;
  border-radius: 16px;
  background: var(--bg-surface-secondary);
  border: 1px solid var(--border-color);
}

.user-message .message-text {
  background: var(--accent-primary);
  color: #fff;
  border-color: var(--accent-primary);
  border-bottom-right-radius: 4px;
}

.ai-message .message-text {
  border-bottom-left-radius: 4px;
}

.message-tag {
  font-size: 10px;
  font-weight: 600;
  color: var(--accent-primary);
  opacity: 0.7;
}

.user-message .message-tag {
  text-align: right;
}

.typing-indicator {
  display: flex;
  gap: 4px;
  padding: 14px 18px;
  background: var(--bg-surface-secondary);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  border-bottom-left-radius: 4px;
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--text-muted);
  animation: typing 1.4s infinite;
}

.typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
.typing-indicator span:nth-child(3) { animation-delay: 0.4s; }

@keyframes typing {
  0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
  30% { transform: translateY(-6px); opacity: 1; }
}

.rating-inline {
  display: flex;
  gap: 2px;
  margin-top: 4px;
}

.star {
  font-size: 18px;
  color: var(--text-muted);
  opacity: 0.3;
  cursor: pointer;
  transition: all 0.15s ease;
  line-height: 1;
}

.star.filled {
  color: var(--accent-warning);
  opacity: 1;
}

.star:hover {
  transform: scale(1.2);
  opacity: 1;
}

.rating-thanks {
  margin: 4px 0 0;
  font-size: 12px;
  color: var(--accent-primary);
  font-weight: 500;
}

.chat-input-area {
  padding: 16px 24px 20px;
  border-top: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.tag-select {
  width: fit-content;
  padding: 6px 12px;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  background: var(--bg-surface-secondary);
  color: var(--text-secondary);
  font-size: 12px;
  font-weight: 500;
  outline: none;
  cursor: pointer;
}

.input-row {
  display: flex;
  gap: 10px;
  align-items: flex-end;
}

.chat-textarea {
  flex: 1;
  padding: 12px 16px;
  border-radius: 14px;
  border: 1px solid var(--border-color);
  background: var(--bg-surface-secondary);
  color: var(--text-primary);
  font-family: inherit;
  font-size: 14px;
  resize: none;
  outline: none;
  max-height: 120px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.chat-textarea:focus {
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.08);
}

.chat-textarea::placeholder {
  color: var(--text-muted);
}

.send-btn {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  border: none;
  background: var(--accent-primary);
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.send-btn:hover:not(:disabled) {
  background: var(--accent-hover);
  transform: scale(1.05);
}

.send-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.send-btn i {
  font-size: 16px;
}

@media (max-width: 768px) {
  .chat-container {
    height: 500px;
  }

  .message {
    max-width: 92%;
  }
}
</style>
