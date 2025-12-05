export interface Expense {
    id?: string                 // uuid (Supabase 자동 생성)
    budget_id: string           // uuid
    date: string                // YYYY-MM-DD
    category_id: number         // categories.id (int)
    amount: number              // numeric → number로 처리
    method?: string | null
    memo?: string | null
    created_by?: string         // uuid
    created_at?: string         // ISO datetime
}

// Supabase 인증 유저 타입
export interface AuthUser {
    id: string
    email: string
    [key: string]: any
}

export interface BudgetUser {
    id: string
    role: 'admin' | 'user'
    user_id: string
    budget_id: string
    created_at: string
}

export interface Budget {
    id: string
    name: string
    created_at: string
    role?: string               // 일반 사용자일 때 자신의 역할
    budget_users: BudgetUser[] // 참여자 목록
}
