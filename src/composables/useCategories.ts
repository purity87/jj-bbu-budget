import { ref } from 'vue'
import { supabase } from '@/composables/useSupabase'

export const categories = ref<{id: number, name: string}[]>([])

export const useCategories = () => {
    const fetchCategories = async () => {
        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .eq('type', '지출')
        if (!error && data) categories.value = data
    }

    return { categories, fetchCategories }
}
