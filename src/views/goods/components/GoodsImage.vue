<template>
  <div class="goods-image" v-if="images.length">
    <!-- 背景图片是正常的两倍大小 -->
    <div class="large" :style="{backgroundImage:`url(${images[currIndex]})`, backgroundPosition: ` -${position.left *2}px -${position.top*2}px`}" v-show="!loupeShow"></div>
    <div class="middle" ref="target">
      <img :src="images[currIndex]" alt="">
      <!-- 阴影面积是正常的一半 阴影面积覆盖的区域就是显示的区域-->
      <div class="layer" v-show="!loupeShow" :style="{left: position.left + 'px', top: position.top + 'px'}"></div>
    </div>
    <ul class="small">
      <li v-for="(img,i) in images" :key="img" :class="{active:i===currIndex}">
        <img @mouseenter="currIndex=i" :src="img" alt="">
      </li>
    </ul>
  </div>
  <!-- 骨架效果 -->
  <div class="goods-image" v-else>
    <div class="middle">
      <AppSkeleton height="100%" width="100%" bg="#e4e4e4" animated />
    </div>
    <ul class="small">
      <li v-for="i in 5" :key="i">
        <AppSkeleton height="100%" width="100%" bg="#e4e4e4" animated />
      </li>
    </ul>
  </div>
</template>
<script>
import { useMouseInElement } from '@vueuse/core'
import { reactive, ref, watch } from 'vue'
export default {
  name: 'GoodsImage',
  props: {
    images: {
      type: Array,
      default: () => []
    }
  },
  setup () {
    // 当前显示的图片下标
    const currIndex = ref(0)
    // dom元素容器 和鼠标是否在容器内
    const target = ref(null)
    const loupeShow = ref(false)
    // 位置信息
    const position = reactive({
      top: 0,
      left: 0
    })
    // isOutside 鼠标是否在模板容器外 elementY 鼠标基于容器左上角Y轴偏移  elementX 鼠标基于容器左上角X轴偏移
    const { elementX, elementY, isOutside } = useMouseInElement(target)
    // 监听鼠标的移动的变化 计算位置信息
    watch([elementX, elementY, isOutside], (newVal) => {
      if (newVal[2]) (newVal[2] !== loupeShow.value && (loupeShow.value = newVal[2]))
      // 显示放大镜
      newVal[2] !== loupeShow.value && (loupeShow.value = newVal[2])
      // 计算位置
      const left = Math.ceil(newVal[0]) - 100
      const top = Math.ceil(newVal[1]) - 100
      position.left = (left < 0 ? 0 : left > 200 ? 200 : left)
      position.top = (top < 0 ? 0 : top > 200 ? 200 : top)
    })

    return {
      currIndex,
      position,
      target,
      loupeShow
    }
  }
}
</script>
<style scoped lang="less">
.goods-image {
  width: 480px;
  height: 400px;
  position: relative;
  display: flex;
  .large {
    position: absolute;
    top: 0;
    left: 412px;
    width: 400px;
    height: 400px;
    box-shadow: 0 0 10px rgba(0,0,0,0.1);
    background-repeat: no-repeat;
    background-size: 800px 800px;
    background-color: #f8f8f8;
    z-index: 999
  }
  .middle {
    width: 400px;
    height: 400px;
    background: #f5f5f5;
    position: relative;
    cursor: move;
    .layer {
      width: 200px;
      height: 200px;
      background: rgba(0,0,0,.2);
      position: absolute;
    }
  }
  .small {
    width: 80px;
    li {
      width: 68px;
      height: 68px;
      margin-left: 12px;
      margin-bottom: 15px;
      cursor: pointer;
      &:hover,&.active {
        border: 2px solid @xtxColor;
      }
    }
  }
}
</style>
