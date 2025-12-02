<template>
  <div class="app-container pt-16">
    <HeaderBar />
    <main class="px-4">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import HeaderBar from '@/components/HeaderBar.vue'
</script>

<style>
.app-container {
  min-height: 100vh;
  background-color: #f5f3ff;
}
</style>
