<script setup lang="ts">
import { onMounted } from 'vue'
import { useExpenseStore } from '@/stores/expenseStore'

const expenseStore = useExpenseStore()

onMounted(() => {
  expenseStore.fetchExpenses()
})
</script>

<template>
  <div class="expense-list-wrapper">

    <div v-if="expenseStore.loading" class="loading">불러오는 중...</div>

    <div v-else-if="expenseStore.error" class="error">
      {{ expenseStore.error }}
    </div>

    <div v-else-if="expenseStore.expenses.length === 0" class="empty">
      지출 내역이 없습니다.
    </div>

    <ul v-else class="expense-list">
      <li v-for="e in expenseStore.expenses" :key="e.id" class="expense-item">
        <div class="left">
          <div class="date">{{ e.date }}</div>
          <div class="category">{{ e.category }}</div>
          <div class="memo">{{ e.memo }}</div>
        </div>
        <div class="right">
          <div class="amount">{{ e.amount.toLocaleString() }}원</div>
          <div class="method">{{ e.method }}</div>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.expense-list-wrapper {
  padding: 16px;
}
.expense-list {
  list-style: none;
  margin: 0;
  padding: 0;
}
.expense-item {
  display: flex;
  justify-content: space-between;
  padding: 12px;
  border-bottom: 1px solid #ddd;
}
.left .date {
  font-weight: 600;
}
.amount {
  font-size: 16px;
  font-weight: bold;
  text-align: right;
}
.loading, .error, .empty {
  padding: 10px;
  text-align: center;
  color: #555;
}
</style>
