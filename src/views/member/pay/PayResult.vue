<template>
  <div class="app-pay-page">
    <div class="container">
      <AppBread>
        <AppBreadItem to="/">首页</AppBreadItem>
        <AppBreadItem to="/cart">购物车</AppBreadItem>
        <AppBreadItem>支付结果</AppBreadItem>
      </AppBread>
      <!-- 支付结果 -->
      <div class="pay-result" v-if="order">
        <span class="iconfont icon-queren2 green" v-if="$route.query.payResult"></span>
        <span class="iconfont icon-shanchu red" v-else></span>
        <p class="tit">订单支付{{$route.query.payResult?'成功':'失败'}}</p>
        <p class="tip">我们将尽快为您发货，收货期间请保持手机畅通</p>
        <p>支付方式：<span>{{order.payChannel == 1 ? "支付宝" : "微信"}}</span></p>
        <p>支付金额：<span>¥{{order.payMoney}}</span></p>
        <div class="btn">
          <AppButton @click="$router.push('/member/order')" type="primary" style="margin-right: 20px">查看订单</AppButton>
          <AppButton type="gray" @click="$router.push('/')">进入首页</AppButton>
        </div>
        <p class="alert">
          <span class="iconfont icon-tip"></span>
          温馨提示：小兔鲜儿不会以订单异常、系统升级为由要求您点击任何网址链接进行退款操作，保护资产、谨慎操作。
        </p>
      </div>
    </div>
  </div>
</template>
<script>
import { ref } from 'vue-demi'
import { useRoute } from 'vue-router'
import { findOrder } from '@/api/order'

export default {
  name: 'PayResult',
  setup () {
    const order = ref(null)
    const route = useRoute()
    findOrder(route.query.orderId).then(data => {
      order.value = data.result
    })
    return { order }
  }
}
</script>
<style scoped lang="less">
  .pay-result {
    padding: 100px 0;
    background: #fff;
    text-align: center;
    > .iconfont {
      font-size: 100px;
    }
    .green {
      color: #1dc779;
    }
    .red {
      color: @priceColor;
    }
    .tit {
      font-size: 24px;
    }
    .tip {
      color: #999;
    }
    p {
      line-height: 40px;
      font-size: 16px;
    }
    .btn {
      margin-top: 50px;
    }
    .alert {
      font-size: 12px;
      color: #999;
      margin-top: 50px;
    }
  }
</style>
