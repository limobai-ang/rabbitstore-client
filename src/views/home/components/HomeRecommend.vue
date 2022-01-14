<template>
  <div class="home-new-goods" ref="target">
    <HomePanel title="人气推荐" subTitle="人气爆款,不容错过">
      <!-- 通过插槽传入 查看更多组件 -->
      <template v-slot:right><AppMore /></template>
      <!-- 面板内容 -->
      <Transition name="fade">
        <ul ref="pannel" class="goods-list" v-if="goodsList.length">
          <li v-for="item in goodsList" :key="item.id">
            <RouterLink to="/">
              <img :src="item.picture" alt="" />
              <p class="name">{{ item.title }}</p>
              <p class="desc">{{ item.alt }}</p>
            </RouterLink>
          </li>
        </ul>
        <HomeSkeleton bg="#f0f9f4" v-else />
      </Transition>
    </HomePanel>
  </div>
</template>

<script>
import HomePanel from './HomePanel'
import HomeSkeleton from './HomeSkeleton'
import { getRecommen } from '@/api/home'
// import { ref } from 'vue-demi'
import { useLazyData } from '@/hooks'
export default {
  name: 'HomeRecommend',
  components: { HomePanel, HomeSkeleton },
  setup () {
    // 获取新鲜好物数据
    // const goodsList = ref([])
    // getRecommen().then((res) => {
    //   goodsList.value = res.result
    // })
    const { target, result } = useLazyData(getRecommen)
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
    height: 426px;
    li {
      width: 306px;
      height: 406px;
      .hoverShadow();
      img {
        width: 306px;
        height: 306px;
      }
      p {
        font-size: 22px;
        padding-top: 12px;
        text-align: center;
      }
      .desc {
        color: #999;
        font-size: 18px;
      }
    }
  }
</style>
