<template>
  <div class="home">我是home组件</div>
</template>

<script>
export default {
  name: 'Home'
}
</script>

<style lang="less" scoped>
  // @import '../../assets/style/mixins.less';
  .home {
    .hoverShadow()
  }
</style>
