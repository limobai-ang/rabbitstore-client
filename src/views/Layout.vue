<template>
  <div class="layout">
    <p>用户的userName为: {{ $store.state.user.profile.account }}</p>
    <!-- 触发user模块下的方法修改数据 -->
    <button @click="$store.commit('user/setUser', { account: '张三' })">
      修改user模块的数据
    </button>
  </div>
</template>

<script>
// import { useStore } from 'vuex'
import request from '@/utils/request'
export default {
  name: 'Layout',
  setup () {
    // 在setup中获取使用vuex仓库
    // const store = useStore()
    request('/member/profile', 'post', { a: 0 })
  }
}
</script>
