<template>
  <li class="border-b py-2">
    {{ expense.date }} - {{ categoryName }} - {{ expense.amount }}원
  </li>f
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { supabase } from '@/composables/useSupabase'
import type { Expense } from '@/types'

defineProps<{ expense: Expense }>()

const props = defineProps<{ expense: Expense }>()

const categoryName = ref('')

// 카테고리 이름 로드
onMounted(async () => {
  if (props.expense.category_id) {
    const { data, error } = await supabase
        .from('categories')
        .select('name')
        .eq('id', props.expense.category_id)
        .single()

    if (!error && data) {
      categoryName.value = data.name
    } else {
      categoryName.value = '알 수 없음'
    }
  }
})
</script>
