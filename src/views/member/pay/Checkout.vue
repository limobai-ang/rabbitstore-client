<template>
  <div class="app-pay-checkout-page">
    <div class="container">
      <AppBread>
        <AppBreadItem to="/">首页</AppBreadItem>
        <AppBreadItem to="/cart">购物车</AppBreadItem>
        <AppBreadItem >填写订单</AppBreadItem>
      </AppBread>
      <div class="wrapper" v-if="checkoutInfo">
        <!-- 收货地址 -->
        <h3 class="box-title">收货地址</h3>
        <div class="box-body">
          <CheckoutAddress :list="checkoutInfo.userAddresses" @change="getAddress"/>
        </div>
        <!-- 商品信息 -->
        <h3 class="box-title">商品信息</h3>
        <div class="box-body">
          <table class="goods">
            <thead>
              <tr>
                <th width="520">商品信息</th>
                <th width="170">单价</th>
                <th width="170">数量</th>
                <th width="170">小计</th>
                <th width="170">实付</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in checkoutInfo.goods" :key="item.id">
                <td>
                  <a href="javascript:;" class="info">
                    <img :src="item.picture" alt="">
                    <div class="right">
                      <p>{{item.name}}</p>
                      <p>{{item.attrsText}}</p>
                    </div>
                  </a>
                </td>
                <td>&yen;{{item.price}}</td>
                <td>{{item.count}}</td>
                <td>&yen;{{item.totalPrice}}</td>
                <td>&yen;{{item.totalPayPrice}}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- 配送时间 -->
        <h3 class="box-title">配送时间</h3>
        <div class="box-body">
          <a class="my-btn active" href="javascript:;">不限送货时间：周一至周日</a>
          <a class="my-btn" href="javascript:;">工作日送货：周一至周五</a>
          <a class="my-btn" href="javascript:;">双休日、假日送货：周六至周日</a>
        </div>
        <!-- 支付方式 -->
        <h3 class="box-title">支付方式</h3>
        <div class="box-body">
          <a class="my-btn active" href="javascript:;">在线支付</a>
          <a class="my-btn" href="javascript:;">货到付款</a>
          <span style="color:#999">货到付款需付5元手续费</span>
        </div>
        <!-- 金额明细 -->
        <h3 class="box-title">金额明细</h3>
        <div class="box-body">
          <div class="total">
            <dl><dt>商品件数：</dt><dd>{{checkoutInfo.summary.goodsCount}}件</dd></dl>
            <dl><dt>商品总价：</dt><dd>¥{{checkoutInfo.summary.totalPrice}}</dd></dl>
            <dl><dt>运<i></i>费：</dt><dd>¥{{checkoutInfo.summary.postFee}}</dd></dl>
            <dl><dt>应付总额：</dt><dd class="price">¥{{checkoutInfo.summary.totalPayPrice}}</dd></dl>
          </div>
        </div>
        <!-- 提交订单 -->
        <div class="submit">
          <AppButton type="primary" @click="submitOrder">提交订单</AppButton>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import CheckoutAddress from './components/CheckoutAddress.vue'
import { findCheckoutInfo, createOrder, findOrderRepurchase } from '@/api/order'
import { reactive, ref } from 'vue-demi'
import { useRouter, useRoute } from 'vue-router'
import Message from '@/components/library/Message'

export default {
  name: 'PayCheckoutPage',
  components: {
    CheckoutAddress
  },
  setup () {
    // 需要提交的字段
    const requestParams = reactive({
      addressId: null,
      deliveryTimeType: 1,
      payType: 1,
      buyerMessage: '',
      goods: []
    })
    // 订单信息对象
    const checkoutInfo = ref(null)

    // 获取订单信息
    const route = useRoute()
    if (route.query.orderId) {
      // 使用商品订单结算 （再次购买）
      findOrderRepurchase(route.query.orderId).then(res => {
        checkoutInfo.value = res.result
        // 设置提交时候的商品
        requestParams.goods = checkoutInfo.value.goods.map(item => {
          return {
            skuId: item.skuId,
            count: item.count
          }
        })
      })
    } else {
      // 按照购物车商品结算
      findCheckoutInfo().then(res => {
        checkoutInfo.value = res.result
        // 设置提交时候的商品
        requestParams.goods = checkoutInfo.value.goods.map(item => {
          return {
            skuId: item.skuId,
            count: item.count
          }
        })
      })
    }
    // 配置地址
    const getAddress = (defaultAddressId) => {
      requestParams.addressId = defaultAddressId
    }

    // 提交订单
    const router = useRouter()
    const submitOrder = () => {
      if (!requestParams.addressId) return Message({ text: '请选择收货地址' })
      createOrder(requestParams).then(data => {
        router.push({ path: '/member/pay', query: { orderId: data.result.id } })
      })
    }
    return {
      checkoutInfo,
      getAddress,
      submitOrder
    }
  }

}
</script>
<style scoped lang="less">
.app-pay-checkout-page {
  .wrapper {
    background: #fff;
    padding: 0 20px;
    .box-title {
      font-size: 16px;
      font-weight: normal;
      padding-left: 10px;
      line-height: 70px;
      border-bottom: 1px solid #f5f5f5;
    }
    .box-body {
      padding: 20px 0;
    }
  }
}
.address {
  border: 1px solid #f5f5f5;
  display: flex;
  align-items: center;
  .text {
    flex: 1;
    min-height: 90px;
    display: flex;
    align-items: center;
    .none {
      line-height: 90px;
      color: #999;
      text-align: center;
      width: 100%;
    }
    > ul {
      flex: 1;
      padding: 20px;
      li {
        line-height: 30px;
        span {
          color: #999;
          margin-right: 5px;
          > i {
            width: 0.5em;
            display: inline-block;
          }
        }
      }
    }
    > a {
      color: @xtxColor;
      width: 160px;
      text-align: center;
      height: 90px;
      line-height: 90px;
      border-right: 1px solid #f5f5f5;
    }
  }
  .action {
    width: 420px;
    text-align: center;
    .btn {
      width: 140px;
      height: 46px;
      line-height: 44px;
      font-size: 14px;
      &:first-child {
        margin-right: 10px;
      }
    }
  }
}
.goods {
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  .info {
    display: flex;
    text-align: left;
    img {
      width: 70px;
      height: 70px;
      margin-right: 20px;
    }
    .right {
      line-height: 24px;
      p {
        &:last-child {
          color: #999;
        }
      }
    }
  }
  tr {
    th {
      background: #f5f5f5;
      font-weight: normal;
    }
    td,th {
      text-align: center;
      padding: 20px;
      border-bottom: 1px solid #f5f5f5;
      &:first-child {
        border-left: 1px solid #f5f5f5;
      }
      &:last-child {
        border-right: 1px solid #f5f5f5;
      }
    }
  }
}
.my-btn {
  width: 228px;
  height: 50px;
  border: 1px solid #e4e4e4;
  text-align: center;
  line-height: 48px;
  margin-right: 25px;
  color: #666666;
  display: inline-block;
  &.active,&:hover {
    border-color: @xtxColor;
  }
}
.total {
  dl {
    display: flex;
    justify-content: flex-end;
    line-height: 50px;
    dt {
      i {
        display: inline-block;
        width: 2em;
      }
    }
    dd {
      width: 240px;
      text-align: right;
      padding-right: 70px;
      &.price {
        font-size: 20px;
        color: @priceColor;
      }
    }
  }
}
.submit {
  text-align: right;
  padding: 60px;
  border-top: 1px solid #f5f5f5;
}
</style>
