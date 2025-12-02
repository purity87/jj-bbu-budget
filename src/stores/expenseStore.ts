import { defineStore } from 'pinia'
import { supabase } from '@/composables/useSupabase'
import {useUserStore} from "@/stores/userStore";


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
        }
    }
})