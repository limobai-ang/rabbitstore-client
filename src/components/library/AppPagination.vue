<template>
  <div class="app-pagination">
    <a href="javascript:;" :class="{disabled: myCurrentPage <= 1}" @click="changePage('subtract')">上一页</a>
    <span v-if="currentList[0] > 1">...</span>
    <a href="javascript:;" :class="{active: myCurrentPage === item}" v-for="item in currentList" :key="item" @click="changePage('this', item)">{{item}}</a>
    <span v-if="currentList[currentList.length -1] < countPage">...</span>
    <a href="javascript:;" :class="{disabled: myCurrentPage >= countPage}" @click="changePage('add')">下一页</a>
  </div>
</template>
<script>
import { computed, ref, watch } from 'vue-demi'
export default {
  name: 'AppPagination',
  props: {
    total: {
      type: Number,
      default: 100
    },
    pageSize: {
      type: Number,
      default: 10
    },
    currentPage: {
      type: Number,
      default: 1
    },
    // 按钮个数
    btnCount: {
      type: Number,
      default: 5
    }
  },
  setup (props, { emit }) {
    // 总条数
    const myTotal = ref(100)
    // 每页条数
    const myPageSize = ref(10)
    // 当前第几页
    const myCurrentPage = ref(5)

    // 监听传人的值改变
    watch(props, () => {
      myTotal.value = props.total
      myPageSize.value = props.pageSize
      myCurrentPage.value = props.currentPage
    }, { immediate: true })

    // 计算总页数
    const countPage = computed(() => {
      return Math.ceil(myTotal.value / myPageSize.value)
    })
    // 根据页数生成数组
    const countList = computed(() => {
      return [...Array(countPage.value).keys()].map(item => item + 1)
    })
    // 计算当前需要显示的数据
    const currentList = computed(() => {
      // 判断是否小于显示按钮的个数
      if (countList.value.length < props.btnCount) {
        return countList.value
      } else {
        const arr = []
        let index = myCurrentPage.value - Math.ceil(props.btnCount / 2)
        for (let i = 0; i < props.btnCount; i++) {
          arr.push(countList.value[index])
          index = index + 1
        }
        // 判断开头是否有空值
        if (!arr[0]) {
          for (let j = 0; j < arr.length - 1; j++) {
            if (!arr[0]) {
              arr.push(arr[arr.length - 1] + 1)
              arr.shift()
            } else {
              break
            }
          }
        }
        // 判断结尾是否有空值
        if (!arr[arr.length - 1]) {
          for (let j = arr.length; j > 0; j--) {
            if (!arr[arr.length - 1]) {
              arr.unshift(arr[0] - 1)
              arr.pop()
            } else {
              break
            }
          }
        }
        return arr
      }
    })

    // 加减按钮
    const changePage = (type, page) => {
      if (type === 'this') {
        if (myCurrentPage.value === page) return
        myCurrentPage.value = page
      }
      if (type === 'subtract') {
        if (myCurrentPage.value <= 1) return
        myCurrentPage.value = myCurrentPage.value - 1
      }
      if (type === 'add') {
        if (myCurrentPage.value >= countPage.value) return
        myCurrentPage.value = myCurrentPage.value + 1
      }
      // 修改page后向父子组件传值
      emit('changeCurrentPage', myCurrentPage.value)
    }

    return {
      currentList,
      myCurrentPage,
      countPage,
      changePage
    }
  }
}
</script>
<style scoped lang="less">
.app-pagination {
  display: flex;
  justify-content: center;
  padding: 30px;
  > a {
    display: inline-block;
    padding: 5px 10px;
    border: 1px solid #e4e4e4;
    border-radius: 4px;
    margin-right: 10px;
    &:hover {
      color: @xtxColor;
    }
    &.active {
      background: @xtxColor;
      color: #fff;
      border-color: @xtxColor;
    }
    &.disabled {
      cursor: not-allowed;
      opacity: 0.4;
      &:hover {
        color: #333
      }
    }
  }
  > span {
    margin-right: 10px;
  }
}
</style>
