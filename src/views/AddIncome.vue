<template>
  <div class="pt-4" v-if="userStore.currentBudget">
    <h2>수입 추가</h2>
    <h2>수입 추가</h2>
    <div class="card">

      <!-- 카테고리 -->
      <select v-model="categoryId" class="input mb-2">
        <option value="" disabled>카테고리 선택</option>
        <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</option>
      </select>

      <!-- 금액 -->
      <input v-model="amount" type="number" placeholder="금액" class="input mb-2" />

      <!-- 결제수단 -->
      <select v-model="paymentMethod" class="input mb-2">
        <option value="" disabled>결제 수단 선택</option>
        <option value="카드">카드</option>
        <option value="현금">현금</option>
      </select>

      <!-- 메모 -->
      <input v-model="memo" placeholder="메모" class="input mb-2" />

      <!-- 날짜 -->
      <input v-model="date" type="date" class="input mb-4" />

      <button @click="addExpense" class="btn btn-primary w-full">추가</button>
      <p class="text-sm text-red-500 mt-2" v-if="error">{{ error }}</p>
    </div>
  </div>

  <div v-else>
    현재 가계부를 로딩 중입니다...
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useExpenseStore } from '@/stores/expenseStore'
import { useUserStore } from '@/stores/userStore'
import { supabase } from '@/composables/useSupabase'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const expenseStore = useExpenseStore()
const router = useRouter()

const categories = ref<{id: string, name: string}[]>([])
const categoryId = ref<string>('')
const amount = ref<number | null>(null)
const paymentMethod = ref<string>('')     // ✅ 결제수단 추가
const memo = ref('')
const date = ref('')
const error = ref('')

// 오늘 날짜 yyyy-mm-dd
function todayString() {
  const t = new Date()
  return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`
}

// onMounted
onMounted(async () => {
  date.value = todayString()   // ✅ 기본 날짜 자동 설정

  const { data, error: catError } = await supabase
      .from('categories')
      .select('*')
      .eq('type', '수입')

  if (!catError && data) categories.value = data
  else console.error('카테고리 로드 실패', catError)
})

// 수입 추가
const addExpense = async () => {
  if (!userStore.currentBudget) {
    error.value = '선택된 가계부가 없습니다.'
    return
  }

  if (!categoryId.value || !amount.value || !date.value || !paymentMethod.value) {
    error.value = '필수 값을 모두 입력해주세요.'
    return
  }

  try {
    const expenseData = {
      budget_id: userStore.currentBudget.id,
      category_id: Number(categoryId.value),
      amount: amount.value,
      memo: memo.value,
      date: date.value,
      method: paymentMethod.value,
      created_by: userStore.user?.id
    }

    await expenseStore.addExpense(expenseData)
    console.log('수입 추가 성공')

    await router.push('/home')
  } catch (err) {
    console.error('수입 추가 실패', err)
    error.value = '수입 추가에 실패했습니다.'
  }

  categoryId.value = ''
  amount.value = null
  paymentMethod.value = ''
  memo.value = ''
  date.value = todayString()   // 다음 추가 때도 오늘 날짜 유지
}
</script>

<style scoped></style>
