<template>
  <div class='app-goods-page'>
    <div class="container">
      <!-- 面包屑导航 -->
      <AppBread v-if="goodsData">
        <AppBreadItem to="/">首页</AppBreadItem>
        <AppBreadItem :to="`/category/${goodsData.categories[1].id}`">{{goodsData.categories[1].name}}</AppBreadItem>
        <AppBreadItem :to="`/category/sub/${goodsData.categories[0].id}`">{{goodsData.categories[0].name}}</AppBreadItem>
        <AppBreadItem >{{goodsData.name}}</AppBreadItem>
      </AppBread>
      <!-- 面包屑导航骨架 -->
      <AppSkeleton height="72px" width="50%" bg="#e4e4e4" animated v-else />
      <!-- 商品信息 -->
      <div class="goods-info">
        <!-- 图片区域 -->
        <div class="media">
          <GoodsImage :images="goodsData?goodsData.mainPictures:[]" />
          <GoodsSales />
        </div>
        <!-- 信息区域 -->
        <div class="spec">
          <GoodsInfoSpec :goods="goodsData" v-if="goodsData"/>
        </div>
      </div>
      <!-- 商品推荐 -->
      <GoodsRelevant />
      <!-- 商品详情 -->
      <div class="goods-footer">
        <div class="goods-article">
          <!-- 商品+评价 -->
          <div class="goods-tabs"></div>
          <!-- 注意事项 -->
          <div class="goods-warn"></div>
        </div>
        <!-- 24热榜+专题推荐 -->
        <div class="goods-aside"></div>
      </div>
    </div>
  </div>
</template>

<script>
import GoodsRelevant from './components/GoodsRelevant.vue'
import GoodsImage from './components/GoodsImage.vue'
import GoodsSales from './components/GoodsSales.vue'
import GoodsInfoSpec from './components/GoodsInfoSpec.vue'
import { useRoute } from 'vue-router'
import { getGoods } from '@/api/goods'
import { ref, watch } from 'vue-demi'
export default {
  name: 'AppGoodsPage',
  components: {
    GoodsRelevant,
    GoodsImage,
    GoodsSales,
    GoodsInfoSpec
  },
  setup () {
    // 当前路由信息
    const route = useRoute()
    // 获取商品信息
    const goodsData = ref(null)
    getGoods(route.params.id).then(res => {
      console.log(res)
      goodsData.value = res.result
    })

    // 监听商品地址id的改变
    watch(() => route.params.id, (newVal) => {
      if (route.path === `/product/${newVal}`) {
        getGoods(newVal)
      }
    })
    return {
      goodsData
    }
  }
}
</script>

<style scoped lang='less'>
  // 商品信息
  .goods-info {
    min-height: 600px;
    background: #fff;
    display: flex;
    .media {
      width: 580px;
      height: 600px;
      padding: 30px 50px;
    }
    .spec {
      flex: 1;
      padding: 30px 30px 30px 0;
    }
  }
  .goods-footer {
    display: flex;
    margin-top: 20px;
    .goods-article {
      width: 940px;
      margin-right: 20px;
    }
    .goods-aside {
      width: 280px;
      min-height: 1000px;
    }
  }
  .goods-tabs {
    min-height: 600px;
    background: #fff;
  }
  .goods-warn {
    min-height: 600px;
    background: #fff;
    margin-top: 20px;
  }

  // 面包屑骨架
  .app-skeleton {
    padding: 25px 10px;
  }
</style>
