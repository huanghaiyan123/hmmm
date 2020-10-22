import Vue from "vue"

import VueRouter from "vue-router"

import Login from "../views/login/Login"
import Register from "../views/login/Register"
import User from "../views/layout/user/Index"
import Chart from "../views/layout/chart/Index"
import NotFound from "../views/NotFound"

Vue.use(VueRouter)

let routes = [{ path: '/login', component: Login },
    { path: '/register', component: Register },
    { path: '/', component: Login },
    { path: '/user/index', component: User },
    { path: '/chart/index', component: Chart },
    { path: '/', component: Login },
    { path: '*', component: NotFound }

]

const router = new VueRouter({
    routes
})

export default router