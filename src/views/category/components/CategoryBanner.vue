<template>
  <div class="category-banner">
    <AppCarousel :bannerList="bannerList" v-model:bannerOperation="bannerOperation" bannerOperationTime="3000" />
  </div>
</template>
<script>
import { getBanner } from '@/api/home'
import { ref } from 'vue'
export default {
  name: 'CategoryBanner',
  setup () {
    // 轮播图配置项 是否开启轮播暂停/播放
    const bannerOperation = ref(false)
    // 轮播图数据
    const bannerList = ref([])
    getBanner().then(res => {
      bannerList.value = res.result
      bannerOperation.value = true
    })
    return {
      bannerList,
      bannerOperation
    }
  }
}
</script>
<style scoped lang="less">
.category-banner {
  width: 1240px;
  height: 500px;
  position: relative;
  left: 0;
  top: 0;
  z-index: 98
}

</style>
