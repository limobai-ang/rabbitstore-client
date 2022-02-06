<template>
  <div class="app-numbox">
    <div class="label">{{label}}</div>
    <div class="numbox">
      <a href="javascript:;" @click="setCount('subtract')">-</a>
      <input type="text" readonly :value="modelValue">
      <a href="javascript:;" @click="setCount('add')">+</a>
    </div>
  </div>
</template>
<script>
export default {
  name: 'AppNumbox',
  props: {
    modelValue: {
      type: Number,
      default: 1
    },
    label: {
      type: String,
      default: '数量'
    },
    // 定义最大值和最小值
    min: {
      type: Number,
      default: 1
    },
    max: {
      type: Number,
      default: 10
    }
  },
  setup (props, { emit }) {
    // 设置数量
    const setCount = (flag) => {
      // 判断是加还是减, 是否大于或小于最大值或最小值
      if (flag === 'add') {
        if (props.modelValue + 1 > props.max) return
        emit('update:modelValue', props.modelValue + 1)
      } else {
        if (props.modelValue - 1 < props.min) return
        emit('update:modelValue', props.modelValue - 1)
      }
    }
    return {
      setCount
    }
  }
}
</script>
<style scoped lang="less">
.app-numbox {
  display: flex;
  align-items: center;
  .label {
    width: 60px;
    color: #999;
    padding-left: 10px;
  }
  .numbox {
    width: 120px;
    height: 30px;
    border: 1px solid #e4e4e4;
    display: flex;
    > a {
      width: 29px;
      line-height: 28px;
      text-align: center;
      background: #f8f8f8;
      font-size: 16px;
      color: #666;
      &:first-of-type {
        border-right:1px solid #e4e4e4;
      }
      &:last-of-type {
        border-left:1px solid #e4e4e4;
      }
    }
    > input {
      width: 60px;
      padding: 0 5px;
      text-align: center;
      color: #666;
    }
  }
}
</style>
