<template>
  <header class="app-header">
    <div class="header-container">
      <!-- 좌측: 로고 -->
      <div class="header-left">
        <img src="/logo.png" alt="logo" class="logo" />
      </div>

      <!-- 가운데: 타이틀 -->
      <h1 class="header-title">쭝화쀼 가계부</h1>

      <!-- 우측: 아이디, 로그아웃 -->
      <div class="header-right" v-if="user">
        <span class="user-email">{{ user.email }}</span>
        <button class="btn btn-primary btn-logout" @click="logout">로그아웃</button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()

const user = computed(() => userStore.user)

const logout = async () => {
  await userStore.logout()
  router.push('/login')
}
</script>
