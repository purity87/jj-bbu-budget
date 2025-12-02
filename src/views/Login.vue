<template>
  <div class="login-container">
    <div class="login-box">
      <h2>로그인</h2>
      <input v-model="email" type="email" placeholder="이메일" class="input-field mb-2" />
      <input v-model="password" type="password" placeholder="비밀번호" class="input-field mb-4" />
      <button @click="login" class="btn btn-primary w-full">로그인</button>
      <p v-if="error" class="error-text">{{ error }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const error = ref('')

const userStore = useUserStore()
const router = useRouter()

const login = async () => {
  try {
    await userStore.login(email.value, password.value)
    router.push('/home')
  } catch (err: any) {
    error.value = err.message
  }
}
</script>
