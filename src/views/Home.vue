<template>
  <div class="pt-4">
    <!-- 상단 바로가기 버튼 -->
    <div class="shortcut-btns mb-4">
      <button @click="goAddExpense" class="btn btn-primary w-full">
        지출 추가
      </button>
    </div>

    <!-- 달력 컴포넌트 -->
    <MonthlyCalendar />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import MonthlyCalendar from '@/components/MonthlyCalendar.vue'

const router = useRouter()

// 지출 추가 화면 이동
const goAddExpense = () => {
  router.push('/add-expense')
}
</script>

<style scoped>
/* 필요한 경우 추가 스타일 */
</style>
