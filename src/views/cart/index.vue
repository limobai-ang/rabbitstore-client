<template>
  <div class="cart-page">
    <div class="container">
      <AppBread>
        <AppBreadItem to="/">首页</AppBreadItem>
        <AppBreadItem>购物车</AppBreadItem>
      </AppBread>
      <div class="cart">
        <table>
          <thead>
            <tr>
              <th width="120"><AppCheckbox @change="$event=>checkAll($event)" :modelValue="$store.getters['cart/isCheckAll']">全选</AppCheckbox></th>
              <th width="400">商品信息</th>
              <th width="220">单价</th>
              <th width="180">数量</th>
              <th width="180">小计</th>
              <th width="140">操作</th>
            </tr>
          </thead>
          <!-- 有效商品 -->
          <tbody>
            <tr v-for="item in $store.getters['cart/validCartData']" :key="item.id">
              <td><AppCheckbox @change="$event=>checkOne(item.skuId,$event)" :modelValue="item.selected" /></td>
              <td>
                <div class="goods">
                  <RouterLink to="/"><img :src="item.picture" alt=""></RouterLink>
                  <div>
                    <p class="name ellipsis">{{item.name}}</p>
                    <!-- 选择规格组件 -->
                    <CartSku :attrsText="item.attrsText" :skuId="item.skuId" @change="newSkuInfom => updateCartSku(newSkuInfom, item.skuId)"/>
                  </div>
                </div>
              </td>
              <td class="tc">
                <p>&yen;{{Number(item.nowPrice).toFixed(2)}}</p>
                <p>比加入时降价 <span class="red">&yen;{{(item.nowPrice - item.nowPrice).toFixed(2)}}</span></p>
              </td>
              <td class="tc">
                <AppNumbox @update:modelValue="newCount =>setCount(item.skuId,newCount)" :modelValue="item.count" :max="item.stock"/>
              </td>
              <td class="tc"><p class="f16 red">&yen;{{(item.nowPrice * item.count).toFixed(2)}}</p></td>
              <td class="tc">
                <p><a href="javascript:;">移入收藏夹</a></p>
                <p><a class="green" href="javascript:;" @click="closeCartGoods(item.skuId)">删除</a></p>
                <p><a href="javascript:;">找相似</a></p>
              </td>
            </tr>
          </tbody>
          <!-- 无效商品 -->
          <tbody>
            <tr><td colspan="6"><h3 class="tit">失效商品</h3></td></tr>
            <tr v-for="item in $store.getters['cart/invalidList']" :key="item.id">
              <td><AppCheckbox style="color:#eee;" /></td>
              <td>
                <div class="goods">
                  <RouterLink to="/"><img :src="item.picture" alt=""></RouterLink>
                  <div>
                    <p class="name ellipsis">{{item.name}}</p>
                    <p class="attr">{{item.attrsText}}</p>
                  </div>
                </div>
              </td>
              <td class="tc"><p>&yen;{{item.nowPric}}</p></td>
              <td class="tc">{{item.count}}</td>
              <td class="tc"><p class="f16 red">&yen;{{(item.nowPrice * item.count).toFixed(2)}}</p></td>
              <td class="tc">
                <p><a class="green" href="javascript:;" @click="closeCartGoods(item.skuId)">删除</a></p>
                <p><a href="javascript:;">找相似</a></p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- 操作栏 -->
      <div class="action">
        <div class="batch">
          <AppCheckbox @change="$event=>checkAll($event)" :modelValue="$store.getters['cart/isCheckAll']">全选</AppCheckbox>
          <a href="javascript:;" @click="batchDeleteCart">删除商品</a>
          <a href="javascript:;">移入收藏夹</a>
          <a href="javascript:;" @click="clearInvalidGoods">清空失效商品</a>
        </div>
        <div class="total">
          共 {{$store.getters['cart/cartAllTotal']}} 件商品，已选择 {{$store.getters['cart/selectedTotal']}} 件，商品合计：
          <span class="red">¥{{$store.getters['cart/selectedAmount']}}</span>
          <AppButton type="primary">下单结算</AppButton>
        </div>
      </div>
      <!-- 猜你喜欢 -->
      <GoodRelevant />
    </div>
  </div>
