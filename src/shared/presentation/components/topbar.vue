<template>
  <header class="topbar theme-transition">
    <div>
      <h2 class="greeting">{{ currentTitle }}</h2>
      <p class="subtitle">{{ formattedDate }} · {{ $t('topbar.subtitle') }}</p>
    </div>

    <div class="topbar-actions">
      <div class="search" ref="searchContainer">
        <span class="search-icon"><i class="pi pi-search"></i></span>
        <input
          type="text"
          :placeholder="$t('topbar.search')"
          class="theme-transition"
          v-model="searchQuery"
          @focus="isSearchOpen = true"
        />

        <!-- Search Results Dropdown -->
        <div v-if="isSearchOpen && searchQuery.trim()" class="search-results theme-transition">
          <div v-if="filteredSections.length > 0" class="search-section">
            <h4 class="search-section-title">{{ $t('topbar.sections') }}</h4>
            <div
              v-for="section in filteredSections"
              :key="section.path"
              class="search-item theme-transition"
              @click="navigateToSection(section.path)"
            >
              <i :class="['pi', section.icon, 'search-item-icon']"></i>
              <span>{{ $t(section.label) }}</span>
            </div>
          </div>
          <div v-else class="no-results">
            <i class="pi pi-inbox"></i>
            <p>{{ $t('topbar.noResults') }}</p>
          </div>
        </div>
      </div>

      <LanguageSwitcher />

      <NotificationBell
        :notifications="notifStore.notifications"
        :unreadCount="notifStore.unreadCount"
        @markRead="notifStore.markAsRead"
        @markAllRead="notifStore.markAllAsRead"
        @dismiss="notifStore.dismissNotification"
      />

      <div class="avatar theme-transition" :class="{ loading: !store.profile }">{{ avatarInitial }}</div>
    </div>
  </header>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import LanguageSwitcher from './language-switcher.vue'
import NotificationBell from '@/notifications/presentation/components/notification-bell.vue'
import { useSettingsStore } from '@/settings/application/settings.store.js'
import { useNotificationsStore } from '@/notifications/application/notifications.store'
import { useI18n } from 'vue-i18n'

const route = useRoute()
const router = useRouter()
const store = useSettingsStore()
const notifStore = useNotificationsStore()
const { t } = useI18n()

const avatarInitial = computed(() => {
  if (store.profile?.initial) return store.profile.initial
  const name = store.profile?.name || 'U'
  return name.charAt(0).toUpperCase()
})

const currentTitle = computed(() => {
  // Use the route name to translate the title dynamically, fallback to greeting
  if (route.name) {
     return t(`menu.${route.name.toLowerCase()}`)
  }
  return route.meta?.title || t('greeting.hello')
})

const formattedDate = computed(() => {
  const options = { weekday: 'long', day: 'numeric', month: 'long' }
  // You might want to pass the current locale dynamically, e.g., using i18n.locale.value
  return new Date().toLocaleDateString('es-ES', options)
})

// Search Functionality
const searchQuery = ref('')
const isSearchOpen = ref(false)
const searchContainer = ref(null)

const sections = [
  { path: '/dashboard', label: 'menu.dashboard', icon: 'pi-objects-column' },
  { path: '/journal', label: 'menu.journal', icon: 'pi-book' },
  { path: '/habits', label: 'menu.habits', icon: 'pi-check-circle' },
  { path: '/analytics', label: 'menu.analytics', icon: 'pi-chart-bar' },
  { path: '/settings', label: 'menu.settings', icon: 'pi-cog' }
]

const filteredSections = computed(() => {
  const query = searchQuery.value.toLowerCase().trim()
  if (!query) return []
  return sections.filter(section =>
    t(section.label).toLowerCase().includes(query)
  )
})

const navigateToSection = (path) => {
  router.push(path)
  isSearchOpen.value = false
  searchQuery.value = ''
}

// Click outside to close search
const handleClickOutside = (event) => {
  if (searchContainer.value && !searchContainer.value.contains(event.target)) {
    isSearchOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  const userId = store.currentUserId || 'u1'
  notifStore.fetchNotifications(userId)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

</script>

<style scoped>
.topbar {
  height: 80px;
  background: var(--bg-surface);
  border-bottom: 1px solid var(--border-color);
  padding: 0 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  position: relative; /* Ensure dropdown context */
  z-index: 10;
}

.greeting {
  color: var(--text-primary);
  font-size: 20px;
  font-weight: 700;
  margin: 0 0 4px 0;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.subtitle {
  color: var(--text-secondary);
  font-size: 13px;
  margin: 0;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.topbar-actions {
  display: flex;
  align-items: center;
  gap: 20px;
}

.search {
  position: relative;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.search-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted);
  font-size: 14px;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  pointer-events: none;
}

.search:focus-within .search-icon {
  color: var(--accent-primary);
  transform: translateY(-50%) scale(1.1);
}

.search input {
  width: 260px;
  padding: 10px 14px 10px 40px;
  border-radius: 12px;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  outline: none;
  font: inherit;
  font-size: 14px;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: inset 0 0 0 2px transparent;
}

.search input:hover {
  border-color: rgba(99, 102, 241, 0.3);
  background: var(--bg-surface-secondary);
}

.search input:focus {
  border-color: var(--accent-primary);
  background: var(--bg-surface);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1), inset 0 0 0 1px rgba(99, 102, 241, 0.2);
  transform: translateY(-2px);
}

.search input::placeholder {
  color: var(--text-muted);
  transition: color 0.3s ease;
}

.search input:focus::placeholder {
  color: var(--text-secondary);
}

/* Search Results Styles */
.search-results {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  width: 100%;
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  z-index: 100;
  animation: slideDown 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.search-section {
  padding: 8px 0;
}

.search-section-title {
  font-size: 12px;
  text-transform: uppercase;
  color: var(--text-muted);
  padding: 8px 16px;
  margin: 0;
  letter-spacing: 0.5px;
  font-weight: 600;
}

.search-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  cursor: pointer;
  color: var(--text-primary);
  font-size: 14px;
}

.search-item:hover {
  background: var(--bg-primary);
  color: var(--accent-primary);
}

.search-item-icon {
  color: var(--text-secondary);
  font-size: 16px;
}

.search-item:hover .search-item-icon {
  color: var(--accent-primary);
}

.no-results {
  padding: 24px;
  text-align: center;
  color: var(--text-muted);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.no-results i {
  font-size: 24px;
  color: var(--text-secondary);
}

.no-results p {
  margin: 0;
  font-size: 14px;
}

.avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: linear-gradient(135deg, #2dd4bf, #14b8a6);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 16px;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(45, 212, 191, 0.3);
  position: relative;
  overflow: hidden;
}

.avatar.loading {
  background: var(--bg-surface-secondary);
  color: var(--text-muted);
  box-shadow: none;
  animation: avatarPulse 1.5s ease-in-out infinite;
}

@keyframes avatarPulse {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}

.avatar::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(255,255,255,0.2), transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.avatar:hover {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 8px 20px rgba(45, 212, 191, 0.4);
}

.avatar:hover::before {
  opacity: 1;
}

@media (max-width: 768px) {
  .search input {
    width: 200px;
  }
}
</style>