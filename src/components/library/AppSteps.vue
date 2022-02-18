<script>
import { getCurrentInstance } from 'vue'
export default {
  name: 'AppSteps',
  props: {
    active: {
      type: [String, Number],
      default: '1'
    }
  },
  render () {
    // 获取组件实例
    const ctx = getCurrentInstance()
    const items = ctx.slots.default()
    // 收集默认插槽的内容
    const dynamicItems = []
    items.forEach(element => {
      if (element.type.name === 'AppStepsItem') {
        dynamicItems.push(element)
      } else {
        element.children.forEach(item => {
          dynamicItems.push(item)
        })
      }
    })

    // 生成节点元素
    const itemsJsx = dynamicItems.map((item, index) => {
      return <div class="app-steps-item" class={{ active: ctx.props.active > index }}>
        <div class="step"><span>{ index }</span></div>
        <div class="title">{item.props.title}</div>
        <div class="desc">{item.props.desc}</div>
      </div>
    })
    return <div class="app-steps">
      {itemsJsx}
    </div>
  }
}
</script>
<style lang="less">
.app-steps {
  display: flex;
  text-align: center;
  &-item {
    flex: 1;
    &:first-child {
      .step {
        &::before {
          display: none;
        }
      }
    }
    &:last-child {
      .step {
        &::after {
          display: none;
        }
      }
    }
    &.active {
      .step {
        > span {
          border-color: @xtxColor;
          background: @xtxColor;
          color: #fff
        }
        &::before,&::after {
          background: @xtxColor;
        }
      }
      .title {
        color: @xtxColor;
      }
    }
    .step {
      position: relative;
      > span {
        width: 48px;
        height: 48px;
        font-size: 28px;
        border: 2px solid #e4e4e4;
        background: #fff;
        border-radius: 50%;
        line-height: 44px;
        color: #ccc;
        display: inline-block;
        position: relative;
        z-index: 1;
      }
      &::after,&::before{
        content: "";
        position: absolute;
        top: 23px;
        width: 50%;
        height: 2px;
        background: #e4e4e4;
      }
      &::before {
         left: 0;
      }
      &::after {
         right: 0;
       }
    }
    .title {
      color: #999;
      padding-top: 12px;
    }
    .desc {
      font-size: 12px;
      color: #999;
      padding-top: 6px;
    }
  }
}
</style>
