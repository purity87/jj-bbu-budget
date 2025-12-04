    import { createRouter, createWebHistory } from 'vue-router'
    import Login from '@/views/Login.vue'
    import Home from '@/views/Home.vue'
    import AddExpense from '@/views/AddExpense.vue'
    import ExpenseList from '@/views/ExpenseList.vue'
    import Stats from '@/views/Stats.vue'
    import {useUserStore} from "@/stores/userStore.ts";

    const routes = [
        { path: '/', redirect: '/home' },
        { path: '/login', component: Login },
        { path: '/home', component: Home },
        { path: '/add-expense', component: AddExpense },
        { path: '/list', component: ExpenseList },
        { path: '/stats', component: Stats }
    ]


    const router = createRouter({
        history: createWebHistory(),
        routes
    })

    router.beforeEach(async (to, _from, next) => {
        const userStore = useUserStore()

        // 세션 확인
        if (!userStore.user) {
            await userStore.loadUser(to.path === '/login') // 로그인 페이지라면 redirect 건너뛰기
        }

        const isAuth = !!userStore.user

        if (!isAuth && to.path !== '/login') return next('/login')
        if (isAuth && to.path === '/login') return next('/home')

        next()
    })

    export default router
