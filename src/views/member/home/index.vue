<template>
  <div class="member-home">
    <!-- 概览 -->
    <HomeOverview />
    <!-- 收藏 -->
    <HomePanel title="我的收藏"></HomePanel>
    <!-- 足迹 -->
    <HomePanel title="我的足迹"></HomePanel>
  </div>
</template>
<script>
import HomeOverview from './components/MemberHomeOverview'
import HomePanel from './components/MemberHomePanel'
export default {
  name: 'MemberHome',
  components: {
    HomeOverview,
    HomePanel
  }
}
</script>
<style scoped lang="less">
.member-home {

}
:deep(.xtx-carousel) .carousel-btn.prev {
  left: 5px;
}
:deep(.xtx-carousel) .carousel-btn.next {
  right: 5px;
}
</style>
