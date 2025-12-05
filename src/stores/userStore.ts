import { defineStore } from 'pinia'
import { supabase } from '@/composables/useSupabase'
import router from "@/router"
import type { AuthUser, Budget } from '@/types'

export const useUserStore = defineStore('user', {
    state: () => ({
        user: null as AuthUser | null,
        budgets: [] as Budget[],
        currentBudget: null as Budget | null,
        isGlobalAdmin: false
    }),

    actions: {
        async loadUser(skipRedirect = false) {
            try {
                const { data: { session } } = await supabase.auth.getSession()

                if (!session) {
                    this.user = null
                    if (!skipRedirect) router.push('/login')
                    return
                }

                const { data: { user } } = await supabase.auth.getUser()

                this.user = user as AuthUser
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

            this.user = data.user as AuthUser
            this.isGlobalAdmin = this.user?.email === 'admin@jjbbu.com'

            await this.loadBudgets()

            // 첫 가계부 자동 선택
            if (this.budgets.length > 0) {
                this.currentBudget = this.budgets[0] || null
            }
        },

        async logout() {
            const { error } = await supabase.auth.signOut()
            if (error) throw error

            this.user = null
            this.budgets = []
            this.currentBudget = null
            this.isGlobalAdmin = false

            await router.push('/login')
        },

        async loadBudgets() {
            if (!this.user) return

            let data: any, error: any

            if (this.isGlobalAdmin) {
                // 관리자: 모든 가계부 + 참여자
                ({ data, error } = await supabase
                        .from('budgets')
                        .select(`
            *,
            budget_users(*)
          `)
                )
            } else {
                // 일반 사용자: 참여중인 가계부
                ({ data, error } = await supabase
                        .from('budget_users')
                        .select(`
            role,
            budgets (
              *,
              budget_users(*)
            )
          `)
                        .eq('user_id', this.user.id)
                )
            }

            if (error) {
                console.error("loadBudgets error", error)
                return
            }

            if (this.isGlobalAdmin) {
                // 이미 구조 완성됨
                this.budgets = (data ?? []) as Budget[]
            } else {
                // 일반 사용자는 구조 변환 필요
                this.budgets = (data ?? []).map((item: any) => {
                    const budget = item.budgets

                    return {
                        ...budget,
                        role: item.role, // 본인의 역할(admin/user)
                        budget_users: budget.budget_users ?? []
                    } as Budget
                })
            }

            this.currentBudget = this.budgets[0] ?? null
        }
    },

    getters: {
        isAdmin: (state) =>
            state.isGlobalAdmin ||
            state.currentBudget?.role === 'admin'
    }
})
