<template>
  <div class="w-full px-4 pt-2">
    <!-- 상단 연도/월 -->
    <div class="text-center text-lg font-bold mb-2">
      {{ year }}년 {{ month }}월
    </div>

    <!-- 요일 헤더 -->
    <div class="grid grid-cols-7 text-center text-sm text-gray-600 mb-2">
      <div v-for="(d, i) in weekdays" :key="i">{{ d }}</div>
    </div>

    <!-- 달력 본문 -->
    <div class="grid grid-cols-7 gap-y-3">
      <!-- 앞쪽 공백 -->
      <div
          v-for="n in startBlank"
          :key="'b' + n"
          class="h-12"
      ></div>

      <!-- 날짜 렌더링 -->
      <div
          v-for="day in daysInMonth"
          :key="day"
          @click="selectDay(day)"
          class="relative h-12 flex flex-col items-center justify-center cursor-pointer"
      >
        <!-- 선택된 날짜 스타일 -->
        <div
            class="w-9 h-9 flex items-center justify-center rounded-full"
            :class="{
            'bg-purple-300 text-white font-bold': selectedDate === day,
            'text-red-500': isSunday(day),
            'text-gray-500': isSaturday(day)
          }"
        >
          {{ day }}
        </div>

        <!-- 해당 날짜의 지출 카테고리 점 표시 -->
        <div class="flex gap-[2px] mt-1">
          <div
              v-for="(dot, idx) in getDots(day)"
              :key="idx"
              class="w-2 h-2 rounded-full"
              :style="{ backgroundColor: dot }"
          ></div>
        </div>
      </div>
    </div>

    <!-- 하단 선택된 날짜 상세 -->
    <div v-if="selectedExpenses.length > 0" class="mt-4 border-t pt-4">
      <h3 class="font-bold mb-2">
        {{ year }}.{{ month }}.{{ selectedDate }} 상세
      </h3>

      <div
          v-for="item in selectedExpenses"
          :key="item.id"
          class="flex justify-between py-2 border-b"
      >
        <div class="flex items-center gap-1">
          <span class="font-medium">{{ item.category_name }}</span>
          <span class="text-gray-500 text-sm">({{ item.memo }})</span>
        </div>
        <div class="font-bold">{{ item.amount.toLocaleString() }}원</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useExpenseStore } from '@/stores/expenseStore'
import { useCategories } from '@/composables/useCategories'

/* ----------------------------------------------------------
   캘린더 날짜 계산 로직
---------------------------------------------------------- */
const today = new Date()
const year = today.getFullYear()
const month = today.getMonth() + 1

const firstDay = new Date(year, month - 1, 1)
const lastDay = new Date(year, month, 0)

const startBlank = firstDay.getDay() // 앞 공백 수 (일:0)
const daysInMonth = lastDay.getDate()

const weekdays = ['일', '월', '화', '수', '목', '금', '토']

/* ----------------------------------------------------------
   스토어 데이터
---------------------------------------------------------- */
const expenseStore = useExpenseStore()
const { categories, fetchCategories } = useCategories()

// 날짜 선택
const selectedDate = ref<number | null>(null)

/* category_id → category_name 매핑 */
const expensesWithCategory = computed(() => {
  return expenseStore.expenses.map(exp => ({
    ...exp,
    category_name: categories.value.find(c => c.id === exp.category_id)?.name || '기타',
  }))
})

/* 선택한 날짜의 지출 */
const selectedExpenses = computed(() => {
  if (!selectedDate.value) return []
  const dateString = `${year}-${String(month).padStart(2, '0')}-${String(selectedDate.value).padStart(2, '0')}`
  return expensesWithCategory.value.filter(e => e.date.startsWith(dateString))
})

/* 날짜 클릭 */
function selectDay(day: number) {
  selectedDate.value = day
}

/* 요일 체크 */
function isSunday(day: number) {
  const d = new Date(year, month - 1, day)
  return d.getDay() === 0
}
function isSaturday(day: number) {
  const d = new Date(year, month - 1, day)
  return d.getDay() === 6
}

/* ----------------------------------------------------------
   날짜의 dot 표시용 카테고리 색상
---------------------------------------------------------- */
const categoryColors: Record<string, string> = {
  '식비': '#E57373',
  '월급': '#4CAF50',
  '쇼핑': '#9575CD',
  '여행': '#64B5F6',
  '기타': '#9E9E9E'
}

// 특정 날짜의 dot 색상 목록 반환
function getDots(day: number) {
  const dateString = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  const items = expensesWithCategory.value.filter(e => e.date.startsWith(dateString))

  return items.map(e => categoryColors[e.category_name] || '#ccc')
}

onMounted(async () => {
  await fetchCategories()
  await expenseStore.fetchExpenses()
})
</script>

<style scoped>
</style>
