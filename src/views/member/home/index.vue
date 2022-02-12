<template>
  <div class="member-home">
    <!-- 概览 用户信息-->
    <HomeOverview />
    <!-- 收藏 -->
    <HomePanel title="我的收藏">
      <GoodsItem v-for="item in collectGoods" :key="item.id" :goods="item" />
    </HomePanel>
    <!-- 足迹 -->
    <HomePanel title="我的足迹">
      <GoodsItem v-for="item in collectGoods" :key="item.id" :goods="item" />
    </HomePanel>
    <!-- 猜你喜欢 -->
    <GoodsRelevant />
  </div>
</template>
<script>
import HomeOverview from './components/HomeOverview'
import HomePanel from './components/HomePanel'
import GoodsRelevant from '@/views/goods/components/GoodsRelevant'
import GoodsItem from '@/views/category/components/GoodsItem'
import { findCollect } from '@/api/member'
import { ref } from 'vue-demi'
export default {
  name: 'MemberHome',
  components: {
    HomeOverview,
    HomePanel,
    GoodsRelevant,
    GoodsItem
  },
  setup () {
    // 调用模拟的接口
    const collectGoods = ref([])
    findCollect({
      page: 1,
      pageSize: 4
    }).then(data => {
      collectGoods.value = data.result.items
    })
    return {
      collectGoods
    }
  }
}
</script>
<style scoped lang="less">
:deep(.app-carousel) .carousel-btn.prev {
  left: 5px;
}
:deep(.app-carousel) .carousel-btn.next {
  right: 5px;
}
</style>
