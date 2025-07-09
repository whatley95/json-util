import { createApp } from 'vue'
// @ts-ignore
import { createPinia } from 'pinia'
import App from './App.vue'
// @ts-ignore
import router from './router/index'
import './style.css'

const app = createApp(App)

// Create and use Pinia (Store)
const pinia = createPinia()
// @ts-ignore
app.use(pinia)

// Use router
// Use router
// @ts-ignore
app.use(router)

// Ensure we navigate to the home page on initial load
// @ts-ignore
router.isReady().then(() => {
    // Check if we're at the base URL without the trailing path
    if (window.location.pathname === '/json-util' || window.location.pathname === '/json-util/') {
        // @ts-ignore
        router.push('/')
    }
})

// Mount app
app.mount('#app')
