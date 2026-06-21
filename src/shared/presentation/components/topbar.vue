<template>
  <header class="topbar" :class="{ scrolled: isScrolled }">
    <div class="topbar-left">
      <button class="hamburger" @click="$emit('toggle-sidebar')" aria-label="Toggle menu">
        <i class="pi pi-bars"></i>
      </button>
      <h2 class="greeting" :key="currentTitle">{{ currentTitle }}</h2>
      <p class="subtitle">{{ formattedDate }} · {{ $t('topbar.subtitle') }}</p>
    </div>

    <div class="topbar-actions">
      <div class="search" ref="searchContainer" :class="{ active: isSearchOpen || searchQuery }">
        <span class="search-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        </span>
        <input
          type="text"
          :placeholder="$t('topbar.search')"
          v-model="searchQuery"
          @focus="isSearchOpen = true"
        />
        <button v-if="searchQuery" class="search-clear" @click="searchQuery = ''; isSearchOpen = false">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>

        <!-- Search Results Dropdown -->
        <div v-if="isSearchOpen && searchQuery.trim()" class="search-results">
          <div v-if="filteredSections.length > 0" class="search-section">
            <h4 class="search-section-title">{{ $t('topbar.sections') }}</h4>
            <div
              v-for="(section, index) in filteredSections"
              :key="section.path"
              class="search-item"
              :style="{ '--stagger': index }"
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

      <div class="avatar-wrapper" ref="avatarWrapper">
        <div class="avatar" :class="{ loading: !store.profile }" @click="toggleAvatarMenu">
          <span class="avatar-ring"></span>
          <span class="avatar-letter">{{ avatarInitial }}</span>
        </div>
        <Transition name="dropdown">
          <div v-if="isAvatarOpen" class="avatar-dropdown">
            <div class="dropdown-user">
              <span class="dropdown-user-name">{{ store.profile?.name || userName || 'User' }}</span>
              <span class="dropdown-user-email">{{ store.profile?.email || '' }}</span>
            </div>
            <div class="dropdown-divider"></div>
            <router-link to="/settings" class="dropdown-item" @click="isAvatarOpen = false">
              <i class="pi pi-cog"></i>
              <span>{{ $t('menu.settings') }}</span>
            </router-link>
            <button class="dropdown-item dropdown-item-danger" @click="handleLogout">
              <i class="pi pi-sign-out"></i>
              <span>{{ $t('auth.logout') }}</span>
            </button>
          </div>
        </Transition>
      </div>
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
import { useAuthStore } from '@/iam/application/auth.store.js'
import { useI18n } from 'vue-i18n'

defineEmits(['toggle-sidebar'])

const route = useRoute()
const router = useRouter()
const store = useSettingsStore()
const authStore = useAuthStore()
const notifStore = useNotificationsStore()
const i18n = useI18n()
const { t } = i18n

const avatarWrapper = ref(null)
const isAvatarOpen = ref(false)

const userName = computed(() => authStore.userName)

const avatarInitial = computed(() => {
  if (store.profile?.initial) return store.profile.initial
  if (authStore.userInitial) return authStore.userInitial
  const name = store.profile?.name || 'U'
  return name.charAt(0).toUpperCase()
})

function toggleAvatarMenu() {
  isAvatarOpen.value = !isAvatarOpen.value
}

async function handleLogout() {
  isAvatarOpen.value = false
  await authStore.logout()
  router.push('/login')
}

const currentTitle = computed(() => {
  if (route.name) {
     return t(`menu.${route.name.toLowerCase()}`)
  }
  if (route.meta?.titleKey) {
    return t(route.meta.titleKey)
  }
  return t('greeting.hello')
})

