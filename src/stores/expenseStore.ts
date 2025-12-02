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

            if (!userStore.currentBudget?.budget_id) {
                this.error = '선택된 가계부가 없습니다.'
                return
            }

            this.loading = true
            this.error = null

            const { data, error } = await supabase
                .from('expenses')
                .select('*')
                .eq('budget_id', userStore.currentBudget.budget_id)
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
            console.log('>>>currentBudget >> ', userStore);


            if (!userStore.currentBudget?.budget_id || !userStore.user?.id) {
                this.error = '가계부 또는 사용자 정보가 없습니다.'
                return
            }

            this.loading = true
            this.error = null

            // Supabase insert
            const { error } = await supabase
                .from('expenses')
                .insert({
                    ...expense,
                    budget_id: userStore.currentBudget.budget_id,
                    created_by: userStore.user.id,
                })

            if (error) {
                this.error = error.message
                this.loading = false
                return
            }

            // 추가 성공하면 상태 갱신
            await this.fetchExpenses()
            this.loading = false
        }
    }
})
