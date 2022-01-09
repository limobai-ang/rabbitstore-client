<template>
  <!-- 顶部通栏 -->
  <AppTopnav />
  <!-- 头部模块 -->
  <header>头部模块</header>
  <!-- 内容区域 -->
  <div class="mian">
    <!-- 二级路由 -->
    <router-view/>
  </div>
  <!-- 底部模块 -->
  <footer>底部模块</footer>
</template>

<script>
import AppTopnav from '@/components/AppTopnav.vue'

export default {
  name: 'Layout',
  components: { AppTopnav }
}
</script>
