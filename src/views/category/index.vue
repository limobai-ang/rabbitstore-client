<template>
  <div class="category container">
    <!-- 面包屑 -->
    <AppBread>
      <AppBreadItem to="/">首页</AppBreadItem>
      <transition name="fade-right" mode="out-in">
        <!-- 不同的key可以创建移除元素，创造触发动画条件。 -->
      <AppBreadItem :key="topCategory.id">{{ topCategory.name }}</AppBreadItem>
      </transition>
    </AppBread>
    <!-- 轮播图 -->
    <CategoryBanner />
    <!-- 所有二级分类 -->
    <div class="sub-list">
      <h3>全部分类</h3>
      <ul>
        <li v-for="item in topCategory.children" :key="item.id">
          <a href="javascript:;">
            <!-- v-lazyload="item.picture"  懒加载指令  -->
            <img :src="item.picture" />
            <p>{{ item.name }}</p>
          </a>
        </li>
      </ul>
    </div>
    <!-- 分类关联商品 -->
    <div class="ref-goods" v-for="item in subList.children" :key="item.id">
      <div class="head">
        <h3>- {{item.name}} -</h3>
        <p class="tag">温暖柔软，品质之选</p>
        <AppMore />
      </div>
      <div class="body">
        <GoodsItem v-for="goods in item.goods" :key="goods.id" :goods='goods' />
      </div>
    </div>
  </div>
</template>

<script>
import CategoryBanner from './components/CategoryBanner'
import GoodsItem from './components/GoodsItem'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { computed, ref, watch } from 'vue'
import { findTopCategory } from '@/api/category'
export default {
  name: 'Category',
  components: {
    CategoryBanner,
    GoodsItem
  },
  setup () {
    // 面包屑+所有分类
    const store = useStore()
    const route = useRoute()
    const topCategory = computed(() => {
      let cate = {}
      const item = store.state.category.list.find((item) => {
        return item.id === route.params.id
      })
      if (item) cate = item
      return cate
    })

    // 子节点商品
    const subList = ref([])

    const getSubList = () => {
      findTopCategory(route.params.id).then(res => {
        subList.value = res.result
      })
    }
    watch(() => route.params.id, (newVal) => {
      // newVal && getSubList()
      if (newVal && `/category/${newVal}` === route.path) getSubList()
    }, { immediate: true })
    return {
      topCategory,
      subList
    }
  }
}
</script>
<style scoped lang="less">
  .category {
    h3 {
      font-size: 28px;
      color: #666;
      font-weight: normal;
      text-align: center;
      line-height: 100px;
    }
    .sub-list {
      margin-top: 20px;
      background-color: #fff;
      ul {
        display: flex;
        padding: 0 32px;
        flex-wrap: wrap;
        li {
          width: 168px;
          height: 160px;
          a {
            text-align: center;
            display: block;
            font-size: 16px;
            img {
              width: 100px;
              height: 100px;
            }
            p {
              line-height: 40px;
            }
            &:hover {
              color: @xtxColor;
            }
          }
        }
      }
    }
    // 分类商品
    .ref-goods {
      background-color: #fff;
      margin-top: 20px;
      position: relative;
      .head {
        .app-more {
          position: absolute;
          top: 20px;
          right: 20px;
        }
        .tag {
          text-align: center;
          color: #999;
          font-size: 20px;
          position: relative;
          top: -20px;
        }
      }
      .body {
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;
        padding: 0 65px 30px;
      }
    }
  }
</style>
