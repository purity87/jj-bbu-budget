<template>
  <div class="pt-4" v-if="userStore.currentBudget">
    <h2>지출 추가</h2>
    <div class="card">
      <select v-model="categoryId" class="input mb-2">
        <option value="" disabled>카테고리 선택</option>
        <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</option>
      </select>

      <input v-model="amount" type="number" placeholder="금액" class="input mb-2" />
      <input v-model="memo" placeholder="메모" class="input mb-2" />
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
const memo = ref('')
const date = ref('')
const error = ref('')

// 카테고리 로드
onMounted(async () => {
  const { data, error: catError } = await supabase.from('categories').select('*').eq('type', '지출')
  if (!catError && data) categories.value = data
  else console.error('카테고리 로드 실패', catError)
})

// 지출 추가
const addExpense = async () => {
  if (!userStore.currentBudget) {
    error.value = '선택된 가계부가 없습니다.'
    return
  }

  if (!categoryId.value || !amount.value || !date.value) {
    error.value = '필수 값을 입력해주세요.'
    return
  }

  try {
    const expenseData = {
      budget_id: userStore.currentBudget.budget_id,
      category_id: Number(categoryId.value),
      amount: amount.value,
      memo: memo.value,
      date: date.value,
      created_by: userStore.user?.id
    }
    await expenseStore.addExpense(expenseData)
    console.log('지출 추가 성공')

    // 추가 후 리스트 화면으로 이동
    router.push('/home')
  } catch (err) {
    console.error('지출 추가 실패', err)
    error.value = '지출 추가에 실패했습니다.'
  }

  // 입력 초기화
  categoryId.value = ''
  amount.value = null
  memo.value = ''
  date.value = ''
}
</script>
