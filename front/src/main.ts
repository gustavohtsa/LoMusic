import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
// import bootstrap
import 'bootstrap/dist/css/bootstrap.min.css'
import 'font-awesome/css/font-awesome.min.css'
import './main.css'
createApp(App)
    .use(router)
    .use(createPinia())
    .mount('#app')
