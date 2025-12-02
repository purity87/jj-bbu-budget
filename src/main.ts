import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './router'
import './styles/index.css'
import VCalendar from 'v-calendar'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(VCalendar, {})
app.mount('#app')
