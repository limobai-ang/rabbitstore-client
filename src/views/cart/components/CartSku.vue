<template>
  <div class="cart-sku" ref="target">
    <div class="attrs" @click="toggle()">
      <span class="ellipsis">{{attrsText}}</span>
      <i class="iconfont icon-angle-down"></i>
    </div>
    <div class="layer" v-if="visible">
      <div class="loading" v-if="loading"></div>
      <GoodsSku :goods="goods" :skuId="skuId" @change="specification" v-else/>
      <div class="confirmButton" v-if="!loading">
      <AppButton size="mini" type="primary" @click="confirm">确定</AppButton>
      </div>
    </div>
  </div>
</template>
<script>
import { ref } from 'vue-demi'
import { onClickOutside } from '@vueuse/core'
import { getSpecsAndSkus } from '@/api/goods'
import GoodsSku from '@/views/goods/components/GoodsSku'
import Message from '@/components/library/Message'

export default {
  name: 'CartSku',
  components: {
    GoodsSku
  },
  props: {
    attrsText: {
      type: String,
      default: ''
    },
    skuId: {
      type: String,
      required: true
    }
  },
  setup (props, { emit }) {
    const visible = ref(false)
    const goods = ref(null)
    const loading = ref(false)

    // 打开和关闭弹出框方法
    const show = () => {
      // 显示弹框开启loading
      visible.value = true
      loading.value = true
      // 打开时发起请求获取数据
      getSpecsAndSkus(props.skuId).then(res => {
        goods.value = res.result
        // 信息获取成功关闭loading
        loading.value = false
      })
    }
    const hide = () => {
      visible.value = false
    }
    // 切换功能
    const toggle = () => {
      visible.value ? hide() : show()
    }

    const target = ref(null)
    onClickOutside(target, () => {
      hide()
    })

    // 规格方法
    const newSkuInfo = ref(null)
    const specification = (skuInfo) => {
      // 得当前选中的sku信息 保存起来
      newSkuInfo.value = skuInfo
    }

    // 确定按钮
    const confirm = () => {
      //  没有改变数据值为初始值null 或者选择规格与起始规格相同 就直接关闭
      if (newSkuInfo.value === null || newSkuInfo.value.skuId === props.skuId) return hide()
      // 规格没有选择完整 就提示一下用户
      if (newSkuInfo.value === false) return Message({ type: 'warn', text: '请选择完整规格' })
      // 将数据传递给父组件
      emit('change', newSkuInfo.value)
    }

    return { visible, toggle, target, goods, loading, specification, confirm }
  }
}
</script>
<style scoped lang="less">
.cart-sku {
  height: 28px;
  border: 1px solid #f5f5f5;
  padding: 0 6px;
  position: relative;
  margin-top: 10px;
  display:inline-block;
  .attrs {
    line-height: 24px;
    display: flex;
    span {
      max-width: 230px;
      font-size: 14px;
      color: #999;
    }
    i {
      margin-left: 5px;
      font-size: 14px;
    }
  }
  .layer {
    position: absolute;
    left: -1px;
    top: 40px;
    z-index: 10;
    width: 400px;
    border: 1px solid @xtxColor;
    box-shadow: 2px 2px 4px lighten(@xtxColor,50%);
    background: #fff;
    border-radius: 4px;
    font-size: 14px;
    padding: 20px;
    &::before {
      content: "";
      width: 12px;
      height: 12px;
      border-left: 1px solid @xtxColor;
      border-top: 1px solid @xtxColor;
      position: absolute;
      left: 12px;
      top: -8px;
      background: #fff;
      transform: scale(.8,1) rotate(45deg);
    }
    .loading {
      height: 224px;
      background: url(../../../assets/images/loading.gif) no-repeat center;
    }
    .confirmButton {
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>
