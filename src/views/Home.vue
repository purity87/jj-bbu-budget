<template>
  <div class="pt-4">
    <!-- 상단: 지출 추가 버튼 -->
    <div class="shortcut-btns mb-4">
      <button @click="goAddExpense" class="btn btn-primary w-full">
        지출 추가
      </button>
    </div>

    <h2>지출 목록</h2>

    <!-- 로딩 상태 -->
    <div v-if="expenseStore.loading">로딩 중...</div>

    <!-- 데이터 없음 메시지 -->
    <div v-else-if="expenseStore.expenses.length === 0" class="text-center text-gray-500 mt-4">
      지출 데이터가 없습니다.
    </div>

    <!-- 지출 리스트 -->
    <div v-else>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>
