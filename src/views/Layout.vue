<template>
  <div class="home">
    hello
  </div>
  <p>userName: {{$store.state.userName}}</p>
  <p>vuex计算属性: {{$store.getters.getName}}</p>
</template>

<script>
import { useStore } from 'vuex'
export default {
  name: 'Home',
  setup () {
    // 使用vuex仓库
    const store = useStore()
    console.log(store.state.userName)
    console.log(store.getters.getName)
  }
}
</script>
