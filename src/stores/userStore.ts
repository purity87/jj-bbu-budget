import { defineStore } from 'pinia'
import { supabase } from '@/composables/useSupabase'
import router from "@/router";

export const useUserStore = defineStore('user', {
    state: () => ({
        user: null as any,
        budgets: [] as any[],
        currentBudget: null as any,
        isGlobalAdmin: false
    }),
    actions: {
        async loadUser(skipRedirect = false) {
            try {
                const { data: { session } } = await supabase.auth.getSession()
                if (!session) {
                    this.user = null
                    if (!skipRedirect) router.push('/login')
                    return null
                }

                const { data: { user } } = await supabase.auth.getUser()
                this.user = user
                this.isGlobalAdmin = this.user?.email === 'admin@jjbbu.com'
                await this.loadBudgets()
            } catch (err) {
                console.error('loadUser error', err)
                this.user = null
                if (!skipRedirect) router.push('/login')
            }
        },
        async login(email: string, password: string) {
            const { data, error } = await supabase.auth.signInWithPassword({ email, password })
            if (error) throw error
            this.user = data.user
            this.isGlobalAdmin = this.user?.email === 'admin@jjbbu.com'

            await this.loadBudgets();

            // 로그인 후 첫 번째 가계부 선택
            if (this.budgets.length > 0) {
                this.currentBudget = this.budgets[0]
            }
        },
        async logout() {
            const { error } = await supabase.auth.signOut()
            if (error) throw error
            this.user = null
            this.budgets = []
            this.currentBudget = null
            this.isGlobalAdmin = false
            // await supabase.auth.signOut()
            router.push('/login')
        },
        async loadBudgets() {
            if (!this.user) return

            let data, error
            if (this.isGlobalAdmin) {
                ({ data, error } = await supabase.from('budgets').select('*'))
            } else {
                ({ data, error } = await supabase
                        .from('budget_users')
                        .select('budget_id, role, budgets(name)')
                        .eq('user_id', this.user?.id)
                )
            }

            if (error) throw error
            this.budgets = data ?? []
            this.currentBudget = this.budgets[0] ?? null
        }
    },
    getters: {
        isAdmin: (state) => state.currentBudget?.role === 'admin' || state.isGlobalAdmin
    }
})