<template>
  <div class="chat-layout">
    <!-- Sidebar de conversaciones -->
    <div class="chat-sidebar" :class="{ collapsed: !sidebarOpen }">
      <div class="sidebar-header">
        <h4 v-if="sidebarOpen">{{ t('dashboard.chat.history') || 'Historial' }}</h4>
        <button class="new-chat-btn" @click="handleNewChat">
          <i class="pi pi-plus"></i>
          <span v-if="sidebarOpen">{{ t('dashboard.chat.newChat') || 'Nuevo chat' }}</span>
        </button>
      </div>

      <div v-if="sidebarOpen" class="sidebar-list">
        <div
          v-for="conv in store.conversationsList"
          :key="conv.id"
          class="sidebar-item"
          :class="{ active: store.activeConversationId === conv.id }"
          @click="selectConversation(conv.id)"
        >
          <div class="sidebar-item-content">
            <span class="sidebar-item-title">{{ conv.title || 'Conversación' }}</span>
            <span class="sidebar-item-time">{{ formatShortTime(conv.updated_at || conv.created_at) }}</span>
          </div>
          <button class="delete-btn" @click.stop="deleteConversation(conv.id)">
            <i class="pi pi-trash"></i>
          </button>
        </div>

        <div v-if="!store.conversationsList.length" class="sidebar-empty">
          <i class="pi pi-comments"></i>
          <span>{{ t('dashboard.recentEntries.empty') }}</span>
        </div>
      </div>

      <button class="sidebar-toggle" @click="sidebarOpen = !sidebarOpen">
        <i :class="sidebarOpen ? 'pi pi-angle-left' : 'pi pi-angle-right'"></i>
      </button>
    </div>

    <!-- Panel de chat -->
    <div class="chat-container theme-transition">
      <div class="chat-header">
        <div class="chat-title">
          <button class="sidebar-mobile-toggle" @click="sidebarOpen = !sidebarOpen">
            <i class="pi pi-bars"></i>
          </button>
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
        <div v-if="!store.messages.length" class="chat-welcome">
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

        <template v-for="msg in store.messages" :key="msg.id">
          <div class="message" :class="msg.role === 'user' ? 'user-message' : 'ai-message'">
            <div v-if="msg.role === 'user'" class="message-avatar user-avatar">{{ userInitial }}</div>
            <div v-else class="message-avatar ai-avatar">
              <i class="pi pi-sparkles"></i>
            </div>
            <div class="message-content">
              <div class="message-header">
                <span class="message-author" :class="{ 'ai-name': msg.role === 'assistant' }">
                  {{ msg.role === 'user' ? t('dashboard.recentEntries.you') : 'MindFlow AI' }}
                </span>
                <span v-if="msg.created_at" class="message-time">{{ formatTime(msg.created_at) }}</span>
              </div>
              <p class="message-text">{{ msg.content }}</p>
            </div>
          </div>
        </template>

        <div v-if="store.isAnalyzing" class="message ai-message">
          <div class="message-avatar ai-avatar">
            <i class="pi pi-sparkles"></i>
          </div>
          <div class="message-content">
            <div class="typing-indicator">
              <span></span><span></span><span></span>
            </div>
          </div>
        </div>
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
const sidebarOpen = ref(true)
const messagesRef = ref(null)
const textareaRef = ref(null)

const userInitial = computed(() => authStore.userInitial || 'U')

const suggestions = computed(() => [
  t('dashboard.chat.suggestions.s1'),
  t('dashboard.chat.suggestions.s2'),
  t('dashboard.chat.suggestions.s3'),
  t('dashboard.chat.suggestions.s4')
])

function formatTime(dateStr) {
  return new Date(dateStr).toLocaleString(undefined, { weekday: 'long', hour: 'numeric', minute: 'numeric' })
}

function formatShortTime(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' })
}

function handleNewChat() {
  store.startNewConversation()
}

async function selectConversation(id) {
  await store.openConversation(id)
  await nextTick()
  scrollToBottom()
}

async function deleteConversation(id) {
  await store.deleteConversation(id)
}

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

watch(() => store.messages.length, () => {
  nextTick(() => scrollToBottom())
})
</script>

<style scoped>
.chat-layout {
  display: flex;
  height: 100%;
  border-radius: 24px;
  overflow: hidden;
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
}

/* Sidebar */
.chat-sidebar {
  width: 260px;
  background: var(--bg-surface-secondary);
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  transition: width 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
}

.chat-sidebar.collapsed {
  width: 0;
  overflow: hidden;
  border-right: none;
}

.sidebar-header {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  border-bottom: 1px solid var(--border-color);
}

.sidebar-header h4 {
  margin: 0;
  font-size: 14px;
  font-weight: 700;
  color: var(--text-primary);
}

.new-chat-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 14px;
  border-radius: 10px;
  border: 1px dashed var(--border-color);
  background: transparent;
  color: var(--text-secondary);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.new-chat-btn:hover {
  border-color: var(--accent-primary);
  color: var(--accent-primary);
  background: rgba(99, 102, 241, 0.05);
}

.sidebar-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}

.sidebar-item {
  display: flex;
  align-items: center;
  padding: 10px 12px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  gap: 8px;
}

.sidebar-item:hover {
  background: var(--bg-surface);
}

.sidebar-item.active {
  background: var(--bg-surface);
  box-shadow: 0 0 0 1px var(--accent-primary);
}

.sidebar-item-content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.sidebar-item-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sidebar-item-time {
  font-size: 11px;
  color: var(--text-muted);
}

.delete-btn {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  border: none;
  background: transparent;
  color: var(--text-muted);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.sidebar-item:hover .delete-btn {
  opacity: 1;
}

.delete-btn:hover {
  background: var(--accent-danger);
  color: #fff;
}

.sidebar-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 32px 16px;
  color: var(--text-muted);
  font-size: 13px;
  text-align: center;
}

.sidebar-empty i {
  font-size: 20px;
  opacity: 0.5;
}

.sidebar-toggle {
  position: absolute;
  right: -14px;
  top: 50%;
  transform: translateY(-50%);
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 1px solid var(--border-color);
  background: var(--bg-surface);
  color: var(--text-muted);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  transition: all 0.2s ease;
  box-shadow: var(--shadow-sm);
}

.sidebar-toggle:hover {
  color: var(--accent-primary);
  border-color: var(--accent-primary);
}

/* Chat panel */
.chat-container {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
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

.sidebar-mobile-toggle {
  display: none;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  background: var(--bg-surface-secondary);
  color: var(--text-secondary);
  cursor: pointer;
  align-items: center;
  justify-content: center;
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
  padding: 8px 16px 8px 14px;
  border-radius: 20px;
  border: 1px solid var(--border-color);
  background: var(--bg-surface-secondary);
  color: var(--text-secondary);
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;
}
.chip::before {
  content: '\2728';
  margin-right: 6px;
  font-size: 12px;
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
  .chat-sidebar {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    z-index: 5;
    box-shadow: var(--shadow-lg);
  }

  .chat-sidebar.collapsed {
    width: 0;
  }

  .sidebar-toggle {
    display: none;
  }

  .sidebar-mobile-toggle {
    display: flex;
  }

  .message {
    max-width: 92%;
  }
}
</style>
