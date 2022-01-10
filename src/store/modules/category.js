// 分类模块
import { topCategory } from '@/api/constants'

export default {
  namespaced: true,
  state () {
    return {
      // 分类信息集合 基于常量数据定义state数据
      list: topCategory.map(item => ({ name: item, children: [], goods: [], open: false }))
    }
  },
  mutations: {
    setList (state, data) {
      state.list = data
    },
    // 控制二级菜单的显示隐藏
    isShow (state, { id, flag }) {
      state.list.find(item => item.id === id).open = flag
    }
  },
  actions: {
  },
  getters: {
  }
}
