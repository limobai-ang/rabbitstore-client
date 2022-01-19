<template>
  <div class="category container">
    <!-- 面包屑 -->
    <AppBread>
      <AppBreadItem to="/">首页</AppBreadItem>
      <AppBreadItem to="/category/1005000">电器</AppBreadItem>
      <AppBreadItem>空调</AppBreadItem>
    </AppBread>
  </div>
</template>

<script>
export default {
  name: 'Category'
}
</script>

<style>
</style>
