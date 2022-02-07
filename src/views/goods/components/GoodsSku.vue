<template>
  <div class="goods-sku">
    <dl v-for="(item, index) in goods.specs" :key="index">
      <dt>{{item.name}}</dt>
      <dd>
        <template v-for="(info, index) in item.values" :key="index">
          <img :class="{selected: info.selected, disabled: info.disabled}" v-if="info.picture" :src="info.picture" @click="clickSpecs(item, info)" :title="info.name">
          <span :class="{selected: info.selected, disabled: info.disabled}" @click="clickSpecs(item, info)" v-else>{{info.name}}</span>
        </template>
      </dd>
    </dl>
  </div>
</template>
<script>
import powerSet from '@/vender/bwPowerSet'
// 得到一个路径字典对象
const getPathMap = (skus) => {
  // 得到所有的sku集合，props.goods.skus
  // 从sku中筛选出有效的sku
  // 根据有效的sku使用PowerSet算法得到子集
  // 根据子集，往路径字典对象中储存 key-value
  const pathMap = {}
  skus.forEach(sku => {
    // 找出有效sku sku.inventory表示库存， 小于零表示没有商品
    if (sku.inventory > 0) {
      // 计算当前有库存的子集
      // 由于sku是一个对象包含许多信息，我们将其处理为数组
      const valueArr = sku.specs.map(val => val.valueName)
      // console.log(valueArr)
      // 可选数组子集
      const valueArrPowerSet = powerSet(valueArr)
      // console.log(valueArrPowerSet)
      // 遍历子集，往pahtMap里面插入数据
      valueArrPowerSet.forEach(arr => {
        // 根据arr得到字符串的key, 因为数组不能当作key 我们需要处理为字符串，使用*连接
        const key = arr.join('*')
        if (pathMap[key]) {
          // 已经有key往数组追加
          pathMap[key].push(sku.id)
        } else {
          // 没有key设置一个数组
          pathMap[key] = [sku.id]
        }
      })
    }
  })
  return pathMap
}

// 更新按钮的禁用状态
const updateDisabledStatus = (specs, pathMap) => {
  specs.forEach((spec, i) => {
    // 得到当前选中规格集合
    const selectedArr = getSelectedArr(specs)
    // console.log(selectedArr)
    spec.values.forEach(val => {
      // 已经选中的按钮不用判断
      if (val.name === selectedArr[i]) return false
      // 未选中的替换对应的值
      selectedArr[i] = val.name
      // 过滤无效值得到key （剔除undefined） 用于路径字典比对
      const key = selectedArr.filter(v => v).join('*')
      // console.log(key)
      // 设置禁用状态
      val.disabled = !pathMap[key]
    })
  })
}
// 得到当前选中规格集合
const getSelectedArr = (specs) => {
  // 选中的规格
  const selectedArr = []
  // 遍历规格数组
  specs.forEach(spec => {
    // 选中的按钮对象
    const selectedVal = spec.values.find(val => val.selected)
    // 当它有值时就添加进数组，没有就添加undefined 和规格项数量保持一致
    selectedArr.push(selectedVal ? selectedVal.name : undefined)
  })
  return selectedArr
}

// 初始化选中状态
const initSelectedStatus = (goods, skuId) => {
  // 找出sku信息
  const sku = goods.skus.find(sku => sku.id === skuId)
  // 遍历每一个按钮，按钮的值和sku记录的值相同，那么就选中
  if (sku) {
    goods.specs.forEach((spec, i) => {
      const value = sku.specs[i].valueName
      spec.values.forEach(val => {
        val.selected = val.name === value
      })
    })
  }
}

export default {
  name: 'GoodsSku',
  props: {
    goods: {
      type: Object,
      default: () => {}
    },
    skuId: {
      type: String,
      default: ''
    }
  },
  setup (props, { emit }) {
    // 生成路径字典
    const pathMap = getPathMap(props.goods.skus)
    // 根据传入的skuId默认选中规格按钮
    props.skuId && (initSelectedStatus(props.goods, props.skuId))
    // 组件初始化的时候更新禁用状态
    updateDisabledStatus(props.goods.specs, pathMap)
    // 选中效果 (如果点击的是选中项就取消选中， 点击的不是选中项就取消所有，开启自己)
    const clickSpecs = (item, info) => {
      // 如果是禁用状态不作为 点击不执行
      if (info.disabled) return false
      if (info.selected) {
        info.selected = !info.selected
      } else {
        // 排它思想
        item.values.forEach(item => {
          item.selected = false
        })
        info.selected = !info.selected
      }
      // 点击完之后在去路径字典内查找比对 设置按钮的禁用状态
      updateDisabledStatus(props.goods.specs, pathMap)

      // 将选择完成的sku信息通知给父组件
      // 得到当前选中规格集合
      const selectedArr = getSelectedArr(props.goods.specs).filter(v => v)
      // 判断拿的到数组是不是完整的
      if (selectedArr.length === props.goods.specs.length) {
        // 通过路径字典找出skuid
        const skuIds = pathMap[selectedArr.join('*')]
        // 通过skuIds去goods.skus里面找出对应的sku对象信息
        const sku = props.goods.skus.find(sku => sku.id === skuIds[0])
        // console.log(sku)
        // 传递信息给父组件
        emit('change', {
          skuId: sku.id,
          price: sku.price,
          oldPrice: sku.oldPrice,
          inventory: sku.inventory,
          specsText: sku.specs.reduce((p, n) => `${p} ${n.name}：${n.valueName}`, '').trim()
        })
      } else {
        // 规格没有选择完整
        // 父组件需要判断规格是否选择完整，如果规格选择不完整不能加入购物车
        emit('change', false)
      }
    }

    return {
      clickSpecs
    }
  }
}
</script>
<style scoped lang="less">
.sku-state-mixin () {
  border: 1px solid #e4e4e4;
  margin-right: 10px;
  margin-bottom: 5px;
  cursor: pointer;
  &.selected {
    border-color: @xtxColor;
  }
  &.disabled {
    opacity: 0.6;
    border-style: dashed;
    cursor: not-allowed;
  }
}
.goods-sku {
  padding-left: 10px;
  padding-top: 20px;
  dl {
    display: flex;
    padding-bottom: 15px;
    align-items: center;
    dt {
      width: 50px;
      color: #999;
    }
    dd {
      flex: 1;
      color: #666;
      line-height: 40px;
      > img {
        width: 50px;
        height: 50px;
        .sku-state-mixin ();
      }
      > span {
        display: inline-block;
        height: 30px;
        line-height: 28px;
        padding: 0 20px;
        .sku-state-mixin ();
      }
    }
  }
}
</style>
