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
// @ts-ignore
app.use(router)

// Mount app
app.mount('#app')
