<template>
  <div class="container">
    <!-- 个人中心列表 -->
    <AppMemberAside />
    <!-- 列表显示区域 -->
    <article class="article">
      <RouterView />
    </article>
  </div>
</template>
<script>
import AppMemberAside from '@/components/AppMemberAside'
export default {
  name: 'MemberLayout',
  components: {
    AppMemberAside
  }
}
</script>
<style scoped lang="less">
.container {
  display: flex;
  padding-top: 20px;
  .article {
    width: 1000px;
  }
}
</style>
