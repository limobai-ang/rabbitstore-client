<template>
  <div class="detail-action">
    <div class="state">
      <span class="iconfont" :class="[`icon-order-${orderStatus[order.orderState].name}`]"></span>
      <p>{{orderStatus[3].label}}</p>
    </div>
    <div class="info">
      <p>订单编号：{{ order.id }}</p>
      <p>下单时间：{{ order.createTime }}</p>
    </div>
    <div class="btn">
      <!-- 待付款 -->
      <template v-if="order.orderState === 1">
        <AppButton
          @click="$router.push('/member/pay?id=' + order.id)"
          type="primary"
          size="small"
          >立即付款</AppButton
        >
        <AppButton type="gray" size="small">取消订单</AppButton>
      </template>
      <!-- 待发货 -->
      <template v-if="order.orderState === 2">
        <AppButton type="primary" size="small" @click="$router.push(`/member/checkout?orderId=${order.id}`)">再次购买</AppButton>
      </template>
      <!-- 待收货 -->
      <template v-if="order.orderState === 3">
        <AppButton type="primary" size="small" @click="confirmOrderFn(order)">确认收货</AppButton>
        <AppButton type="plain" size="small" @click="$router.push(`/member/checkout?orderId=${order.id}`)">再次购买</AppButton>
      </template>
      <!-- 待评价 -->
      <template v-if="order.orderState === 4">
        <AppButton type="primary" size="small" @click="$router.push(`/member/checkout?orderId=${order.id}`)">再次购买</AppButton>
        <AppButton type="plain" size="small">评价商品</AppButton>
        <AppButton type="gray" size="small">申请售后</AppButton>
      </template>
      <!-- 已完成 -->
      <template v-if="order.orderState === 5">
        <AppButton type="primary" size="small" @click="$router.push(`/member/checkout?orderId=${order.id}`)">再次购买</AppButton>
        <AppButton type="plain" size="small">查看评价</AppButton>
        <AppButton type="gray" size="small">申请售后</AppButton>
      </template>
      <!-- 已取消 -->
    </div>
  </div>
</template>
<script>
import { confirmOrder } from '@/api/order'
import { orderStatus } from '@/api/constants'
import Message from '@/components/library/Message'
import Confirm from '@/components/library/confirm'
export default {
  name: 'OrderDetailAction',
  props: {
    order: {
      type: Object,
      default: () => {}
    }
  },
  setup () {
    // 确认收货
    const confirmOrderFn = (order) => {
      // item 就是你要确认收货的订单
      Confirm({ text: '您确认收到货吗？确认后货款将会打给卖家。' }).then(() => {
        confirmOrder(order.id).then(() => {
          Message({ text: '确认收货成功', type: 'success' })
          // 确认收货后状态变成 待评价
          order.orderState = 4
        })
      })
    }
    return {
      orderStatus,
      confirmOrderFn
    }
  }
}
</script>
<style scoped lang="less">
  .detail-action {
    height: 180px;
    width: 100%;
    display: flex;
    align-items: center;
    .state {
      width: 220px;
      text-align: center;
      .iconfont {
        font-size: 40px;
        color: @xtxColor;
      }
      p {
        font-size: 16px;
        color: #666;
        margin-bottom: 10px;
      }
    }
    .info {
      width: 240px;
      line-height: 30px;
      p {
        color: #999;
      }
    }
    .btn {
      flex: 1;
      text-align: right;
      margin-right: 100px;
      .app-button {
        margin-left: 20px;
      }
    }
  }
</style>
