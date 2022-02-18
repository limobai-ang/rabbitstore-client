<template>
  <div class="detail-logistics">
    <p>
      <span>{{logistics[0].time}}</span>
      <span>{{logistics[0].text}}</span>
    </p>
    <a href="javascript:;" @click="LogisticsPopUpRef.open(order)">查看物流</a>
  </div>
  <OrderLogistics ref="LogisticsPopUpRef"/>
</template>
<script>
import OrderLogistics from './OrderLogistics.vue'
import { logisticsOrder } from '@/api/order'
import { ref } from 'vue-demi'
export default {
  name: 'DetailLogistics',
  components: { OrderLogistics },
  props: {
    order: {
      type: Object,
      default: () => {}
    }
  },
  // 异步组件
  async setup (props) {
    const logistics = ref(null)
    const LogisticsPopUpRef = ref(null)
    const data = await logisticsOrder(props.order.id)
    logistics.value = data.result.list

    return {
      logistics,
      LogisticsPopUpRef
    }
  }
}
</script>
<style scoped lang="less">
.detail-logistics {
  height: 50px;
  display: flex;
  align-items: center;
  padding: 0 30px;
  background-color: #f5f5f5;
  margin: 30px 50px 0;
  > p {
    flex: 1;
    span {
      color: #999;
      &:first-child {
        margin-right: 30px;
      }
    }
  }
  > a {
    color: @xtxColor;
    text-align: center;
  }
}
</style>
