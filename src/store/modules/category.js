// 分类模块

import { topCategory } from '@/api/constants'
export default {
  namespaced: true,
  state () {
    return {
      // 分类信息集合
      list: topCategory.map(item => ({ name: item, children: [], goods: [], id: '', picture: '' }))
    }
  },
  mutations: {
    setList (state, data) {
      state.list = data
    }
  },
  actions: {
  },
  getters: {
  }
}
