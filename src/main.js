import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
// import router from './router'


// PrimeVue
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'


// Components
import FileUpload from 'primevue/fileupload'
import Button from 'primevue/button'

// Services
import ToastService from 'primevue/toastservice'

// Icons
import 'primeicons/primeicons.css'

const app = createApp(App)


app.use(createPinia())
// app.use(router)

// PrimeVue with theme
app.use(PrimeVue, {
  theme: {
    preset: Aura
  }
})

app.use(ToastService)

// Global components
app.component('FileUpload', FileUpload)
app.component('PrimeButton', Button)

app.mount('#app')