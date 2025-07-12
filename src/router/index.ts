// @ts-ignore
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import JsonDiffView from '../views/JsonDiffView.vue'
import JsonEscapeView from '../views/JsonEscapeView.vue'
import JsonBeautifyView from '../views/JsonBeautifyView.vue'
import JsonConverterView from '../views/JsonConverterView.vue'
import JsonValidateView from '../views/JsonValidateView.vue'
import JsonPathView from '../views/JsonPathView.vue'

// Determine base URL based on environment
const base = import.meta.env.BASE_URL || '/'

const router = createRouter({
  // Use the correct base URL matching Vite's configuration
  history: createWebHistory(base),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/diff',
      name: 'diff',
      component: JsonDiffView
    },
    {
      path: '/escape',
      name: 'escape',
      component: JsonEscapeView
    },
    {
      path: '/beautify',
      name: 'beautify',
      component: JsonBeautifyView
    },
    {
      path: '/converter',
      name: 'converter',
      component: JsonConverterView
    },
    {
      path: '/validate',
      name: 'validate',
      component: JsonValidateView
    },
    {
      path: '/path',
      name: 'path',
      component: JsonPathView
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ]
})

export default router
