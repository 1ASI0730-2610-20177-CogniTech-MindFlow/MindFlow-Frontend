import { createApp } from 'vue'
import './style.css'
import App from './app.vue'
import router from './router'
import pinia from './pinia'
import i18n from './i18n'

const app = createApp(App)

app.use(pinia)

app.use(router)

app.use(i18n)

app.mount('#app')
