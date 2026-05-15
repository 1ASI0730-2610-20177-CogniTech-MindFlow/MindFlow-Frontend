import { createRouter, createWebHistory } from 'vue-router'

import Home from './shared/presentation/views/home.vue'
import PageNotFound from './shared/presentation/views/page-not-found.vue'
import AnalyticsView from './analytics/presentation/views/analytics-view.vue'

const routes = [
  {
    path: '/',
    component: Home,
    meta: { title: 'Inicio - MindFlow' }
  },
  {
    path: '/analytics',
    component: AnalyticsView,
    meta: { title: 'Estadísticas - MindFlow' }
  },
  {
    path: '/habits',
    component: () => import('@/habits/presentation/views/habits.vue'),
    meta: { title: 'Hábitos - MindFlow' }
  },
  {
    path: '/journal',
    component: () => import('@/journal/presentation/views/journal.vue'),
    meta: { title: 'Diario - MindFlow' }
  },
  {
    path: '/subscription',
    component: () => import('@/subscription/presentation/views/subscription.vue'),
    meta: { title: 'Suscripción - MindFlow' }
  },
  {
    path: '/settings',
    component: () => import('@/settings/presentation/views/settings.vue'),
    meta: { title: 'Configuración - MindFlow' }
  },
  {
    path: '/:pathMatch(.*)*',
    component: PageNotFound,
    meta: { title: '404 - No Encontrado' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
})

export default router
