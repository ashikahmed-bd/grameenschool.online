import './assets/main.css'

import { Vueginate } from 'vueginate'
import 'vueginate/css/vueginate.css'

// toast notification
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import App from './App.vue'
import router from './router'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(Toast)
app.component('Pagination', Vueginate)
app.mount('#app')
