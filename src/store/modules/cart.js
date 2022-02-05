// 购物车状态
export default {
  namespaced: true,
  state () {
    return {
      // 购物车数据
      list: []
    }
  },
  mutations: {
    // 修改购物车数据
    insertCart (state, payload) {
      // 加入购物车前看看购物车里面有没有相同的商品
      const sameIndex = state.list.findIndex(item => item.skuId === payload.skuId)
      console.log(sameIndex)
      if (sameIndex >= 0) {
        // 如果有相同的商品就在原来商品的数量加上现在的现在的商品数量
        payload.count = state.list[sameIndex].count + payload.count
        state.list.splice(sameIndex, 1)
      }
      state.list.unshift(payload)
    }
  },
  actions: {
    // 加入购物车
    insertCart (context, payload) {
      return new Promise((resolve, reject) => {
        // 判断用户是否登录
        // 如果你希望使用全局 state 和 getter，rootState 和 rootGetters 会作为第三和第四参数传入 getter，也会通过 context 对象的属性传入 action。
        if (context.rootState.user.profile.token) {
          // 以登陆
          console.log('以登陆', payload)
        } else {
          // 未登录
          context.commit('insertCart', payload)
          resolve()
        }
      })
    }
  },
  // vuex中的计算属性
  getters: {
    // 有效购物车商品数据
    validCartData: (state) => state.list.filter(item => item.selected),
    // 所有商品价格
    cartPrice: (state) => {
      return state.list.reduce((total, item) => {
        return total + item.nowPrice * item.count
      }, 0).toFixed(2)
    }
  }
}
