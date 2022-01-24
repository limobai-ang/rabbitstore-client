<template>
  <RouterLink :to="`/product/${goods.id}`">
    <div class="app-goods-item">
      <img v-lazyload="goods.picture" alt="" />
      <p class="name">{{ goods.name }}</p>
      <p class="desc">{{ goods.desc }}</p>
      <p class="price">&yen;{{ goods.price }}</p>
    </div>
  </RouterLink>
</template>

<script>
export default {
  name: 'AppGoodsItem',
  props: {
    goods: {
      type: Object,
      required: true
    },
    disabledExtra: {
      type: Boolean,
      default: true
    }
  }
}
</script>

<style scoped lang='less'>
  .app-goods-item {
    width: 100%;
    // height: 300px;
    background-color: #fff;
    padding: 20px 30px;
    margin-bottom: 10px;
    img {
      width: 100%;
      height: 100%;
    }
    p {
      font-size: 16px;
      text-align: center;
      padding-top: 10px;
        // 限制文字长度 超出...
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      // &.name {
      // }
      &.desc {
      font-size: 14px;
        color: #999;
      }
      &.price {
        font-size: 20px;
        color: @priceColor;
      }
    }
  }
</style>
