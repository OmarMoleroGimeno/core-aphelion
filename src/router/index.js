import { createRouter, createWebHistory } from 'vue-router'
import ChatView from '../views/ChatView.vue'
import LoginView from '../views/LoginView.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            redirect: '/chats'
        },
        {
            path: '/login',
            name: 'login',
            component: LoginView
        },
        {
            path: '/users',
            name: 'users',
            component: () => import('../views/AdminView.vue'),
            meta: { requiresAuth: true, layout: 'MainLayout' }
        },
        {
            path: '/knowledge',
            name: 'knowledge',
            component: () => import('../views/KnowledgeBaseView.vue'),
            meta: { requiresAuth: true, layout: 'MainLayout', requiresAdmin: true }
        },
        {
            path: '/chats',
            name: 'chats',
            component: () => import('../views/ChatListView.vue'),
            meta: { requiresAuth: true, layout: 'MainLayout' }
        },
        {
            path: '/tool-advisor',
            name: 'tool-advisor',
            component: () => import('../views/ToolAdvisorView.vue'),
            meta: { requiresAuth: true, layout: 'MainLayout' }
        },
        {
            path: '/chats/new',
            name: 'new-chat',
            component: ChatView,
            meta: { requiresAuth: true, layout: 'MainLayout' }
        },
        {
            path: '/chats/:id',
            name: 'chat-detail',
            component: ChatView,
            meta: { requiresAuth: true, layout: 'MainLayout' }
        }
    ]
})

router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token')
    const userRole = localStorage.getItem('role') // Corrected key

    if (to.meta.requiresAuth && !token) {
        next({ name: 'login' })
    } else if (to.meta.requiresAdmin && userRole !== 'admin') {
        next({ name: 'chats' })
    } else {
        next()
    }
})

export default router
