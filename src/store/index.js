import { createStore } from 'vuex'
// 引入vuex持久化方法createPersistedState
import createPersistedState from 'vuex-persistedstate'
import user from './modules/user'
import cart from './modules/cart'
import category from './modules/category'

export default createStore({
  state: {
  },
  mutations: {
    // 可以定义修改state数据的方法接收两个参数state和step 通过commit触发事件
  },
  actions: {
    // 可以处理异步的方法接收两个参数context和传递的参数step 通过dispatch属性触发
  },
  getters: {
  },
  modules: {
    // 模块化数据
    user,
    cart,
    category
  },
  plugins: [
    // veux持久化配置
    createPersistedState({
      key: 'rabbitstore-client',
      paths: ['user', 'cart']
    })
  ]
})
