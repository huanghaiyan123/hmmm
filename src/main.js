import Vue from 'vue'
import App from './App.vue'
// 路由
import router from "./router"
// 全局导入axios
import "./utils/request"


// 导入elementUI的组件
import "./plugins/element"

//导入仓库
import store from "./store"


// 导入全局样式--样式我们一般写在最后一个，避免被覆盖
import "./styles/global.less"

Vue.config.productionTip = false



new Vue({
    // 注入根组件
    router,
    // 以 store 选项的方式“注入”该 store 的机制：
    store,
    render: h => h(App),
}).$mount('#app')