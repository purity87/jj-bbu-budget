<template>
  <div class="p-4">
    <HeaderBar title="통계" />
    <ChartSection :expenses="expenses" />
  </div>
</template>

<script setup lang="ts">
import HeaderBar from '@/components/HeaderBar.vue'
import ChartSection from '@/components/ChartSection.vue'
import { useExpenseStore } from '@/stores/expenseStore'

const expenseStore = useExpenseStore()
const expenses = expenseStore.expenses
</script>