const formattedDate = computed(() => {
  const options = { weekday: 'long', day: 'numeric', month: 'long' }
  return new Date().toLocaleDateString(i18n.locale.value, options)
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

// Scroll shadow
const isScrolled = ref(false)
const handleScroll = () => {
  isScrolled.value = window.scrollY > 8
}

// Click outside to close search and avatar dropdown
const handleClickOutside = (event) => {
  if (searchContainer.value && !searchContainer.value.contains(event.target)) {
    isSearchOpen.value = false
  }
  if (avatarWrapper.value && !avatarWrapper.value.contains(event.target)) {
    isAvatarOpen.value = false
  }
}

onMounted(() => {
  handleScroll()
  document.addEventListener('scroll', handleScroll, { passive: true })
  document.addEventListener('click', handleClickOutside)
  notifStore.fetchNotifications()
})

onUnmounted(() => {
  document.removeEventListener('scroll', handleScroll)
  document.removeEventListener('click', handleClickOutside)
})

</script>

<style scoped>
.topbar {
  height: 80px;
  padding: 0 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 10;
  transition: box-shadow 0.4s ease, border-color 0.4s ease;
  border-bottom: 1px solid var(--border-color);
  background: var(--bg-surface);
}

.topbar.scrolled {
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06), 0 1px 4px rgba(0, 0, 0, 0.04);
  border-bottom-color: transparent;
}

.topbar-left {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.hamburger {
  display: none;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  border: 1px solid var(--border-color);
  background: var(--bg-surface-secondary);
  color: var(--text-primary);
  cursor: pointer;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  margin-bottom: 4px;
}

.greeting {
  color: var(--text-primary);
  font-size: 20px;
  font-weight: 700;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  animation: titleEnter 0.4s cubic-bezier(0.16, 1, 0.3, 1) both;
}

@keyframes titleEnter {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.subtitle {
  color: var(--text-secondary);
  font-size: 13px;
  margin: 0;
}

.topbar-actions {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-shrink: 0;
}

.search {
  position: relative;
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.search.active {
  transform: scale(1.02);
}

.search-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted);
  display: flex;
  align-items: center;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  pointer-events: none;
}

.search:focus-within .search-icon {
  color: var(--accent-primary);
  transform: translateY(-50%) scale(1.1);
}

.search input {
  width: 220px;
  padding: 10px 36px 10px 40px;
  border-radius: 50px;
  background: var(--bg-surface-secondary);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  outline: none;
  font: inherit;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  caret-color: var(--accent-primary);
}

.search input:hover {
  border-color: rgba(99, 102, 241, 0.2);
  background: var(--bg-surface);
}

.search input:focus {
  width: 300px;
  border-color: var(--accent-primary);
  background: var(--bg-surface);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.08), 0 4px 16px rgba(99, 102, 241, 0.12);
}

.search input::placeholder {
  color: var(--text-muted);
  font-weight: 400;
  transition: color 0.3s ease;
}

.search input:focus::placeholder {
  color: transparent;
}

.search-clear {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%) scale(0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: none;
  background: var(--bg-surface-secondary);
  color: var(--text-muted);
  cursor: pointer;
  opacity: 0;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  pointer-events: none;
}

.search:focus-within .search-clear,
.search input:not(:placeholder-shown) ~ .search-clear {
  opacity: 1;
  pointer-events: all;
  transform: translateY(-50%) scale(1);
}

.search-clear:hover {
  background: var(--border-color);
  color: var(--text-primary);
}

/* Search Results Styles */
.search-results {
  position: absolute;
  top: calc(100% + 12px);
  left: 0;
  width: 100%;
  min-width: 300px;
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  box-shadow: 0 20px 60px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.02);
  overflow: hidden;
  z-index: 100;
  animation: searchDropdown 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes searchDropdown {
  from {
    opacity: 0;
    transform: translateY(-8px) scale(0.97);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.search-section {
  padding: 6px 0;
}

.search-section-title {
  font-size: 11px;
  text-transform: uppercase;
  color: var(--text-muted);
  padding: 8px 16px 6px;
  margin: 0;
  letter-spacing: 0.08em;
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
  margin: 0 6px;
  border-radius: 8px;
}

.search-item:hover {
  background: var(--bg-primary);
}

.search-item-icon {
  color: var(--text-secondary);
  font-size: 14px;
  width: 20px;
  text-align: center;
  transition: color 0.15s;
}

.search-item:hover .search-item-icon {
  color: var(--accent-primary);
}

.no-results {
  padding: 32px 24px;
  text-align: center;
  color: var(--text-muted);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.no-results i {
  font-size: 28px;
  color: var(--text-secondary);
  opacity: 0.5;
}

.no-results p {
  margin: 0;
  font-size: 14px;
}

.avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--accent-primary), var(--accent-hover));
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 16px;
  cursor: pointer;
  position: relative;
  transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.35s ease;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
  flex-shrink: 0;
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

.avatar-letter {
  position: relative;
  z-index: 1;
}

.avatar-ring {
  position: absolute;
  inset: -2px;
  border-radius: 50%;
  border: 2px solid transparent;
  background: conic-gradient(var(--accent-primary), var(--accent-hover), var(--accent-primary)) border-box;
  -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0;
  transition: opacity 0.35s ease;
  pointer-events: none;
}

.avatar:hover {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 8px 24px rgba(99, 102, 241, 0.35);
}

.avatar:hover .avatar-ring {
  opacity: 1;
}

.avatar:active {
  transform: translateY(-1px) scale(1);
}

.avatar-wrapper {
  position: relative;
}

.avatar-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 200px;
  max-width: calc(100vw - 24px);
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  box-shadow: 0 12px 40px -8px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.02);
  z-index: 100;
  overflow: hidden;
}

.dropdown-user {
  padding: 14px 16px 12px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.dropdown-user-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

.dropdown-user-email {
  font-size: 12px;
  color: var(--text-muted);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dropdown-divider {
  height: 1px;
  background: var(--border-color);
  margin: 0;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 10px 16px;
  border: none;
  background: none;
  color: var(--text-primary);
  font: inherit;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  text-decoration: none;
  text-align: left;
  transition: background 0.15s;
}

.dropdown-item:hover {
  background: var(--bg-primary);
}

.dropdown-item i {
  font-size: 14px;
  color: var(--text-secondary);
  width: 16px;
  text-align: center;
}

.dropdown-item-danger {
  color: var(--accent-danger, #ef4444);
}

.dropdown-item-danger i {
  color: var(--accent-danger, #ef4444);
}

.dropdown-item-danger:hover {
  background: rgba(239, 68, 68, 0.06);
}

.dropdown-enter-active {
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.dropdown-leave-active {
  transition: all 0.15s ease;
}

.dropdown-enter-from {
  opacity: 0;
  transform: translateY(-6px) scale(0.96);
}

.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-4px) scale(0.97);
}

@media (max-width: 768px) {
  .topbar {
    padding: 0 16px;
  }

  .hamburger {
    display: flex;
  }

  .search {
    display: none;
  }

  .subtitle {
    display: none;
  }

  .topbar-actions {
    gap: 10px;
  }

  .greeting {
    font-size: 16px;
  }

  .topbar-left {
    overflow: hidden;
  }
}
</style>