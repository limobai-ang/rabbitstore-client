import { getNewCartGoods } from '@/api/cart'

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
    // 添加购物车数据
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
    },
    // 修改购物车商品
    updateCart (state, goods) {
      // goods中字段有可能不完整，goods有的信息才去修改。
      // 1. goods中必需又skuId，才能找到对应的商品信息
      const updateGoods = state.list.find(item => item.skuId === goods.skuId)
      for (const key in goods) {
        if (goods[key] !== null && goods[key] !== undefined && goods[key] !== '') {
          updateGoods[key] = goods[key]
        }
      }
    },
    // 删除购物车商品
    deleteCart (state, skuId) {
      const index = state.list.findIndex(item => item.skuId === skuId)
      state.list.splice(index, 1)
    },
    // 全选和取消全选
    checkAll (state, selected) {
      state.list.forEach(item => {
        item.selected = selected
      })
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
    },
    // 获取购物车列表
    findCartList (context) {
      return new Promise((resolve, reject) => {
        if (context.rootState.user.profile.token) {
          // 登录 TODO
        } else {
          // 本地
          // Promise.all() 可以并列发送多个请求，等所有请求成功，调用then
          // Promise.race() 可以并列发送多个请求，等最快的请求成功，调用then
          // 传参事promise数组
          const promiseArr = context.state.list.map(item => {
            // 返回接口函数的调用
            return getNewCartGoods(item.skuId)
          })
          Promise.all(promiseArr).then(dataArr => {
            dataArr.forEach((data, i) => {
              context.commit('updateCart', { skuId: context.state.list[i].skuId, ...data.result })
            })
            resolve()
          }).catch(e => {
            reject(e)
          })
        }
      })
    },
    // 删除购物车商品
    deleteCart (context, skuId) {
      return new Promise((resolve, reject) => {
        if (context.rootState.user.profile.token) {
          // 登录 TODO
        } else {
          // 本地
          context.commit('deleteCart', skuId)
          resolve()
        }
      })
    },
    // 商品全选和取消全选
    checkAll (context, selected) {
      return new Promise((resolve, reject) => {
        if (context.rootState.user.profile.token) {
          // 登录 TODO
        } else {
          // 本地
          context.commit('checkAll', selected)
          resolve()
        }
      })
    },
    // 修改购物车商品
    updateCart (context, goods) {
      return new Promise((resolve, reject) => {
        if (context.rootState.user.profile.token) {
          // 登录 TODO
        } else {
          // 本地
          context.commit('updateCart', goods)
          resolve()
        }
      })
    },
    // 批量删除选中商品
    batchDeleteCart (context) {
      return new Promise((resolve, reject) => {
        if (context.rootState.user.profile.token) {
          // 登录 TODO
        } else {
          // 本地
          // 1. 获取选中商品列表，进行遍历调用deleteCart mutataions函数
          context.getters.selectedList.forEach(item => {
            context.commit('deleteCart', item.skuId)
          })
          resolve()
        }
      })
    },
    // 清空无效商品
    clearInvalidGoods (context) {
      return new Promise((resolve, reject) => {
        if (context.rootState.user.profile.token) {
          // 登录 TODO
        } else {
          // 本地
          // 1. 获取选中商品列表，进行遍历调用deleteCart mutataions函数
          context.getters.invalidList.forEach(item => {
            context.commit('deleteCart', item.skuId)
          })
          resolve()
        }
      })
    }
  },
  // vuex中的计算属性
  getters: {
    // 有效购物车商品数据
    validCartData: (state) => state.list.filter(item => item.stock > 0 && item.isEffective),
    // 所有商品价格
    cartPrice: (state) => {
      return state.list.reduce((total, item) => total + item.nowPrice * item.count, 0).toFixed(2)
    },
    // 所有商品件数
    cartAllTotal: (state) => {
      return state.list.reduce((p, c) => p + c.count, 0)
    },
    // 无效商品列表
    invalidList (state) {
      return state.list.filter(item => !(item.stock > 0 && item.isEffective))
    },
    // 选中商品列表
    selectedList (state, getters) {
      return getters.validCartData.filter(item => item.selected)
    },
    // 选中商品件数
    selectedTotal (state, getters) {
      return getters.selectedList.reduce((p, c) => p + c.count, 0)
    },
    // 选中商品总金额
    selectedAmount (state, getters) {
      return getters.selectedList.reduce((total, item) => total + item.nowPrice * item.count, 0).toFixed(2)
    },
    // 是否全选
    isCheckAll (state, getters) {
      return getters.validCartData.length === getters.selectedList.length && getters.selectedList.length !== 0
    }
  }
}
