<template>
  <!-- 顶部通栏 -->
  <AppTopnav />
  <!-- 头部模块 -->
  <AppHeader />
  <!-- 吸顶模块 -->
  <AppHeaderSticky />
  <!-- 内容区域 -->
  <div class="mian">
    <!-- 二级路由 -->
    <router-view />
  </div>
  <!-- 底部模块 -->
  <AppFooter />
</template>

<script>
import AppTopnav from '@/components/AppTopnav.vue'
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
import AppHeaderSticky from '@/components/AppHeaderSticky.vue'

export default {
  name: 'Layout',
  components: { AppTopnav, AppHeader, AppFooter, AppHeaderSticky }
}
</script>
