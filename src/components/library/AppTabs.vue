<script>
import { useVModel } from '@vueuse/core'
import { provide } from 'vue'
export default {
  // Tabs大容器  渲染导航栏和内容结构
  name: 'AppTabs',
  props: {
    modelValue: {
      type: String,
      default: ''
    }
  },
  setup (props, { emit }) {
    const activeName = useVModel(props, 'modelValue', emit)
    // 给app-tabs-panel传值
    provide('activeName', activeName)

    // 点击选项卡触发事件
    const tabClick = (name, index) => {
      // 修改activeName （当前需要显示的tabs）
      activeName.value = name
      // 向外触发一个点击自定事件 提供当前点击的组件名字和索引
      emit('tab-click', { name, index })
    }
    return { activeName, tabClick }
  },
  render () {
    // 拿到插槽里面的内容
    const items = this.$slots.default()

    // 动态渲染内容储存在元素的children节点下面
    // 由于插槽内可能有静态内容和动态内容，我们需要将静态内容和动态内容提取到一个数组中
    const panels = []
    items.forEach(item => {
      if (item.type.name === 'AppTabsPanel') {
        panels.push(item)
      } else {
        // v-for渲染出来的
        item.children.forEach(item => {
          panels.push(item)
        })
      }
    })

    // nav顶部标签列表
    const nav = <nav>
      {panels.map((item, index) => <a onClick={ () => this.tabClick(item.props.name, index)} class={{ active: this.modelValue === item.props.name }} href="javascript:;">{item.props.label}</a>)}
    </nav>
    return <div class="app-tabs">{[nav, panels]}</div>
  }
}
</script>

<style lang="less">
.app-tabs {
  background: #fff;
  > nav {
    height: 60px;
    line-height: 60px;
    display: flex;
    border-bottom: 1px solid #f5f5f5;
    > a {
      width: 110px;
      border-right: 1px solid #f5f5f5;
      text-align: center;
      font-size: 16px;
      &.active {
        border-top: 2px solid @xtxColor;
        height: 60px;
        background: #fff;
        line-height: 56px;
      }
    }
  }
}
</style>
