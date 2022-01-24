<template>
  <div class='app-carousel' @mouseout="$emit('update:bannerOperation', true)" @mousemove="$emit('update:bannerOperation', false)">
    <ul class="carousel-body">
      <li class="carousel-item" v-for="(item, index) in bannerList" :key="index" :class="{fade:  currentIndex == index}">
        <RouterLink to="/" v-if="item.imgUrl">
          <img :src="item.imgUrl" alt="">
        </RouterLink>
        <div v-else class="slider">
          <RouterLink v-for="goods in item" :key="goods.id" :to="`/product/${goods.id}`">
            <img :src="goods.picture" alt="">
            <p class="name ellipsis">{{goods.name}}</p>
            <p class="price">&yen;{{goods.price}}</p>
          </RouterLink>
        </div>
      </li>
    </ul>
    <a href="javascript:;" class="carousel-btn prev" @click="setCurrentIndex('left')"><i class="iconfont icon-angle-left"></i></a>
    <a href="javascript:;" class="carousel-btn next" @click="setCurrentIndex('right')"><i class="iconfont icon-angle-right"></i></a>
    <div class="carousel-indicator">
      <span v-for="(item, index) in bannerList" :key="item.id" :class="{active: currentIndex == index}" @click="currentIndex = index"></span>
    </div>
  </div>
</template>

<script>
import { computed, ref, watch, onUnmounted } from 'vue-demi'
export default {
  name: 'AppCarousel',
  props: {
    // 轮播图数据
    bannerList: {
      type: Array,
      required: true
    },
    // 轮播图滚动间隔时间
    bannerOperationTime: {
      type: String,
      default: '3000'
    },
    // 是否开启轮播图滚动
    bannerOperation: {
      type: Boolean,
      default: false
    },
    // 开启鼠标进入暂停/离开播放 (开启轮播滚动后生效)
    mouseEntrancePlay: {
      type: Boolean,
      default: true
    }
  },
  setup (props) {
    // 定义初始下标
    const currentIndex = ref(0)
    const currentBanner = computed(() => {
      return props.bannerList[currentIndex.value]
    })
    // 轮播图切换
    const setCurrentIndex = (type) => {
      if (type === 'right') {
        // 判断是否为最后一张
        if (currentIndex.value >= props.bannerList.length - 1) {
          currentIndex.value = 0
          return
        }
        currentIndex.value++
      } else {
        // 判断是否为第一张
        if (currentIndex.value <= 0) {
          currentIndex.value = props.bannerList.length - 1
          return
        }
        currentIndex.value--
      }
    }
    // 定时器轮播滚动功能
    const operation = (() => {
      // 利用闭包保存itemId 将逻辑封装在返回函数里面
      const itemId = ref(null)
      return flag => {
        if (flag) {
          itemId.value = setInterval(() => {
            setCurrentIndex('right')
          }, props.bannerOperationTime)
        } else {
          itemId.value && clearInterval(itemId.value)
        }
      }
    })()
    // 监听props.bannerOperation控制轮播图是否播放
    watch(() => props.bannerOperation, (newValue) => {
      operation(newValue)
    })
    // 组件销毁,清理定时器
    onUnmounted(() => {
      operation(false)
    })
    return {
      currentIndex,
      currentBanner,
      setCurrentIndex,
      operation
    }
  }
}
</script>
<style scoped lang="less">
.app-carousel{
  width: 100%;
  height: 100%;
  min-width: 300px;
  min-height: 150px;
  position: relative;
  .carousel{
    &-body {
      width: 100%;
      height: 100%;
    }
    &-item {
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      opacity: 0;
      transition: opacity 0.5s linear;
      &.fade {
        opacity: 1;
        z-index: 1;
      }
      img {
        width: 100%;
        height: 100%;
      }
    }
    &-indicator {
      position: absolute;
      left: 0;
      bottom: 20px;
      z-index: 2;
      width: 100%;
      text-align: center;
      span {
        display: inline-block;
        width: 12px;
        height: 12px;
        background: rgba(0,0,0,0.2);
        border-radius: 50%;
        cursor: pointer;
        ~ span {
          margin-left: 12px;
        }
        &.active {
          background:  #fff;
        }
      }
    }
    &-btn {
      width: 44px;
      height: 44px;
      background: rgba(0,0,0,.2);
      color: #fff;
      border-radius: 50%;
      position: absolute;
      top: 228px;
      z-index: 2;
      text-align: center;
      line-height: 44px;
      opacity: 0;
      transition: all 0.5s;
      &.prev{
        left: 20px;
      }
      &.next{
        right: 20px;
      }
    }
  }
  &:hover {
    .carousel-btn {
      opacity: 1;
    }
  }
}
// 轮播商品
.slider {
  display: flex;
  justify-content: space-around;
  padding: 0 40px;
  > a {
    width: 240px;
    text-align: center;
    img {
      padding: 20px;
      width: 230px!important;
      height: 230px!important;
    }
    .name {
      font-size: 16px;
      color: #666;
      padding: 0 40px;
    }
    .price {
      font-size: 16px;
      color: @priceColor;
      margin-top: 15px;
    }
  }
}
</style>
