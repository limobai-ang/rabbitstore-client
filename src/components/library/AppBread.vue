<script>
// vue2.0 的h函数传参进来的，vue3.0 的h函数导入进来
// render: h => {
//   // 返回值就是组件内容
//   return h()
// }
import { h } from 'vue'
export default {
  name: 'AppBread',
  render () {
    // 返回值就是组件内容
    // h 第一个参数 标签名字  第二个参数 标签属性对象  第三个参数 子节点
    // 获取默认插槽的内容
    const soltList = this.$slots.default()
    // 动态创建节点 最后一个item不加i标签
    const dymanicItems = []
    soltList.forEach((item, i) => {
      if (i === soltList.length - 1) return dymanicItems.push(item)
      // 在每个item元素 后面加一个i标签（箭头） 最后一个不加
      dymanicItems.push(item, h('i', { class: 'iconfont icon-angle-right' }))
    })
    return h('div', { class: 'app-bread' }, dymanicItems)
  }
}
</script>
<!-- 去掉scoped全局作用 -->
<style lang='less'>
// 去除 scoped 属性，目的：然样式作用到xtx-bread-item组件
.app-bread{
  display: flex;
  padding: 25px 10px;
  // ul li:last-child {}
  // 先找到父元素，找到所有的子元素，找到最后一个，判断是不是LI，是就是选中，不是就是无效选择器
  // ul li:last-of-type {}
  // 先找到父元素，找到所有的类型为li的元素，选中最后一个
  &-item {
    a {
      color: #666;
      transition: all .4s;
      &:hover {
        color: @xtxColor;
      }
    }
  }
  i {
    font-size: 12px;
    margin-left: 5px;
    margin-right: 5px;
    line-height: 22px;
    // 样式的方式，不合理
    // &:last-child {
    //   display: none;
    // }
  }
}
</style>
