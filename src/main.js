import Vue from 'vue'
import App from './App.vue'

import router from "./router"
// 全局导入axios
import "./utils/request"


// 导入elementUI的组件
import "./element/element"

// 导入全局样式--样式我们一般写在最后一个，避免被覆盖
import "./styles/global.less"

Vue.config.productionTip = false



new Vue({
    // 注入根组件
    router,
    render: h => h(App),
}).$mount('#app')