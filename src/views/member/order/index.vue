<template>
  <AppTabs v-model="activeName" @tab-click="tabClick">
    <AppTabsPanel
      v-for="item in orderStatus"
      :key="item.name"
      :label="item.label"
      :name="item.name"
    >
      <div v-if="loading" class="loading"></div>
      <div class="none" v-if="!loading && orderList.length === 0">暂无数据</div>
      <div class="order-list" v-if="orderList.length">
        <OrderItem
          v-for="item in orderList"
          :key="item.id"
          :order="item"
          @order-cancel="cancelAnOrderFn"
        />
      </div>
    </AppTabsPanel>
  </AppTabs>
  <AppPagination
    v-if="total > requestParams.pageSize"
    :total="total"
    :pageSize="requestParams.pageSize"
    :currentPage="requestParams.page"
  />
  <AppDialog
    title="取消订单"
    :visible="cancelAnOrderDialog"
    @update:visible="cancelAnOrderDialog = false"
  >
    <!-- 组件内容 -->
    <div class="cancel-info">
      <p>取消订单后，本单享有的优惠可能会一并取消，是否继续？</p>
      <p class="tip">请选择取消订单的原因（必选）：</p>
      <div class="btn">
        <a
          @click="curText = item"
          v-for="item in cancelReason"
          :key="item"
          href="javascript:;"
          :class="{ active: curText === item }"
        >
          {{ item }}
        </a>
      </div>
    </div>
    <!-- 按钮操作 -->
    <template #footer>
      <AppButton
        type="gray"
        @click="cancelAnOrderDialog = false"
        style="margin-right: 20px"
        >取消</AppButton
      >
      <AppButton type="primary" @click="submit">确认</AppButton>
    </template>
  </AppDialog>
</template>

<script>
import OrderItem from './components/OrderItem'
import { ref, reactive, watch } from 'vue-demi'
import { findOrderList, cancelOrder } from '@/api/order'
import { orderStatus, cancelReason } from '@/api/constants'
import Message from '@/components/library/Message'
export default {
  name: 'OrderPage',
  components: { OrderItem },
  setup () {
    const activeName = ref('all')
    // 查询订单参数
    const requestParams = reactive({
      page: 1,
      pageSize: 5,
      // 查询的状态
      orderState: 0
    })
    // 订单列表
    const orderList = ref([])

    // 订单总条数
    const total = ref(0)
    // 加载时loadin状态
    const loading = ref(true)

    // 监听requestParams 的变化 如果发生改变就发起请求获取最新的数据
    watch(
      requestParams,
      () => {
        loading.value = true
        findOrderList(requestParams).then((data) => {
          console.log(data)
          orderList.value = data.result.items
          total.value = data.result.counts
          loading.value = false
        })
      },
      { immediate: true }
    )

    // 切换tabs标签页
    // name, index 当前点击的组件名字和索引
    const tabClick = ({ name, index }) => {
      // 此时：tab.index 就是订单的状态
      requestParams.orderState = index
      requestParams.page = 0
    }

    // 取消订单
    // 取消订单弹出框的显示与隐藏
    const cancelAnOrderDialog = ref(false)
    // 选中的原因
    const curText = ref(null)
    // 当前要取消的订单对象
    const CurOrder = ref(null)
    // 点击之后的回调
    const cancelAnOrderFn = (order) => {
      cancelAnOrderDialog.value = true
      CurOrder.value = order
    }
    // 弹出框确定提交方法
    const submit = () => {
      if (!curText.value) return Message({ text: '请选择取消订单原因', type: 'warn' })
      cancelOrder(CurOrder.value.id, curText.value).then(res => {
        // 更新订单状态
        CurOrder.value.orderState = 6
        cancelAnOrderDialog.value = false
        // 取消订单成功
        Message({ text: '取消订单成功', type: 'success' })
      })
    }
    return {
      activeName,
      orderList,
      tabClick,
      orderStatus,
      loading,
      total,
      requestParams,
      cancelAnOrderDialog,
      cancelAnOrderFn,
      cancelReason,
      submit,
      curText
    }
  }
}
</script>

<style lang="less" scoped>
  .order-list {
    padding: 20px;
    position: relative;
    min-height: 400px;
  }
  .loading {
    height: 100%;
    width: 100%;
    position: absolute;
    left: 0;
    top: 0;
    background: rgba(255, 255, 255, 0.9) url(../../../assets/images/loading.gif)
      no-repeat center;
  }
  .none {
    height: 400px;
    text-align: center;
    line-height: 400px;
    color: #999;
  }
.app-dialog ::v-deep .wrapper {
  width: 620px;
}
.cancel-info {
  p {
    font-size: 16px;
    line-height: 35px;
    &.tip {
      color: #999;
    }
  }
  .btn {
    padding-top: 21px;
    display: flex;
    flex-wrap: wrap;
    a {
      width: 256px;
      height: 45px;
      line-height: 45px;
      text-align: center;
      background-color: #ffffff;
      border: 1px solid #e4e4e4;
      margin-right: 20px;
      margin-bottom: 20px;
      color: #666;
      &:nth-child(2n){
        margin-right: 0;
      }
      &:hover,&.active {
        background-color: #e3f9f4;
        border-color: @xtxColor;
      }
    }
  }
}
</style>
