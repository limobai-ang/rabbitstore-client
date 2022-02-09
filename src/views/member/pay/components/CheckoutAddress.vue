<template>
  <div class="checkout-address">
    <div class="text">
      <div v-if="!defaultAddress" class="none">
        您需要先添加收货地址才可提交订单。
      </div>
      <ul v-else>
        <li>
          <span>收<i />货<i />人：</span>{{ defaultAddress.receiver }}
        </li>
        <li>
          <span>联系方式：</span
          >{{ defaultAddress.contact.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2") }}
        </li>
        <li>
          <span>收货地址：</span>{{ defaultAddress.fullLocation }}{{ defaultAddress.address }}
        </li>
      </ul>
      <a href="javascript:;" @click="openAddressEdit(defaultAddress)">修改地址</a>
    </div>
    <div class="action">
      <AppButton class="btn" @click="openDialog()">切换地址</AppButton>
      <AppButton class="btn" @click="openAddressEdit()">添加地址</AppButton>
    </div>
  </div>
  <AppDialog title="切换收货地址" v-model:visible="dialogVisible">
    <div class="text item" :class="{active:selectedAddress&&item.id===selectedAddress.id}" @click="selectedAddress=item" v-for="item in list" :key="item.id" >
      <ul>
        <li>
          <span>收<i />货<i />人：</span>{{ item.receiver }}
        </li>
        <li><span>联系方式：</span>{{ item.contact }}</li>
        <li>
          <span>收货地址：</span
          >{{item.fullLocation + item.address}}
        </li>
      </ul>
    </div>
    <!-- vue3.0 仅支持v-slot+template写法 -->
    <template v-slot:footer>
      <AppButton
        type="gray"
        style="margin-right: 20px"
        @click="dialogVisible = false"
        >取消</AppButton
      >
      <AppButton type="primary" @click="confirmAddress">确认</AppButton>
    </template>
  </AppDialog>

  <!-- 添加和修改 -->
  <AddressEdit ref="AddressEditRef" @on-success="addAddressSuccess"/>
</template>
<script>
import { ref } from 'vue-demi'
import AddressEdit from './AddressEdit.vue'
export default {
  name: 'CheckoutAddress',
  emits: ['change'],
  components: { AddressEdit },
  props: {
    list: {
      type: Array,
      default: () => []
    }
  },
  setup (props, { emit }) {
    // 切换框的显示和隐藏
    const dialogVisible = ref(false)
    const openDialog = () => {
      dialogVisible.value = true
      selectedAddress.value = null
    }

    // 获取初始地址
    const getAddress = () => {
      // 如果没有数据就返回false
      if (!props.list.length) return false
      // 有默认地址就返回默认地址 没有就返回第一条
      const defaultAddress = props.list.find((item) => item.isDefault === 0)
      if (defaultAddress) {
        return defaultAddress
      } else {
        return props.list[0]
      }
    }
    // 找到默认收获地址
    const defaultAddress = ref(getAddress())

    emit('change', defaultAddress.value?.id)

    // 选择的地址
    const selectedAddress = ref(null)

    // 确认地址
    const confirmAddress = () => {
      dialogVisible.value = false
      defaultAddress.value = selectedAddress.value
      // 默认通知一个地址ID给父
      emit('change', defaultAddress.value?.id)
    }

    // 添加收货地址组件
    const AddressEditRef = ref(null)
    const openAddressEdit = (AddressData) => {
      AddressEditRef.value.open(AddressData)
    }

    // 添加成功的回调
    const addAddressSuccess = (formData) => {
      // formData如果是添加操作，传递的id为新的，在原地址数组中不会存在 就不能找到editAddress
      const editAddress = props.list.find(item => item.id === formData.id)
      if (editAddress) {
        // 修改
        for (const key in editAddress) {
          editAddress[key] = formData[key]
        }
      } else {
        const json = JSON.stringify(formData) // 需要克隆下，不然使用的是对象的引用
        // eslint-disable-next-line vue/no-mutating-props
        props.list.unshift(JSON.parse(json))
      }
    }
    return {
      dialogVisible,
      defaultAddress,
      confirmAddress,
      selectedAddress,
      openDialog,
      openAddressEdit,
      AddressEditRef,
      addAddressSuccess
    }
  }
}
</script>
<style scoped lang="less">
  .checkout-address {
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
  .app-dialog {
  .text {
    flex: 1;
    min-height: 90px;
    display: flex;
    align-items: center;
    &.item {
      border: 1px solid #f5f5f5;
      margin-bottom: 10px;
      cursor: pointer;
      &.active,&:hover {
        border-color: @xtxColor;
        background: lighten(@xtxColor,50%);
      }
      > ul {
        padding: 10px;
        font-size: 14px;
        line-height: 30px;
      }
    }
  }
}
</style>
