import { createRouter, createWebHistory } from 'vue-router'

import Home from './shared/presentation/views/home.vue'
import PageNotFound from './shared/presentation/views/page-not-found.vue'

const routes = [
  {
    path: '/',
    component: Home,
    meta: { title: 'Inicio - MindFlow' }
  },
  // Comentamos el dashboard temporalmente hasta que crees el archivo
  /*
  {
    path: '/dashboard',
    component: () => import('./dashboard/presentation/views/dashboard.vue'),
    meta: { title: 'Dashboard' }
  },
  */
  {
    path: '/:pathMatch(.*)*',
    component: PageNotFound,
    meta: { title: '404 - No Encontrado' }
  },
  {
    path: '/settings',
    component: () => import('@/settings/presentation/views/settings.vue'),
    meta: { title: 'Configuración' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router