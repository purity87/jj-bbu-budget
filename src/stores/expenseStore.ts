// src/stores/expenseStore.ts
import { defineStore } from 'pinia'
import { supabase } from '@/composables/useSupabase'
import { useUserStore } from '@/stores/userStore'
import type { Expense } from '@/types'

export const useExpenseStore = defineStore('expenses', {
    state: () => ({
        expenses: [] as Expense[],
        loading: false,
        error: null as string | null,
    }),
    actions: {
        async fetchExpenses() {
            const userStore = useUserStore()
            if (!userStore.currentBudget?.id) {
                this.error = '선택된 가계부가 없습니다.'
                return
            }

            this.loading = true
            this.error = null

            const { data, error } = await supabase
                .from('expenses')
                .select('*')
                .eq('budget_id', userStore.currentBudget.id)
                .order('date', { ascending: false })
            if (error) {
                this.error = error.message
                this.loading = false
                return
            }

            this.expenses = data || []
            this.loading = false
        },

        async addExpense(expense: Partial<Expense>) {
            const userStore = useUserStore()


            if (!userStore.currentBudget?.id || !userStore.user?.id) {
                this.error = '가계부 또는 사용자 정보가 없습니다.'
                return
            }

            this.loading = true
            this.error = null
console.log('add expense , ', expense);
            // Supabase insert
            const { data, error, status } = await supabase
                .from('expenses')
                .insert({
                    ...expense,
                    budget_id: userStore.currentBudget.id,
                    created_by: userStore.user.id,
                })
                .select()   // ← insert 후 실제 입력된 데이터 반환

            if (error || !data || !data.length) {
                console.error('Insert failed ->', { error, data, status })
                this.error = error?.message ?? 'DB 저장에 실패했습니다.'
                this.loading = false
                return
            }

            // 추가 성공하면 상태 갱신
            await this.fetchExpenses()
            this.loading = false
        }
    }
})
