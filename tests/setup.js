import { createApp } from 'vue'
import App from '../src/app.js'
import 'bootstrap';

// Create a mounting point for the app
const appContainer = document.createElement('div')
appContainer.id = 'app'
document.body.appendChild(appContainer)

// Mount the app
const app = createApp(App)
app.mount('#app')

