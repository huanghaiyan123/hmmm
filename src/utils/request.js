import Vue from "vue"

import axios from "axios"
import { getToken, removeToken } from "./token"
import router from "../router"

// / 设置基准路径
// 只有以 VUE_APP_ 开头的变量会被 webpack.DefinePlugin 静态嵌入到客户端侧的包中。你可以在应用的代码中这样访问它们：
axios.defaults.baseURL = process.env.VUE_APP_BASEURL

// 设置允许携带cookies
axios.defaults.withCredentials = true

// 添加请求拦截器
axios.interceptors.request.use(function(config) {
    // 在发送请求之前做些什么
    // 设置token请求头--设置请求头
    console.log(config);
    const token = getToken()
    if (token) {
        config.headers.token = token
    }
    return config;
}, function(error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 添加响应拦截器
axios.interceptors.response.use(function(response) {
    // 对响应数据做点什么
    // 清除token--206状态得时移出token,跳转页面
    if (response.data.code === 206) {
        removeToken()
        router.push('/login')
        return response.data
    }
    return response.data;
}, function(error) {
    // 对响应错误做点什么
    return Promise.reject(error);
});


Vue.prototype.$http = axios