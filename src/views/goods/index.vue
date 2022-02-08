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
        <div class="spec" v-if="goodsData">
          <GoodsInfoSpec :goods="goodsData" />
          <!-- Sku 组件 -->
          <GoodsSku :goods="goodsData" @change="changeSku" />
          <!-- 选择数量组件 -->
          <AppNumbox v-model="num" :max="goodsData.inventory" label="数量"/>
          <!-- 按钮 -->
          <AppButton type="primary" style="margin-top:20px;" @click="insertCart">加入购物车</AppButton>
        </div>
      </div>
      <!-- 商品推荐 -->
      <GoodsRelevant :goodsId="goodsData && goodsData.id" />
      <!-- 商品详情 -->
      <div class="goods-footer" v-if="goodsData" >
        <div class="goods-article">
          <!-- 商品+评价 -->
          <GoodsTabs />
          <!-- 注意事项 -->
          <GoodsWarn />
        </div>
        <!-- 24热榜+专题推荐 -->
        <div class="goods-aside">
          <GoodsHot :goodsId=" goodsData.id" :type="1" />
          <GoodsHot :goodsId="goodsData.id" :type="2" />
          <GoodsHot :goodsId="goodsData.id" :type="3" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import GoodsRelevant from './components/GoodsRelevant.vue'
import GoodsImage from './components/GoodsImage.vue'
import GoodsSales from './components/GoodsSales.vue'
import GoodsInfoSpec from './components/GoodsInfoSpec.vue'
import GoodsSku from './components/GoodsSku.vue'
import GoodsTabs from './components/GoodsTabs.vue'
import GoodsHot from './components/GoodsHot.vue'
import GoodsWarn from './components/GoodsWarn.vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { getGoods } from '@/api/goods'
import { ref, watch, provide } from 'vue-demi'
import Message from '@/components/library/Message'
export default {
  name: 'AppGoodsPage',
  components: {
    GoodsRelevant,
    GoodsImage,
    GoodsSales,
    GoodsInfoSpec,
    GoodsSku,
    GoodsTabs,
    GoodsHot,
    GoodsWarn
  },
  setup () {
    // 当前路由信息
    const route = useRoute()
    // 商品信息
    const goodsData = ref(null)
    // 商品数量
    const num = ref(1)

    // 向后代组件提供数据
    provide('goods', goodsData)
    // 获取商品数据
    const getGoodsInfo = (id) => {
      getGoods(id).then(res => {
        console.log(res)
        goodsData.value = res.result
      })
    }

    // 监听商品地址id的改变 （配置了immediate会提前执行一下）
    watch(() => route.params.id, (newVal) => {
      if (route.path === `/product/${newVal}`) {
        getGoodsInfo(newVal)
      }
    }, { immediate: true })

    // sku传递过来的值 （父组件需要判断值，如果规格选择不完整不能加入购物车）
    // currSku 当前sku的状态
    const currSku = ref(null)
    // 选择完整传递过来的sku是一个对象,没有选着完整传递的值为false
    const changeSku = (sku) => {
      // 判断传递过来的值是否选择完整
      currSku.value = sku
      if (sku) {
        goodsData.value.price = sku.price
        goodsData.value.oldPrice = sku.oldPrice
        goodsData.value.inventory = sku.inventory
      }
    }

    // 点击加入购物车
    const store = useStore()
    const insertCart = () => {
      if (currSku.value) {
        // 商品信息选择完整 触发insertCart事件并传递数据
        const { id, name, price, mainPictures } = goodsData.value
        const { skuId, specsText: attrsText, inventory: stock } = currSku.value
        store.dispatch('cart/insertCart', {
          skuId,
          attrsText,
          stock,
          id,
          name,
          price,
          nowPrice: price,
          picture: mainPictures[0],
          selected: true,
          isEffective: true,
          count: num.value
        }).then(res => {
          Message({ type: 'success', text: '添加至购物车成功' })
        })
      } else {
        Message({ type: 'warn', text: '请先选择完商品信息在添加至购物车' })
      }
    }
    return {
      goodsData,
      changeSku,
      num,
      insertCart,
      currSku
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
