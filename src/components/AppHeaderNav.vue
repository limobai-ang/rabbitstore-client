<template>
  <ul class="app-header-nav navs">
    <li class="home"><router-link to="/">首页</router-link></li>
    <li
      v-for="item in listData"
      :key="item.id"
      @mouseenter="isShow(item.id, true)"
      @mouseleave="isShow(item.id, false)"
    >
      <router-link
        :to="`/category/${item.id}`"
        @click="isShow(item.id, false)"
        >{{ item.name }}</router-link
      >
      <div class="layer" :class="{ open: item.open }">
        <ul>
          <li v-for="goods in item.children" :key="goods.id">
            <router-link
              :to="`/category/sub/${goods.id}`"
              @click="isShow(item.id, false)"
            >
              <img :src="goods.picture" :alt="goods.name" />
              <p>{{ goods.name }}</p>
            </router-link>
          </li>
        </ul>
      </div>
    </li>
  </ul>
</template>

<script>
import { findAllCategory } from '@/api/category'
import { useStore } from 'vuex'
import { computed } from 'vue'
export default {
  name: 'AppHeaderNav',
  props: {
    SendRequest: {
      type: Boolean,
      default: true
    }
  },
  setup (props) {
    const store = useStore()
    // 获取导航数据
    const listData = computed(() => store.state.category.list)
    // 是否发送请求 吸顶部导航不重复发送请求获取数据
    if (props.SendRequest) {
      findAllCategory().then((res) => {
        res.result.forEach((item) => (item.open = false))
        store.commit('category/setList', res.result)
      })
    }
    // 二级导航显示/隐藏
    const isShow = (id, flag) => {
      if (!id) return
      store.commit('category/isShow', { id, flag })
    }
    return {
      listData,
      isShow
    }
  }
}
</script>

<style lang="less" scoped>
  .navs {
    position: relative;
    width: 820px;
    display: flex;
    justify-content: space-around;
    padding-left: 40px;
    > li {
      margin-right: 40px;
      width: 38px;
      text-align: center;
      > a {
        font-size: 16px;
        line-height: 32px;
        height: 32px;
        display: inline-block;
      }
      &:hover {
        > a {
          color: @xtxColor;
          border-bottom: 1px solid @xtxColor;
        }
        // > .layer {
        //   height: 132px;
        //   opacity: 1;
        // }
      }
    }
  }
  // 二级类目样式
  .layer {
    width: 1240px;
    background-color: #fff;
    position: absolute;
    z-index: 999;
    left: -200px;
    top: 56px;
    height: 0;
    overflow: hidden;
    opacity: 0;
    box-shadow: 0 0 5px #ccc;
    transition: all 0.2s 0.1s;
    &.open {
      height: 132px;
      opacity: 1;
    }
    ul {
      display: flex;
      flex-wrap: nowrap;
      padding: 0 70px;
      align-items: center;
      height: 132px;
      li {
        width: 110px;
        text-align: center;
        img {
          width: 60px;
          height: 60px;
        }
        p {
          padding-top: 10px;
        }
        &:hover {
          p {
            color: @xtxColor;
          }
        }
      }
    }
  }
</style>
