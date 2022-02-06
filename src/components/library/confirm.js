import { createVNode, render } from 'vue'
import AppConfirm from './AppConfirm'

// 准备div
const div = document.createElement('div')
div.setAttribute('class', 'app-confirm-container')
document.body.appendChild(div)

// 该函数渲染Confirm组件，标题和文本
// 函数的返回值是promise对象
export default ({ title, text }) => {
  return new Promise((resolve, reject) => {
    // 将改变promise状态的函数通过props传递给组件，组件中调用其中的方法就会改变promise的状态，紧接着就会then或catch
    const submitCallback = () => {
      render(null, div)
      resolve()
    }
    const cancelCallback = () => {
      render(null, div)
      reject(new Error('点击取消'))
    }
    // 1. 渲染组件
    // 2. 点击确认按钮，触发resolve同时销毁组件
    // 3. 点击取消按钮，触发reject同时销毁组件
    const vnode = createVNode(AppConfirm, { title, text, submitCallback, cancelCallback })
    render(vnode, div)
  })
}
