import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './style.css'

const app = createApp(App)

const pinia = createPinia()
app.use(pinia)
app.use(router)

router.isReady().then(() => {
    const needsRedirect = window.location.pathname === '/json-util' || window.location.pathname === '/json-util/'
    if (needsRedirect) {
        void router.push('/')
    }
})

app.mount('#app')
