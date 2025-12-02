<template>
  <div class="p-4 bg-white rounded shadow">
    <p>차트 영역 (추후 구현 가능)</p>
    <ul>
<!--      <li v-for="e in expenses" :key="e.id">{{ e.category }}: {{ e.amount }}</li>-->
    </ul>
  </div>
</template>

<script setup lang="ts">
import type { Expense } from '@/types'
defineProps<{ expenses: Expense[] }>()
</script>
