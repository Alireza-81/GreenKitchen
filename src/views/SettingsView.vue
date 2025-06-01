<!-- src/layouts/DashboardLayout.vue -->
<template>
  <div class="dashboard-container">
    <!-- Sidebar -->
    <aside class="sidebar">
      <h2 class="sidebar-title">{{ currentTitle }}</h2>
      <p class="sidebar-user">Dr. {{ doctorName }}</p>
      <nav class="sidebar-menu">
        <router-link to="/dashboard" class="menu-item">Dashboard</router-link>
        <router-link to="/patients" class="menu-item">Patients</router-link>
        <router-link to="/evaluate" class="menu-item">Evaluate</router-link>
        <router-link to="/settings" class="menu-item">Settings</router-link>
      </nav>
    </aside>

    <!-- Main Content -->
    <main class = "settings-main">
      <div class="glass-box settings-box">
        <h3>⚙️ User Settings</h3>
        <div class="form-group">
          <label for="doctorName">Doctor Name:</label>
          <input id="doctorName" v-model="editableName" />
        </div>

        <div class="form-group">
          <label for="password">Change Password:</label>
          <input id="password" type="password" v-model="password" placeholder="New password" />
        </div>

        <button @click="saveSettings">Save Changes</button>
        <button class="logout-btn" @click="logout">Logout</button>
      </div>
    </main>

  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import {useRoute, useRouter} from 'vue-router'

const doctorName = ref(localStorage.getItem('username') || 'Unknown')

const route = useRoute()
const routeTitles = {
  '/dashboard': 'Dashboard',
  '/patients': 'Patients',
  '/evaluate': 'Evaluate',
  '/settings': 'Settings',
}
const currentTitle = computed(() => routeTitles[route.path] || 'Dashboard')

const router = useRouter()

const editableName = ref(localStorage.getItem('username') || '')
const password = ref('')

function saveSettings() {
  localStorage.setItem('username', editableName.value)
  alert('Changes saved!')
}

function logout() {
  localStorage.removeItem('username')
  router.push('/')
}
</script>

<style scoped>
.settings-box {
  width: 50%;
}

.form-group {
  margin-bottom: 16px;
}

label {
  display: block;
  margin-bottom: 6px;
  color: #ccc;
  font-weight: bold;
}

input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 6px;
  font-size: 16px;
  background-color: rgba(255, 255, 255, 0.1);
  color: #fff;
}

input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

button {
  width: 100%;
  padding: 10px 12px;
  border: none;
  background-color: #00BD7E33;
  color: white;
  font-size: 14px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-top: 12px;
}

button:hover {
  background-color: #00bd7e;
}

.logout-btn {
  background-color: #bd3f3f33;
}

.logout-btn:hover {
  background-color: #bd3f3f;
}
</style>
