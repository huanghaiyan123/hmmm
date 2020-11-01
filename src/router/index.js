import Vue from "vue"

import VueRouter from "vue-router"

// import Login from "../views/login/Login"

// import User from "../views/layout/user/Index"
// import Chart from "../views/layout/chart/Index"
// import Enterprise from "../views/layout/enterprise/Index"
// import Question from "../views/layout/question/Index"
// import Subject from "../views/layout/subject/Index"
// import NotFound from "../404/NotFound"
// import Layout from "../views/layout/Index"
// import Welcome from "../views/layout/welcome/Welcome"

// 按需导入懒加载
const Login = () =>
    import ('../views/login/Login')
const Chart = () =>
    import ('../views/layout/chart/Index')
const User = () =>
    import ('../views/layout/user/Index')
const Enterprise = () =>
    import ('../views/layout/enterprise/Index')
const Question = () =>
    import ('../views/layout/question/Index')
const Subject = () =>
    import ('../views/layout/subject/Index')
const Layout = () =>
    import ('../views/layout/Index')
const Welcome = () =>
    import ('../views/layout/welcome/Welcome')
const NotFound = () =>
    import ('../404/NotFound')

Vue.use(VueRouter)

import { getToken } from '@/utils/token';

const routes = [{ path: '/login', component: Login, meta: { title: '登录' } },

    { path: '/', redirect: "/login" },
    {
        path: '/layout',
        component: Layout,
        meta: { title: '管理后台' },
        redirect: '/layout/welcome',

        children: [{
                path: 'welcome',
                component: Welcome,
                meta: {
                    fullpath: '/layout/welcome',
                    icon: 'el-icon-s-home',
                    title: '首页',
                    roles: ['超级管理员', '管理员', '老师', '学生']
                }
            }, {
                path: 'chart',
                component: Chart,
                meta: {
                    fullpath: '/layout/chart',
                    icon: 'el-icon-pie-chart',
                    title: '数据预览',
                    roles: ['超级管理员', '管理员', '老师']
                }
            },
            {
                path: 'user',
                component: User,
                meta: {
                    fullpath: '/layout/user',
                    icon: 'el-icon-user',
                    title: '用户列表',
                    roles: ['超级管理员', '管理员', '老师']
                }
            },
            {
                path: 'enterprise',
                component: Enterprise,
                meta: {
                    fullpath: '/layout/enterprise',
                    icon: 'el-icon-office-building',
                    title: '企业列表',
                    roles: ['超级管理员', '管理员', '老师']
                }
            },
            {
                path: 'question',
                component: Question,
                meta: {
                    fullpath: '/layout/question',
                    icon: 'el-icon-edit-outline',
                    title: '题库列表',
                    roles: ['超级管理员', '管理员', '老师', '学生']
                }
            },k 
            {
                path: 'subject',
                component: Subject,
                meta: {
                    fullpath: '/layout/subject',
                    icon: 'el-icon-notebook-2',
                    title: '学科列表',
                    roles: ['超级管理员', '管理员', '老师']

                }
            },



        ]
    },
    { path: '*', component: NotFound }



]



const router = new VueRouter({
    routes
})

// 导航前置守卫
/**
 * 这个回调函数，在每次路由切换之前（无论是声明式导航，还是编程式导航）都会执行这个方法
 *
 * 参数1：to 表示你要去的路径
 * 参数2：from 你上一次的路径
 * 参数3：next 代表放行以及跳转指定的页面
 */

router.beforeEach((to, from, next) => {
    // 如果登录跳转.根据登录成功还是失败来决定跳转页面,如果是登录页面就直接放行
    if (to.path === '/login') {
        next()
    } else {
        const token = getToken()

        if (token) {
            next()
        } else {
            next('/login')

        }
    }

})


// 导航后置守卫
router.afterEach((to) => {
    document.title = to.meta.title || '黑马面面'
})


export default router