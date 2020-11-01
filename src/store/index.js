import Vue from "vue"

import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    // 数据
    state: {
        userInfo: {}
    },
    // //导入数据
    mutations: {
        setUserInfo(state, payload) {
            state.userInfo = payload
        }
    },
    getters: {
        getUserInfo(state) {
            return state.userInfo

        }
    }
})

export default store