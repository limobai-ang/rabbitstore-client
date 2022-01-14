<template>
  <HomePanel title="热门品牌" sub-title="国际经典 品质保证" ref="target">
    <template v-slot:right>
      <a href="javascript:;" class="iconfont icon-angle-left prev" :class="{disabled: !index > 0}" @click="setIndex('prev')"></a>
      <a href="javascript:;" class="iconfont icon-angle-right next" :class="{disabled: !index < ListPage - 1}" @click="setIndex('next')"></a>
    </template>
    <div class="box" ref="box">
      <Transition name="fade">
        <ul class="list" v-if="brandList.length" :style="{transform:`translateX(${-index*1240}px)`}">
          <li v-for="item in brandList" :key="item.id">
            <RouterLink to="/">
              <img :src="item.picture" alt="" />
            </RouterLink>
          </li>
        </ul>
        <div v-else class="skeleton">
          <AppSkeleton
            class="item"
            v-for="i in 5"
            :key="i"
            animated
            bg="#e4e4e4"
            width="240px"
            height="305px"
          />
        </div>
      </Transition>
    </div>
  </HomePanel>
</template>

<script>
import HomePanel from './HomePanel'
import { findBrand } from '@/api/home'
import { useLazyData } from '@/hooks'
import { computed, ref } from 'vue-demi'
export default {
  name: 'HomeBrand',
  components: { HomePanel },
  setup () {
    const index = ref(0)
    // 需要传参 自己包装一层函数
    const { target, result: brandList } = useLazyData(() => findBrand(10))

    // 计算品牌页数
    const ListPage = computed(() => {
      return Math.ceil(brandList.value.length / 5)
    })
    // 控制index的滚动
    const setIndex = (flag) => {
      if (flag === 'prev') {
        index.value > 0 && index.value--
      } else {
        index.value < ListPage.value - 1 && index.value++
      }
    }
    return {
      brandList,
      target,
      index,
      setIndex,
      ListPage
    }
  }
}
</script>

<style scoped lang='less'>
  .home-panel {
    background: #f5f5f5;
  }
  .iconfont {
    width: 20px;
    height: 20px;
    background: #ccc;
    color: #fff;
    display: inline-block;
    text-align: center;
    margin-left: 5px;
    background: @xtxColor;
    &::before {
      font-size: 12px;
      position: relative;
      top: -2px;
    }
    &.disabled {
      background: #ccc;
      cursor: not-allowed;
    }
  }
  .box {
    display: flex;
    width: 100%;
    height: 345px;
    overflow: hidden;
    padding-bottom: 40px;
    .list {
      width: 200%;
      display: flex;
      transition: all 1s;
      li {
        margin-right: 10px;
        width: 240px;
        &:nth-child(5n) {
          margin-right: 0;
        }
        img {
          width: 240px;
          height: 305px;
        }
      }
    }
  }
</style>
