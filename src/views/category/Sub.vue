<template>
  <div class="container">
    <!-- 面包屑导航 -->
    <SubBread />
    <!-- 筛选组件 -->
    <SubFilter @filter-change="changeFilterSort" />
    <div class="goods-list">
      <!-- 排序组件 -->
      <SubSort @sort-change="changeFilterSort" />
      <!-- 列表 -->
      <ul>
        <li v-for="item in goodsList" :key="item.id">
          <GoodsItem :goods="item" />
        </li>
      </ul>
      <!-- 加载跟多 -->
      <AppInfiniteLoading
        :loading="loading"
        :finished="finished"
        @infinite="getData"
      />
    </div>
  </div>
</template>

<script>
import SubBread from './components/SubBread.vue'
import SubFilter from './components/SubFilter.vue'
import SubSort from './components/SubSort.vue'
import GoodsItem from './components/GoodsItem.vue'
import AppInfiniteLoading from '@/components/AppInfiniteLoading.vue'
import { ref, watch } from 'vue'
import { findSubCategoryGoods } from '@/api/category'
import { useRoute } from 'vue-router'
export default {
  name: 'Sub',
  components: {
    SubBread,
    SubFilter,
    SubSort,
    GoodsItem,
    AppInfiniteLoading
  },
  setup () {
    // 1. 基础布局
    // 2. 无限加载组件
    // 3. 动态加载数据且渲染
    // 4. 任何筛选条件变化需要更新列表
    const route = useRoute()

    const loading = ref(false)
    const finished = ref(false)
    const goodsList = ref([])
    // 查询参数
    let reqParams = {
      page: 1,
      pageSize: 20
    }
    // 获取数据函数  (加载更多组件触底自动触发该函数获取数据)
    const getData = () => {
      // 发请求开启loading
      loading.value = true
      reqParams.categoryId = route.params.id
      findSubCategoryGoods(reqParams).then(({ result }) => {
        if (result.items.length) {
          goodsList.value.push(...result.items)
          reqParams.page++
        } else {
          // 数据已经全部加载完了
          finished.value = true
        }
        // 请求结束
        loading.value = false
      })
    }

    // 切换二级分类重新加载
    watch(
      () => route.params.id,
      (newVal) => {
        if (newVal && route.path === '/category/sub/' + newVal) {
          goodsList.value = []
          // 初始化分页项查询参数数据
          reqParams = {
            page: 1,
            pageSize: 20
          }
          finished.value = false
        }
      }
    )

    // 监听筛选区改变, 监听排序改变
    const changeFilterSort = (Params) => {
      // 处理请求参数 作为APi参数发送请求获取数据
      reqParams = { ...reqParams, ...Params }
      reqParams.page = 1
      // 这里将goodsList 列表置为空了, 重新加载一下数据
      goodsList.value = []
      // 如果数据加载完毕, 就将数据加载完关闭
      finished.value && (finished.value = false)
      // 发送数据请求, 获取数据
      getData()
    }

    return { loading, finished, goodsList, getData, changeFilterSort }
  }
}
</script>

<style lang="less" scoped>
  .goods-list {
    background: #fff;
    padding: 0 25px;
    margin-top: 25px;
    ul {
      display: flex;
      flex-wrap: wrap;
      padding: 0 5px;
      li {
        margin-right: 20px;
        margin-bottom: 20px;
        &:nth-child(5n) {
          margin-right: 0;
        }
      }
    }
  }
</style>
