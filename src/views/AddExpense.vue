<template>
  <div class="pt-4">
    <h2>이번 달 달력</h2>

    <!-- 로딩 & 에러 -->
    <div v-if="expenseStore.loading">로딩 중...</div>
    <div v-else-if="expenseStore.error" class="text-red-500">{{ expenseStore.error }}</div>

    <!-- 달력 -->
    <div v-else class="calendar-container">
      <v-calendar
          is-expanded
          :attributes="calendarAttributes"
          :min-date="startOfMonth"
          :max-date="endOfMonth"
          @dayclick="selectDate"
      />
    </div>

    <!-- 선택 날짜 상세 -->
    <div v-if="selectedDateExpenses.length > 0" class="mt-4">
      <h3>{{ selectedDate }} 상세 지출</h3>
      <div v-for="exp in selectedDateExpenses" :key="exp.id" class="card mb-2">
        <p>{{ categoriesMap[exp.category_id] || 'Unknown' }} - {{ exp.amount }}원</p>
        <p class="text-gray-500">{{ exp.memo || '-' }}</p>
      </div>
    </div>

    <div v-else-if="selectedDate" class="text-gray-500 mt-2">
      선택한 날짜에 지출이 없습니다.
    </div>

    <!-- 이번 달 총합 -->
    <div class="mt-4 p-4 bg-gray-100 rounded">
      <p>이번 달 총 수입: {{ totalIncome }}원</p>
      <p>이번 달 총 지출: {{ totalExpense }}원</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import dayjs from 'dayjs'
import { useExpenseStore } from '@/stores/expenseStore'
import { useCategories } from '@/composables/useCategories'

const expenseStore = useExpenseStore()
const { categories, fetchCategories } = useCategories()

const selectedDate = ref<string | null>(null)
const startOfMonth = dayjs().startOf('month').toDate()
const endOfMonth = dayjs().endOf('month').toDate()

// category_id → name 매핑
const categoriesMap = computed(() => {
  const map: Record<number, string> = {}
  categories.value.forEach(c => { map[c.id] = c.name })
  return map
})

// 선택 날짜의 지출
const selectedDateExpenses = computed(() => {
  if (!selectedDate.value) return []
  return expenseStore.expenses.filter(e => e.date === selectedDate.value)
})

// 달력 dot 표시 (총 지출)
const calendarAttributes = computed(() => {
  const attr: any[] = []

  // 날짜별 지출 합계 계산
  const dailyExpenseMap: Record<string, number> = {}
  expenseStore.expenses.forEach(e => {
    if (!dailyExpenseMap[e.date]) dailyExpenseMap[e.date] = 0
    dailyExpenseMap[e.date] += e.amount || 0
  })

  Object.entries(dailyExpenseMap).forEach(([date, total]) => {
    attr.push({
      key: date,
      dates: new Date(date),
      dot: {
        color: '#b19fff',
        tooltip: `총 지출: ${total}원`
      }
    })
  })

  return attr
})

// 날짜 선택
const selectDate = (day: Date) => {
  selectedDate.value = dayjs(day).format('YYYY-MM-DD')
}

// 이번 달 총합
const totalExpense = computed(() =>
    expenseStore.expenses.reduce((sum, e) => sum + (e.amount || 0), 0)
)
const totalIncome = 0 // 수입 데이터가 있다면 계산

onMounted(async () => {
  await fetchCategories()
  await expenseStore.fetchExpenses()
})
</script>

<style scoped>
.calendar-container {
  max-width: 100%;
  margin: 0 auto;
}

.vc-pane {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 10px;
}

.vc-day-content {
  position: relative;
  min-height: 60px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  font-size: 12px;
}

.expense-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: #b19fff;
  margin-top: 2px;
}

.card {
  padding: 10px;
  border-radius: 12px;
  background-color: #fff;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}

.text-gray-500 {
  color: #6b7280;
  font-size: 0.875rem;
}
</style>
