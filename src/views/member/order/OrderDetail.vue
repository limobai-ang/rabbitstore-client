<template>
  <div class="order-detail-page" v-if="order">
    <!-- 操作栏 -->
    <DetailAction :order="order" />
    <!-- 步骤条 组件AppSteps.vue-->
    <AppSteps :active="order.orderState">
      <AppStepsItem title="提交订单" :desc="order.createTime" />
      <AppStepsItem title="付款成功" :desc="order.createTime" />
      <AppStepsItem title="商品发货" :desc="order.createTime" />
      <AppStepsItem title="确认收货" :desc="order.evaluationTime" />
      <AppStepsItem title="订单完成" :desc="order.endTime" />
    </AppSteps>
    <!-- 物流栏 -->
    <Suspense v-if="[3, 4, 5].includes(order.orderState)">
      <!-- 组件加载完毕 -->
      <template #default>
        <DetailLogistics :order="order" />
      </template>
      <!-- 组件加载中显示 -->
      <template #fallback>
        <div class="loading">loading</div>
      </template>
    </Suspense>
    <!-- 订单商品信息 -->
    <OrderInfo :order="order" />
  </div>
</template>
<script>
import { ref } from 'vue'
import { findOrder } from '@/api/order'
import { useRoute } from 'vue-router'
import DetailAction from './components/DetailAction'
import DetailLogistics from './components/DetailLogistics.vue'
import OrderInfo from './components/OrderInfo.vue'
export default {
  name: 'OrderDetail',
  components: { DetailAction, DetailLogistics, OrderInfo },
  setup () {
    // 获取订单详情数据
    const order = ref(null)
    const route = useRoute()
    findOrder(route.params.id).then((data) => {
      order.value = data.result
    })

    return { order }
  }
}
</script>
<style scoped lang="less">
  .order-detail-page {
    background: #fff;
  }
</style>
