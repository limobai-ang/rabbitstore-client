<template>
  <div class="goods-tabs">
    <nav>
      <a :class="{active: currentView === 'GoodsDetail'}" href="javascript:;" @click="setCurrentView('GoodsDetail')">商品详情</a>
      <a :class="{active: currentView === 'GoodsComment'}" href="javascript:;" @click="setCurrentView('GoodsComment')">商品评价<span>(500+)</span></a>
    </nav>
    <!-- 动态路由组件 切换内容的地方 -->
    <component :is="currentView"></component>
  </div>
</template>

<script>
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
