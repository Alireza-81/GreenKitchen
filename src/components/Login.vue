<template>
  <div class="container">
    <div class="box" >
      <h2>آشپزخانه سبز</h2>
      <input
          v-model="username"
          type="text"
          style="text-align: right"
          placeholder="نام کاربری"
      />
      <input
          v-model="password"
          type="password"
          style="text-align: right"
          placeholder="رمز عبور"
      />
      <!-- چک‌باکس مرا به خاطر بسپار -->
      <label style="text-align: right;">
        مرا به خاطر بسپار
        <input
            type="checkbox"
            style="text-align: right;"
        />

      </label>
      <button @click="login">ورود</button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ref } from 'vue'

const router = useRouter()
const username = ref('')
const password = ref('')

function login() {
  if (username.value === 'user' && password.value === 'user123') {
    localStorage.setItem('username', username.value)  // Save username
    router.push('/dashboard')
  } else {
    if (username.value === 'manager' && password.value === 'manager123') {
      localStorage.setItem('username', username.value)
      router.push('/manage')
    } else {
      if (username.value === 'admin' && password.value === 'admin123') {
        localStorage.setItem('username', username.value)
        router.push('/admin')
      }
      else {
        alert('Wrong login!')
      }
    }

  }
}

</script>