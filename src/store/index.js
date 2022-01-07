import { createStore } from 'vuex'

export default createStore({
  state: {
    userName: '张三'
  },
  mutations: {
    // 可以定义修改state数据的方法接收两个参数state和step 通过commit触发事件
  },
  actions: {
    // 可以处理异步的方法接收两个参数context和传递的参数step 通过dispatch属性触发
  },
  getters: {
    // vuex中的计算属性
    getName (state) {
      return state.userName + '!!!'
    }
  },
  modules: {
    // 模块化数据
  }
})
