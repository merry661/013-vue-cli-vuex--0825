import Vue from 'vue'
import Vuex from 'vuex'
import { getItem, setItem } from '@/utils/storage.js'

Vue.use(Vuex)
const TOKEN_KEY = 'TOUTIAO_USER'

export default new Vuex.Store({
  state: {
    /*
    初始化userInfo，
    它是一个对象，存储当前登录用户信息（token等数据）
    // userInfo:null
    // userInfo: JSON.parse(window.localStorage.getItem(TOKEN_KEY))
    */
    userInfo: getItem(TOKEN_KEY)
  },
  mutations: {

    // 通过mutation修改state数据,setUser()参数：state容器，用户信息
    setUser(state, user) {
      state.userInfo = user;

      /*将用户信息存储到本地--持久化。
         本地存储只能存字符串，所以需要转换为JSON字符串
       // window.localStorage.setItem(TOKEN_KEY, JSON.stringify(state.userInfo))
      */
      setItem(TOKEN_KEY, state.userInfo)
    }
  },
  actions: {
  },
  modules: {
  }
})
