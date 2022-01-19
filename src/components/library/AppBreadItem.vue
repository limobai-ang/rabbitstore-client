<template>
  <div class="app-bread-item">
    <RouterLink v-if="to" :to="to"><slot /></RouterLink>
    <span v-else><slot /></span>
  </div>
</template>
<script>
export default {
  name: 'AppBreadItem',
  props: {
    to: {
      type: [String, Object],
      default: ''
    }
  }
}
</script>
