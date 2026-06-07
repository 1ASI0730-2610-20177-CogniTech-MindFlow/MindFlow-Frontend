import { createRouter, createWebHistory } from 'vue-router'
import i18n from './i18n'

import Home from './shared/presentation/views/home.vue'
import PageNotFound from './shared/presentation/views/page-not-found.vue'

const routes = [
  {
    path: '/',
    component: Home,
    meta: { titleKey: 'routes.home' }
  },
  
 {
    path: '/dashboard',
    component: () => import('./dashboard/presentation/views/dashboard.vue'),
    meta: { titleKey: 'routes.dashboard' }
  },
  {
    path: '/analytics',
    component: () => import('./analytics/presentation/views/analytics-view.vue'),
    meta: { titleKey: 'routes.analytics' }
  },
  {
    path: '/habits',
    component: () => import('@/habits/presentation/views/habits.vue'),
    meta: { titleKey: 'routes.habits' }
  },
  {
    path: '/journal',
    component: () => import('@/journal/presentation/views/journal.vue'),
    meta: { titleKey: 'routes.journal' }
  },
  {
    path: '/subscription',
    component: () => import('@/subscription/presentation/views/subscription.vue'),
    meta: { titleKey: 'routes.subscription' }
  },
  {
    path: '/settings',
    component: () => import('@/settings/presentation/views/settings.vue'),
    meta: { titleKey: 'routes.settings' }
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

router.beforeEach((to, from) => {
  if (to.meta?.titleKey) {
    document.title = i18n.global.t(to.meta.titleKey)
  } else if (to.meta?.title) {
    document.title = to.meta.title
  }
})

export default router
