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
