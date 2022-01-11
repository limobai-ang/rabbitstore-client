<template>
  <div class="home">
    <div class="home-entry">
      <div class="container">
        <!-- 左侧分类 -->
        <HomeCategory />
      </div>
    </div>
  </div>
</template>
<script>
import HomeCategory from './components/HomeCategory'
export default {
  name: 'Home',
  components: { HomeCategory }
}
</script>
<style scoped lang="less">
</style>
