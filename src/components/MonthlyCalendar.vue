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

      <!-- 날짜 -->
      <div
          v-for="day in daysInMonth"
          :key="day"
          @click="selectDay(day)"
          class="relative h-12 flex flex-col items-center justify-center cursor-pointer"
      >
        <!-- 날짜 박스 -->
        <div
            class="w-9 h-9 flex items-center justify-center rounded-full"
            :class="{
            'bg-purple-300 text-white font-bold': selectedDate === day,
            'text-red-500': isSunday(day) && selectedDate !== day,
            'text-gray-500': isSaturday(day) && selectedDate !== day
          }"
        >
          {{ day }}
        </div>

        <!-- dot 표시 -->
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
    <!-- 하단 상세 -->
    <div v-if="selectedExpenses.length > 0" class="mt-4 border-t pt-4">
      <h3 class="font-bold mb-2">
        {{ year }}.{{ month }}.{{ selectedDate }} 상세
      </h3>

      <div
          v-for="item in selectedExpenses"
          :key="item.id"
          class="flex justify-between py-2 border-b"
      >
        <div class="flex items-center gap-2">

          <!-- 사람 아이콘 -->
          <div
              class="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs"
              :class="getUserColor(item?.created_by)"
          >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
            >
              <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 14c-4.418 0-8 2.015-8 4.5V21h16v-2.5c0-2.485-3.582-4.5-8-4.5Z"
              />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>

          <!-- 카테고리 / 메모 -->
          <div class="flex items-center gap-1">
            <span class="font-medium">{{ item.category_name }}</span>
            <span class="text-gray-500 text-sm" v-if="item.memo">({{ item.memo }})</span>
          </div>
        </div>

        <div class="font-bold">{{ item.amount.toLocaleString() }}원</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, onMounted, computed} from 'vue'
import { useExpenseStore } from '@/stores/expenseStore'
import { useCategories } from '@/composables/useCategories'
import { useUserStore } from '@/stores/userStore.ts'
import {getTodayDay, buildDate} from "@/utils/date.ts";

/* -----------------------------
   사용자 역할 기반 색상 계산
----------------------------- */
const userStore = useUserStore()

  // budget_users에서 UID로 역할 찾기 (admin / user)
const getRoleByUserId = (uid?: string) => {
  const users = userStore.currentBudget?.budget_users ?? [];
  const found = users.find(u => u.user_id === uid);
  return found?.role ?? null;
};

// 역할에 따른 색상
const getUserColor = (uid?: string) => {
  const role = getRoleByUserId(uid);
  if (role === 'admin') return 'bg-pink-500';
  if (role === 'user') return 'bg-blue-500';
  return 'bg-gray-400';
};

/* -----------------------------
   날짜 계산
----------------------------- */
const today = new Date()
const year = today.getFullYear()
const month = today.getMonth() + 1

const firstDay = new Date(year, month - 1, 1)
const lastDay = new Date(year, month, 0)

const startBlank = firstDay.getDay()
const daysInMonth = lastDay.getDate()
const weekdays = ['일', '월', '화', '수', '목', '금', '토']

/* -----------------------------
   스토어 데이터
----------------------------- */
const expenseStore = useExpenseStore()
const { categories, fetchCategories } = useCategories()
const selectedDate = ref<number | null>(null)

// 현재 가계부 ID 가져오기
const currentBudgetId = computed(() => userStore.currentBudget?.id)
/* category_id → category_name + 현재 가계부 */
const expensesWithCategory = computed(() => {
  if (!currentBudgetId.value) return []

  return (expenseStore.expenses ?? [])
      .filter(exp => exp.budget_id === currentBudgetId.value)      // 가계부별로 분리
      .map(exp => ({
        ...exp,
        category_name: categories.value.find(c => c.id === exp.category_id)?.name || '기타',
      }))
})


/* 특정 날짜 상세 */
const selectedExpenses = computed(() => {
  if (!selectedDate.value) return []
  const dateString = buildDate(year, month, selectedDate.value)
  return expensesWithCategory.value.filter(e => e.date.startsWith(dateString))
})

/* 날짜 선택 */
function selectDay(day: number) {
  selectedDate.value = day
}

/* 요일 색상 */
function isSunday(day: number) {
  return new Date(year, month - 1, day).getDay() === 0
}

function isSaturday(day: number) {
  return new Date(year, month - 1, day).getDay() === 6
}

/* -----------------------------
   Dot 색상 규칙
   수입/지출 → 카테고리 → 기본
----------------------------- */
function getDots(day: number) {
  const dateString = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`

  const items = expensesWithCategory.value.filter(e =>
      e.date.startsWith(dateString)
  )

  const hasIncome = items.some(e => e.amount > 0)
  const hasExpense = items.some(e => e.amount < 0)

  const dots: string[] = []

  if (hasIncome) dots.push('#4CAF50')   // 수입: 초록 1개
  if (hasExpense) dots.push('#E57373')  // 지출: 빨강 1개

  return dots
}


onMounted(async () => {
  // 오늘이 현재 month 범위 안에 있는 경우에만 선택
  const todayDay = getTodayDay()
  if (today.getMonth() + 1 === month) {
    selectedDate.value = todayDay
  }

  await fetchCategories()
  await expenseStore.fetchExpenses()
})
</script>

<style scoped></style>