</template>
<script>
import Message from '@/components/library/Message'
import Confirm from '@/components/library/confirm'
import { useStore } from 'vuex'
import GoodRelevant from '@/views/goods/components/GoodsRelevant'
import CartSku from './components/CartSku'
export default {
  name: 'CartPage',
  components: { GoodRelevant, CartSku },
  setup () {
    const store = useStore()
    // 删除购物车数据
    const closeCartGoods = (skuId) => {
      Confirm({ text: '您确定从购物车删除该商品吗?', title: '删除商品' }).then(() => {
        // 调用删除方法
        store.dispatch('cart/deleteCart', skuId).then(() => {
          Message({ type: 'success', text: '删除商品成功' })
        }).catch(() => {
          Message({ type: 'error', text: '删除商品失败' })
        })
      }).catch(e => {
        // Message({ type: 'warn', text: '取消删除' })
      })
    }

    // 修改选中框状态
    const checkOne = (skuId, selected) => {
      store.dispatch('cart/updateCart', { skuId, selected })
    }

    // 全部选中
    const checkAll = (selected) => {
      store.dispatch('cart/checkAll', selected)
    }

    // 修改数量
    const setCount = (skuId, count) => {
      store.dispatch('cart/updateCart', { skuId, count })
    }

    // 批量删除商品
    const batchDeleteCart = () => {
      Confirm({ text: '您确定从购物车删除选中的商品吗?' }).then(() => {
        store.dispatch('cart/batchDeleteCart').then(() => {
          Message({ type: 'success', text: '删除商品成功' })
        })
      }).catch(e => {})
    }

    // 清空无效商品
    const clearInvalidGoods = () => {
      if (!store.getters['cart/invalidList'].length) return Message({ type: 'warn', text: '当前没有无效商品' })
      Confirm({ text: '您确定从购物车清空无效商品吗?' }).then(() => {
        store.dispatch('cart/clearInvalidGoods').then(() => {
          Message({ type: 'success', text: '清空无效商品成功' })
        })
      }).catch(e => {})
    }

    // 更新sku信息
    const updateCartSku = (newSkuInfo, oldSkuId) => {
      console.log(newSkuInfo, oldSkuId)
      store.dispatch('cart/updateCartSku', { oldSkuId, newSkuInfo })
    }

    return {
      closeCartGoods,
      checkOne,
      checkAll,
      setCount,
      batchDeleteCart,
      clearInvalidGoods,
      updateCartSku
    }
  }
}
</script>
<style scoped lang="less">
.tc {
  text-align: center;
  .xtx-numbox {
    margin: 0 auto;
    width: 120px;
  }
}
.red {
  color: @priceColor;
}
.green {
  color: @xtxColor
}
.f16 {
  font-size: 16px;
}
.goods {
  display: flex;
  align-items: center;
  img {
    width: 100px;
    height: 100px;
  }
  > div {
    width: 280px;
    font-size: 16px;
    padding-left: 10px;
    .attr {
      font-size: 14px;
      color: #999;
    }
  }
}
.action {
  display: flex;
  background: #fff;
  margin-top: 20px;
  height: 80px;
  align-items: center;
  font-size: 16px;
  justify-content: space-between;
  padding: 0 30px;
  .xtx-checkbox {
    color: #999;
  }
  .batch {
    a {
      margin-left: 20px;
    }
  }
  .red {
    font-size: 18px;
    margin-right: 20px;
    font-weight: bold;
  }
}
.tit {
  color: #666;
  font-size: 16px;
  font-weight: normal;
  line-height: 50px;
}
.cart-page {
  .cart {
    background: #fff;
    color: #666;
    table {
      border-spacing: 0;
      border-collapse: collapse;
      line-height: 24px;
      th,td{
        padding: 10px;
        border-bottom: 1px solid #f5f5f5;
        &:first-child {
          text-align: left;
          padding-left: 30px;
          color: #999;
        }
      }
      th {
        font-size: 16px;
        font-weight: normal;
        line-height: 50px;
      }
    }
  }
}
</style>
