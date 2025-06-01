import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/UserDashboard.vue'
import PatientsView from '../views/ManagerDashboard.vue'
import Login from '../components/Login.vue'
import EvaluateView from '../views/AdminDashboard.vue'
import SettingsView from '../views/SettingsView.vue'


const routes = [
    { path: '/dashboard', name: 'home', component: HomeView },
    { path: '/', name: 'login', component: Login },
    { path: '/manage', name: 'manage', component: PatientsView },
    { path: '/admin', name: 'admin', component: EvaluateView },
    { path: '/settings', name: 'Settings', component: SettingsView },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
