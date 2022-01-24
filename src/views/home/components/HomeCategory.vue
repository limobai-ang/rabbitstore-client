<template>
  <div class="home-category" @mouseleave="ActiveId = null">
    <!-- 导航菜单s -->
    <ul class="menu">
      <li
        :class="{active: ActiveId === item.id}"
        v-for="item in menuList"
        :key="item.id"
        @mouseenter="setCurrentId(item.id)"
      >
        <RouterLink :to="`/category/${item.id}`">{{ item.name }}</RouterLink>
        <span v-if="!item.children.length">
          <AppSkeleton width="60px" height="18px" style="margin-right:5px" bg="rgba(255,255,255,0.2)" animated/>
          <AppSkeleton width="50px" height="18px" bg="rgba(255,255,255,0.2)" animated/>
        </span>
        <RouterLink
        v-else
          :to="`/category/sub/${child.id}`"
          v-for="child in item.children"
          :key="child.id"
          >{{ child.name }}</RouterLink
        >
      </li>
    </ul>
    <!-- 弹层 -->
    <div class="layer">
      <h4>
        {{ goodsList.id !== "brand" ? "分类推荐" : "品牌推荐" }}
        <small>根据您的购买或浏览记录推荐</small>
      </h4>
      <!-- 判断当前是否是品牌 -->
      <ul v-if="goodsList.id !== 'brand'">
        <li v-for="item in goodsList.goods" :key="item.id">
          <RouterLink :to="`/product/${item.id}`">
            <img :src="item.picture" alt="item.name" />
            <div class="info">
              <p class="name ellipsis-2">{{ item.name }}</p>
              <p class="desc ellipsis">{{ item.desc }}</p>
              <p class="price"><i>¥</i>{{ item.price }}</p>
            </div>
          </RouterLink>
        </li>
      </ul>
      <ul v-else>
        <li class="brand" v-for="item in goodsList.brands" :key="item.id">
          <RouterLink to="/">
            <img :src="item.picture" alt="" />
            <div class="info">
              <p class="place">
                <i class="iconfont icon-dingwei"></i>{{ item.place }}
              </p>
              <p class="name ellipsis">{{ item.name }}</p>
              <p class="desc ellipsis-2">{{ item.desc }}</p>
            </div>
          </RouterLink>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { useStore } from 'vuex'
import { computed, reactive, ref } from 'vue'
import { findBrand } from '@/api/home'
export default {
  name: 'HomeCategory',
  setup () {
    const store = useStore()
    // 定义品牌数据
    const brand = reactive({
      id: 'brand',
      name: '品牌',
      children: [{ id: 'brand-chilren', name: '品牌推荐' }],
      brands: []
    })
    // 处理侧边导航数据
    const menuList = computed(() => {
      const list = store.state.category.list.map((item) => {
        return {
          id: item.id,
          name: item.name,
          // 防止初始化没有children的时候调用slice函数报错
          children: item.children && item.children.slice(0, 2),
          goods: item.goods
        }
      })
      // 加入品牌数据项
      list.push(brand)
      return list
    })

    // 获取弹出层数据
    const ActiveId = ref(null)
    const setCurrentId = (id) => {
      if (!id) return
      ActiveId.value = id
    }
    const goodsList = computed(() => {
      if (!ActiveId.value) return []
      const res = menuList.value.find((item) => item.id === ActiveId.value)
      return res
    })

    // 处理品牌数据
    findBrand(6).then((res) => {
      brand.brands = res.result
    })
    return {
      menuList,
      goodsList,
      setCurrentId,
      ActiveId
    }
  }
}
</script>

<style scoped lang='less'>
  .home-category {
    width: 250px;
    height: 500px;
    background: rgba(0, 0, 0, 0.8);
    position: relative;
    z-index: 99;
    .menu {
      li {
        padding-left: 40px;
        height: 50px;
        line-height: 50px;
        &:hover,
        &.active {
          background: @xtxColor;
        }
        a {
          margin-right: 4px;
          color: #fff;
          &:first-child {
            font-size: 16px;
          }
        }
      }
    }
    // 弹出层样式
    .layer {
      width: 990px;
      height: 500px;
      background: rgba(255, 255, 255, 0.8);
      position: absolute;
      left: 250px;
      top: 0;
      display: none;
      padding: 0 15px;
      h4 {
        font-size: 20px;
        font-weight: normal;
        line-height: 80px;
        small {
          font-size: 16px;
          color: #666;
        }
      }
      ul {
        display: flex;
        flex-wrap: wrap;
        li {
          width: 310px;
          height: 120px;
          margin-right: 15px;
          margin-bottom: 15px;
          border: 1px solid #eee;
          border-radius: 4px;
          background: #fff;
          &:nth-child(3n) {
            margin-right: 0;
          }
          a {
            display: flex;
            width: 100%;
            height: 100%;
            align-items: center;
            padding: 10px;
            &:hover {
              background: #e3f9f4;
            }
            img {
              width: 95px;
              height: 95px;
            }
            .info {
              padding-left: 10px;
              line-height: 24px;
              width: 190px;
              .name {
                font-size: 16px;
                color: #666;
              }
              .desc {
                color: #999;
              }
              .price {
                font-size: 22px;
                color: @priceColor;
                i {
                  font-size: 16px;
                }
              }
            }
          }
        }
        // 品牌结构样式
        li.brand {
          height: 180px;
          a {
            align-items: flex-start;
            img {
              width: 120px;
              height: 160px;
            }
            .info {
              p {
                margin-top: 8px;
              }
              .place {
                color: #999;
              }
            }
          }
        }
      }
    }
    &:hover {
      .layer {
        display: block;
      }
    }
  }
</style>
