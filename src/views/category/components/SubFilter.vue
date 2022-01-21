<template>
  <!-- 筛选区 -->
  <div class="sub-filter" v-if="filterData && !filterLoading">
    <div class="item">
      <div class="head">品牌：</div>
      <div class="body">
        <a href="javascript:;" :class="{active: filterData.selectedBrand == item.id}" v-for="item in filterData.brands" :key="item.id" @click="changeBrand(item.id)">{{item.name}}</a>
      </div>
    </div>
    <div class="item" v-for="item in filterData.saleProperties" :key="item.id">
      <div class="head">{{item.name}}：</div>
      <div class="body">
        <a href="javascript:;" :class="{active: item.selectedProp == properties.id}" v-for="properties in item.properties" :key="properties.id" @click="changeAttr(item, properties.id)">{{properties.name}}</a>
      </div>
    </div>
  </div>
  <div v-else class="sub-filter">
    <AppSkeleton class="item" width="800px" height="40px"  />
    <AppSkeleton class="item" width="800px" height="40px"  />
    <AppSkeleton class="item" width="600px" height="40px"  />
    <AppSkeleton class="item" width="600px" height="40px"  />
    <AppSkeleton class="item" width="600px" height="40px"  />
  </div>
</template>
<script>
import { findSubCategoryFilter } from '@/api/category'
import { ref, watch } from 'vue-demi'
import { useRoute } from 'vue-router'
export default {
  name: 'SubFilter',
  setup (props, { emit }) {
    const route = useRoute()
    const filterData = ref(null)
    const filterLoading = ref(false)
    // 分类发生变化的时候需要重新获取筛选数据，需要使用侦听器
    watch(() => route.params.id, (newVal, oldVal) => {
      // 从二级分类去顶级分类也会拿到ID，不能去加载数据因为它不是二级分类的ID
      if (newVal && route.path === ('/category/sub/' + newVal)) {
        // 控制loading的显示
        filterLoading.value = true
        // 获取数据
        findSubCategoryFilter(route.params.id).then(({ result }) => {
          // 补齐处理数据项，加上当前选中项，和全部属性
          result.selectedBrand = null
          result.brands.unshift({ id: null, name: '全部' })
          // 销售属性全部
          result.saleProperties.forEach(p => {
            p.selectedProp = undefined
            p.properties.unshift({ id: null, name: '全部' })
          })
          filterData.value = result
          // 数据加载完成之后该关闭loading
          filterLoading.value = false
        })
      }
    }, {
      immediate: true
    })

    // 获取筛选参数
    const getFilterParams = () => {
      // 过滤出来的数据
      const filterParams = {}
      const attrs = []
      // 找出选中品牌
      filterParams.brandId = filterData.value.selectedBrand
      // 过滤出选中参数项
      filterData.value.saleProperties.forEach(p => {
        const attr = p.properties.find(attr => attr.id === p.selectedProp)
        if (attr && attr.id !== undefined) {
          attrs.push({ groupName: p.name, propertyName: attr.name })
        }
      })
      if (attrs.length) filterParams.attrs = attrs
      return filterParams
    }

    // 选择品牌
    const changeBrand = (brandId) => {
      // 防止重复点击, 点击相同项不做处理
      if (filterData.selectedBrand === brandId) return
      // 设置当前项 用于筛选参数，和文字高亮
      filterData.value.selectedBrand = brandId
      emit('filter-change', getFilterParams())
    }
    // 选中属性
    const changeAttr = (data, attrId) => {
      if (data.selectedProp === attrId) return
      data.selectedProp = attrId
      emit('filter-change', getFilterParams())
    }
    return {
      filterData,
      filterLoading,
      changeBrand,
      changeAttr
    }
  }
}
</script>
<style scoped lang='less'>
  // 筛选区
  .sub-filter {
    background: #fff;
    padding: 25px;
    .item {
      display: flex;
      line-height: 40px;
      .head {
        width: 80px;
        color: #999;
      }
      .body {
        flex: 1;
        a {
          margin-right: 36px;
          transition: all 0.3s;
          display: inline-block;
          &.active,
          &:hover {
            color: @xtxColor;
          }
        }
      }
    }
    .app-skeleton {
      padding: 10px 0;
    }
  }
</style>
