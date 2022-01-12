<template>
  <div class="home">
    <div class="home-entry">
      <div class="container home-box">
        <!-- 左侧分类 -->
        <HomeCategory />
        <!-- 轮播图 -->
        <HomeBanner />
      </div>
    </div>
  </div>
</template>
<script>
import HomeCategory from './components/HomeCategory'
import HomeBanner from './components/HomeBanner'
export default {
  name: 'Home',
  components: { HomeCategory, HomeBanner }
}
</script>
<style scoped lang="less">
.home-box {
  height: 600px;
}
</style>
