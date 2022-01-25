<template>
  <div class="goods-comment">
    <div class="head">
      <div class="data">
        <p>
          <span>{{ commentInfo.salesCount }}</span>
          <span>人购买</span>
        </p>
        <p>
          <span>{{ commentInfo.praisePercent }}</span>
          <span>好评率</span>
        </p>
      </div>
      <div class="tags">
        <div class="dt">大家都在说：</div>
        <div class="dd">
          <a
            href="javascript:;"
            :class="{ active: currentTags === index }"
            @click="changeTag(index)"
            v-for="(item, index) in commentInfo.tags"
            :key="index"
            >{{ item.title }}（{{ item.tagCount }}）</a
          >
        </div>
      </div>
    </div>
    <div class="sort">
      <span>排序：</span>
      <a
        href="javascript:;"
        v-for="item in sortList"
        :key="item.name"
        :class="{ active: reqParams.sortField === item.sortField }"
        @click="changeSort(item.sortField)"
        >{{ item.name }}</a
      >
    </div>
    <!-- 列表 -->
    <div class="list">
      <div class="item" v-for="item in commentList.items" :key="item.id">
        <div class="user">
          <img
            :src="item.member.avatar"
            alt=""
          />
          <span>{{item.member.nickname}}</span>
        </div>
        <div class="body">
          <div class="score">
            <i class="iconfont" :class="item.score > index ? 'icon-wjx01' : 'icon-wjx02'" v-for="(icon, index) in 5" :key="index"></i>
            <span class="attr">
              <span v-for="spec in item.orderInfo.specs" :key="spec.name">{{spec.name}}: {{spec.nameValue}} </span>
            </span>
          </div>
          <div class="text">
            {{item.content}}
            <!-- 评论的图片 -->
            <GoodsCommentImage v-if="item.pictures.length" :pictures="item.pictures"/>
          </div>
          <div class="time">
            <span>{{item.createTime}}</span>
            <span class="zan"><i class="iconfont icon-dianzan"></i>{{item.praiseCount}}</span>
          </div>
        </div>
      </div>
    </div>
    <!-- 分页组件 -->
    <AppPagination />
  </div>
</template>
<script>
import { getCommentInfoByGoods, getCommentInfoByList } from '@/api/goods'
import GoodsCommentImage from './GoodsCommentImage.vue'
import { inject, reactive, ref, watch } from 'vue-demi'
export default {
  name: 'GoodsComment',
  components: {
    GoodsCommentImage
  },
  setup () {
    // 注入商品数据 (用于获取商品评论信息)
    const goods = inject('goods')
    // 商品评论信息
    const commentInfo = ref({})
    // 商品评论列表
    const commentList = ref({})

    // 获取商品信息
    getCommentInfoByGoods(goods.value.id).then((res) => {
      // type 的目的是将来点击可以区分点的是不是标签
      res.result.tags.unshift({
        type: 'img',
        title: '有图',
        tagCount: res.result.hasPictureCount
      })
      res.result.tags.unshift({
        type: 'all',
        title: '全部评价',
        tagCount: res.result.evaluateCount
      })
      commentInfo.value = res.result
    })

    // 定义排序数组
    const sortList = [
      { name: '默认', sortField: null },
      { name: '最新', sortField: 'praiseCount' },
      { name: '最热', sortField: 'createTime' }
    ]
    // 筛选条件准备
    const reqParams = reactive({
      page: 1,
      pageSize: 10,
      hasPicture: null,
      tag: null,
      sortField: null
    })

    // 筛选条件的改变 获取数据
    watch(reqParams, (newVal) => {
      getCommentInfoByList(goods.value.id, newVal).then(res => {
        console.log(res)
        commentList.value = res.result
      })
    }, { immediate: true })

    // 默认选中项
    const currentTags = ref(0)
    // 切换选中项
    const changeTag = index => {
      currentTags.value = index
      const currTag = commentInfo.value.tags[index]
      if (currTag.type === 'all') {
        reqParams.tag = null
        reqParams.hasPicture = false
      } else if (currTag.type === 'img') {
        reqParams.tag = null
        reqParams.hasPicture = true
      } else {
        reqParams.hasPicture = false
        reqParams.tag = currTag.title
      }
      // 切换tag 从第一页开始获取
      reqParams.page = 1
    }

    // 切换排序
    const changeSort = data => {
      reqParams.sortField = data
      // 切换之后初始化分页, 从第一页开始获取
      reqParams.page = 1
    }

    return {
      commentInfo,
      currentTags,
      reqParams,
      sortList,
      changeSort,
      changeTag,
      commentList
    }
  }
}
</script>
<style scoped lang="less">
  .goods-comment {
    .head {
      display: flex;
      padding: 30px 0;
      .data {
        width: 340px;
        display: flex;
        padding: 20px;
        p {
          flex: 1;
          text-align: center;
          span {
            display: block;
            &:first-child {
              font-size: 32px;
              color: @priceColor;
            }
            &:last-child {
              color: #999;
            }
          }
        }
      }
      .tags {
        flex: 1;
        display: flex;
        border-left: 1px solid #f5f5f5;
        .dt {
          font-weight: bold;
          width: 100px;
          text-align: right;
          line-height: 42px;
        }
        .dd {
          flex: 1;
          display: flex;
          flex-wrap: wrap;
          > a {
            width: 132px;
            height: 42px;
            margin-left: 20px;
            margin-bottom: 20px;
            border-radius: 4px;
            border: 1px solid #e4e4e4;
            background: #f5f5f5;
            color: #999;
            text-align: center;
            line-height: 40px;
            &:hover {
              border-color: @xtxColor;
              background: lighten(@xtxColor, 50%);
              color: @xtxColor;
            }
            &.active {
              border-color: @xtxColor;
              background: @xtxColor;
              color: #fff;
            }
          }
        }
      }
    }
    .sort {
      height: 60px;
      line-height: 60px;
      border-top: 1px solid #f5f5f5;
      border-bottom: 1px solid #f5f5f5;
      margin: 0 20px;
      color: #666;
      > span {
        margin-left: 20px;
      }
      > a {
        margin-left: 30px;
        &.active,
        &:hover {
          color: @xtxColor;
        }
      }
    }
    .list {
      padding: 0 20px;
      .item {
        display: flex;
        padding: 25px 10px;
        border-bottom: 1px solid #f5f5f5;
        .user {
          width: 160px;
          img {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            overflow: hidden;
          }
          span {
            padding-left: 10px;
            color: #666;
          }
        }
        .body {
          flex: 1;
          .score {
            line-height: 40px;
            .iconfont {
              color: #ff9240;
              padding-right: 3px;
            }
            .attr {
              padding-left: 10px;
              color: #666;
              & span {
                padding-left: 10px;
              }
            }
          }
        }
        .text {
          color: #666;
          line-height: 24px;
        }
        .time {
          color: #999;
          display: flex;
          justify-content: space-between;
          margin-top: 5px;
        }
      }
    }
  }
</style>
