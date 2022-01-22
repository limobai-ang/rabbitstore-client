<template>
  <div class="app-city" ref="target">
    <div class="select" @click="open" :class="{ active }">
      <span class="placeholder">{{ changeResult.fullLocation || fullLocation }}</span>
      <span class="value"></span>
      <i class="iconfont icon-angle-down"></i>
    </div>
    <!-- 省市区选项区域  active控制显示或者隐藏-->
    <div class="option" v-if="active">
      <div v-if="loading" class="loading"></div>
      <template v-else>
        <span class="ellipsis" v-for="item in currList" :key="item.code" @click="changeItem(item)">{{item.name}}</span>
      </template>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed } from 'vue-demi'
import { onClickOutside } from '@vueuse/core'
import axios from 'axios'
export default {
  name: 'AppCity',
  props: {
    fullLocation: {
      type: String,
      default: '请选择配送地址'
    }
  },
  setup (props, { emit }) {
    // 控制展开收起,默认收起
    const active = ref(false)

    // 展开收起方法
    const openDialog = () => {
      active.value = true
    }
    const closeDialog = () => {
      active.value = false
    }
    // 切换展开收起
    const toggleDialog = () => {
      if (active.value) closeDialog()
      else openDialog()
    }
    // 点击其他位置隐藏
    const target = ref(null)
    onClickOutside(target, () => {
      closeDialog()
    })

    // 获取城市数据
    // 2. 何时获取？打开城市列表的时候，做个内存中缓存
    const getCityData = () => {
      // 这个位置可能有异常操作，封装成promise
      return new Promise((resolve, reject) => {
        if (window.cityData) {
          // 有缓存
          resolve(window.cityData)
        } else {
          // 无缓存
          const url = 'https://yjy-oss-files.oss-cn-zhangjiakou.aliyuncs.com/tuxian/area.json'
          axios.get(url).then((res) => {
            window.cityData = res.data
            resolve(window.cityData)
          })
        }
      })
    }

    // 获取城市数据,  获取数据时开启loading效果
    const loading = ref(false)
    const cityData = ref([])
    loading.value = true
    // 获取数据
    getCityData().then((data) => {
      cityData.value = data
      loading.value = false
    })

    // 点击开启选择地址方法
    const open = () => {
      active.value = true
      // 清空选择结果
      for (const key in changeResult) {
        changeResult[key] = ''
      }
    }

    // 地址信息
    const changeResult = reactive({
      provinceCode: '',
      provinceName: '',
      cityCode: '',
      cityName: '',
      countyCode: '',
      countyName: '',
      fullLocation: ''
    })
    // 收集获取地址信息
    const changeItem = (item) => {
      // 省份
      if (item.level === 0) {
        changeResult.provinceCode = item.code
        changeResult.provinceName = item.name
        changeResult.fullLocation = `${changeResult.provinceName} 请选择 请选择`
      }
      // 市
      if (item.level === 1) {
        changeResult.cityCode = item.code
        changeResult.cityName = item.name
        changeResult.fullLocation = `${changeResult.provinceName} ${changeResult.cityName} 请选择`
      }
      // 地区
      if (item.level === 2) {
        changeResult.countyCode = item.code
        changeResult.countyName = item.name
        changeResult.fullLocation = `${changeResult.provinceName} ${changeResult.cityName} ${changeResult.countyName}`
        // 将选择后的数据发送给父组件，让后关闭选择框
        emit('change', changeResult)
        closeDialog()
      }
    }
    // 定义计算属性 获取地址列表 ，根据点击的省份城市展示
    const currList = computed(() => {
      // 省份
      let currList = cityData.value
      // 城市
      if (changeResult.provinceCode) {
        currList = currList.find(p => p.code === changeResult.provinceCode).areaList
      }
      // 地区
      if (changeResult.cityCode) {
        currList = currList.find(c => c.code === changeResult.cityCode).areaList
      }
      return currList
    })
    return { active, toggleDialog, target, open, loading, changeResult, changeItem, currList }
  }
}
</script>

<style scoped lang="less">
  .app-city {
    display: inline-block;
    position: relative;
    z-index: 400;
    .select {
      border: 1px solid #e4e4e4;
      height: 30px;
      padding: 0 5px;
      line-height: 28px;
      cursor: pointer;
      &.active {
        background: #fff;
      }
      .placeholder {
        color: #999;
      }
      .value {
        color: #666;
        font-size: 12px;
      }
      i {
        font-size: 12px;
        margin-left: 5px;
      }
    }
    .option {
      width: 542px;
      border: 1px solid #e4e4e4;
      position: absolute;
      left: 0;
      top: 29px;
      background: #fff;
      min-height: 30px;
      line-height: 30px;
      display: flex;
      flex-wrap: wrap;
      padding: 10px;
      .loading {
        height: 290px;
        width: 100%;
        background: url(../../assets/images/load.gif) no-repeat center;
      }
      > span {
        width: 130px;
        text-align: center;
        cursor: pointer;
        border-radius: 4px;
        padding: 0 3px;
        &:hover {
          background: #f5f5f5;
        }
      }
    }
  }
</style>
