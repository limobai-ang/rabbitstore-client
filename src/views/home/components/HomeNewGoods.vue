<template>
  <div class="home-new-goods" ref="target">
    <HomePanel title="新鲜好物" subTitle="新鲜出炉,品质靠谱">
      <!-- 通过插槽传入 查看更多组件 -->
      <template v-slot:right><AppMore /></template>
      <!-- 面板内容 -->
      <Transition name="fade">
      <ul class="goods-list" v-if="goodsList.length">
        <li v-for="item in goodsList" :key="item.id">
          <RouterLink :to="`/product/${item.id}`">
            <img :src="item.picture" alt="" />
            <p class="name ellipsis">{{ item.name }}</p>
            <p class="price">&yen;{{ item.price }}</p>
          </RouterLink>
        </li>
      </ul>
      <HomeSkeleton bg="#f0f9f4" v-else/>
      </Transition>
    </HomePanel>
  </div>
</template>

<script>
import HomePanel from './HomePanel'
import HomeSkeleton from './HomeSkeleton'
import { getNewGoods } from '@/api/home'
// import { ref } from 'vue-demi'
import { useLazyData } from '@/hooks'
export default {
  name: 'HomeNewGoods',
  components: { HomePanel, HomeSkeleton },
  setup () {
    // 获取新鲜好物数据
    // const goodsList = ref([])
    // getNewGoods().then((res) => {
    //   goodsList.value = res.result
    // })
    const { target, result } = useLazyData(getNewGoods)
    return {
      goodsList: result,
      target
    }
  }
}
</script>

<style lang="less" scoped>
.goods-list {
  display: flex;
  justify-content: space-between;
  height: 406px;
  li {
    width: 306px;
    height: 406px;
    background: #f0f9f4;
    .hoverShadow();
    img {
      width: 306px;
      height: 306px;
    }
    p {
      font-size: 22px;
      padding: 12px 30px 0 30px;
      text-align: center;
    }
    .price {
      color: @priceColor;
    }
  }
}
</style>
