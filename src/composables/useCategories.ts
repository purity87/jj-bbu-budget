import { ref, onMounted } from 'vue'
import { supabase } from '@/composables/useSupabase'

export function useCategories() {
    const categories = ref<{ id: number; name: string }[]>([])

    const loadCategories = async () => {
        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .eq('type', '지출')
        if (!error && data) categories.value = data
    }

    onMounted(loadCategories)

    return { categories, loadCategories }
}
