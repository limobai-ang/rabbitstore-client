<template>
  <div class="home">
    <div class="home-entry">
      <div class="container home-box">
        <!-- 左侧分类 -->
        <HomeCategory />
        <!-- 轮播图 -->
        <HomeBanner />
      </div>
      <!-- 新鲜好物 -->
      <HomeNewGoods />
      <!-- 好物推荐 -->
      <HomeRecommend />
      <!-- 热门品牌 -->
      <HomeBrand />
      <!-- 商品模块 -->
      <HomeProduct />
      <!-- 专题模块 -->
      <HomeSpecial />
    </div>
  </div>
</template>
<script>
import HomeCategory from './components/HomeCategory'
import HomeBanner from './components/HomeBanner'
import HomeNewGoods from './components/HomeNewGoods'
import HomeRecommend from './components/HomeRecommend'
import HomeBrand from './components/HomeBrand'
import HomeProduct from './components/HomeProduct'
import HomeSpecial from './components/HomeSpecial'
export default {
  name: 'Home',
  components: { HomeCategory, HomeBanner, HomeNewGoods, HomeRecommend, HomeBrand, HomeProduct, HomeSpecial }
}
</script>
<style scoped lang="less">

</style>
