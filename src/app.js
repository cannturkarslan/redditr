import { createApp } from 'vue'
import router from './router'
import Toast from './components/Toast.vue'
import { toastStore } from './toastStore'

const App = {
    components: {
        Toast
    },
    data() {
        return {
            toastStore
        }
    },
    template: `
        <div>
            <nav class="navbar navbar-expand-lg navbar-light bg-light">
                <div class="container">
                    <router-link class="navbar-brand" to="/list">Link Voting App</router-link>
                    <div class="navbar-nav">
                        <router-link class="nav-link" to="/list">List</router-link>
                        <router-link class="nav-link" to="/add">Add Link</router-link>
                    </div>
                </div>
            </nav>

            <div class="container mt-4">
                <router-view></router-view>
            </div>
            
            <Toast 
                :show="toastStore.show"
                :message="toastStore.message"
            />
        </div>
    `
}

const app = createApp(App)
app.use(router)
app.mount('#app')

export default App