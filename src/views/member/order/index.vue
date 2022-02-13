<template>
  <AppTabs v-model="activeName">
    <AppTabsPanel label="全部订单" name="order">
        <div class="order-list" v-if="orderList">
          <OrderItem v-for="item in orderList" :key="item.id" :order="item" />
        </div>
    </AppTabsPanel>
    <AppTabsPanel label="待付款" name="dfk">待付款</AppTabsPanel>
  </AppTabs>
</template>

<script>
import OrderItem from './components/OrderItem'
import { ref, reactive } from 'vue-demi'
import { findOrderList } from '@/api/order'
export default {
  name: 'OrderPage',
  components: { OrderItem },
  setup () {
    const activeName = ref('order')
    // 查询订单参数
    const requestParams = reactive({
      page: 1,
      pageSize: 5,
      orderState: 0
    })
    // 订单列表
    const orderList = ref(null)
    // 查询订单
    findOrderList(requestParams).then((data) => {
      orderList.value = data.result.items
    })
    return { activeName, orderList }
  }
}
</script>

<style>
</style>
