// Main entry point for the Vue application
import { createApp } from 'vue'
import './style.css' // Import Tailwind CSS
import App from './App.vue'
import router from './router'

// Create the Vue app
const app = createApp(App)

// Register plugins 
app.use(router)

// Mount 
app.mount('#app')