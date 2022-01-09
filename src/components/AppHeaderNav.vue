<template>
  <ul class="app-header-nav navs">
    <li class="home"><RouterLink to="/">首页</RouterLink></li>
    <li v-for="(item) in listData" :key="item.id">
      <a href="#">{{item.name}}</a>
      <div class="layer">
        <ul>
          <li v-for="goods in item.children" :key="goods.id">
            <a href="#">
              <img
                :src="goods.picture"
                :alt="goods.name"
              />
              <p>{{goods.name}}</p>
            </a>
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
  setup () {
    const store = useStore()
    const listData = computed(() => store.state.category.list)
    findAllCategory().then(res => {
      console.log(res)
      store.commit('category/setList', res.result)
    })
    return {
      listData
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
        > .layer {
        height: 132px;
        opacity: 1;
      }
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
