<template>
  <div class="goods-tabs">
    <nav>
      <a :class="{active: currentView === 'GoodsDetail'}" href="javascript:;" @click="setCurrentView('GoodsDetail')">商品详情</a>
      <a :class="{active: currentView === 'GoodsComment'}" href="javascript:;" @click="setCurrentView('GoodsComment')">商品评价<span>(832+)</span></a>
    </nav>
    <!-- 动态路由组件 切换内容的地方 -->
    <component :is="currentView"></component>
  </div>
</template>

<script>
// import { getCommentInfoByGoods } from '@/api/goods'
import { ref } from 'vue-demi'
import GoodsComment from './GoodsComment.vue'
import GoodsDetail from './GoodsDetail.vue'
export default {
  name: 'GoodsTabs',
  components: {
    GoodsComment,
    GoodsDetail
  },
  setup () {
    const currentView = ref('GoodsDetail')
    // 设置动态路由的显示
    const setCurrentView = (componentName) => {
      currentView.value = componentName
    }

    // // 商品评价数量 (由于api原因商品评论数量显示为0, 暂时使用moke数据)
    // // 注入数据
    // const goods = inject('goods')
    // const commentInfo = ref({})
    // getCommentInfoByGoods(goods.value.id).then(res => {
    //   console.log(res)
    //   commentInfo.value = res.result
    // })
    return {
      currentView,
      setCurrentView
    }
  }
}
</script>

<style lang="less" scoped>
.goods-tabs {
  min-height: 600px;
  background: #fff;
  nav {
    height: 70px;
    line-height: 70px;
    display: flex;
    border-bottom: 1px solid #f5f5f5;
    a {
      padding: 0 40px;
      font-size: 18px;
      position: relative;
      > span {
        color: @priceColor;
        font-size: 16px;
        margin-left: 10px;
      }
      &:first-child {
        border-right: 1px solid #f5f5f5;
      }
      &.active {
        &::before {
          content: "";
          position: absolute;
          left: 40px;
          bottom: -1px;
          width: 72px;
          height: 2px;
          background: @xtxColor;
        }
      }
    }
  }
}
</style>
