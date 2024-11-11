import { createRouter, createWebHistory } from 'vue-router'
import ListView from './views/ListView.vue'
import AddLink from './views/AddLink.vue'

const routes = [
    {
        path: '/',
        redirect: '/list'
    },
    {
        path: '/list',
        name: 'list',
        component: ListView
    },
    {
        path: '/add',
        name: 'add',
        component: AddLink
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router 