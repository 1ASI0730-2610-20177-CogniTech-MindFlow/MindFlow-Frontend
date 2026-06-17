import { createRouter, createWebHistory } from 'vue-router'
import i18n from './i18n'
import { SessionManager } from '@/iam/infrastructure/session-manager.js'

import Home from './shared/presentation/views/home.vue'
import PageNotFound from './shared/presentation/views/page-not-found.vue'

const routes = [
  {
    path: '/',
    component: Home,
    meta: { titleKey: 'routes.home' }
  },

  {
    path: '/login',
    component: () => import('@/iam/presentation/views/login.vue'),
    meta: { titleKey: 'routes.login', requiresAuth: false }
  },
  {
    path: '/register',
    component: () => import('@/iam/presentation/views/register.vue'),
    meta: { titleKey: 'routes.register', requiresAuth: false }
  },
  {
    path: '/forgot-password',
    component: () => import('@/iam/presentation/views/forgot-password.vue'),
    meta: { titleKey: 'routes.forgotPassword', requiresAuth: false }
  },

  {
    path: '/dashboard',
    component: () => import('./dashboard/presentation/views/dashboard.vue'),
    meta: { titleKey: 'routes.dashboard', requiresAuth: true }
  },
  {
    path: '/analytics',
    component: () => import('./analytics/presentation/views/analytics-view.vue'),
    meta: { titleKey: 'routes.analytics', requiresAuth: true }
  },
  {
    path: '/habits',
    component: () => import('@/habits/presentation/views/habits.vue'),
    meta: { titleKey: 'routes.habits', requiresAuth: true }
  },
  {
    path: '/journal',
    component: () => import('@/journal/presentation/views/journal.vue'),
    meta: { titleKey: 'routes.journal', requiresAuth: true }
  },
  {
    path: '/subscription',
    component: () => import('@/subscription/presentation/views/subscription.vue'),
    meta: { titleKey: 'routes.subscription', requiresAuth: true }
  },
  {
    path: '/settings',
    component: () => import('@/settings/presentation/views/settings.vue'),
    meta: { titleKey: 'routes.settings', requiresAuth: true }
  },

  {
    path: '/:pathMatch(.*)*',
    component: PageNotFound,
    meta: { titleKey: 'routes.notFound' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

const publicPaths = ['/', '/login', '/register', '/forgot-password', '/forgot-password/']

router.beforeEach((to, from) => {
  const isAuthenticated = SessionManager.isAuthenticated()
  const requiresAuth = to.meta?.requiresAuth === true

  if (requiresAuth && !isAuthenticated) {
    return { path: '/login', query: { redirect: to.fullPath } }
  }

  if (isAuthenticated && (to.path === '/login' || to.path === '/register')) {
    return { path: '/dashboard' }
  }

  if (to.meta?.titleKey) {
    document.title = i18n.global.t(to.meta.titleKey)
  } else if (to.meta?.title) {
    document.title = to.meta.title
  }
})

export default router
