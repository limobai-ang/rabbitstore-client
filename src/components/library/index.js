// 扩展vue原有的功能：全局组件，自定义指令，挂载原型方法，注意：没有全局过滤器。
// 这就是插件
// vue2.0插件写法要素：导出一个对象，有install函数，默认传入了Vue构造函数，Vue基础之上扩展
// vue3.0插件写法要素：导出一个对象，有install函数，默认传入了app应用实例，app基础之上扩展

// import AppSkeleton from './AppSkeleton.vue'
// import AppCarousel from './AppCarousel.vue'
// import AppMore from './AppMore.vue'
// import AppBread from './AppBread.vue'
// import AppBreadItem from './AppBreadItem.vue'

//  参数：1. 目录  2. 是否加载子目录  3. 加载的正则匹配
// 图片加载失败显示的图片
import imgError from '@/assets/images/imgError.png'

const importFn = require.context('./', false, /\.vue$/)

export default {
  install (app) {
    // 在app上进行扩展，app提供 component directive 函数
    // 如果要挂载原型 app.config.globalProperties 方式
    // app.component(AppSkeleton.name, AppSkeleton)
    // app.component(AppCarousel.name, AppCarousel)
    // app.component(AppMore.name, AppMore)
    // app.component(AppBread.name, AppBread)
    // app.component(AppBreadItem.name, AppBreadItem)

    // 批量注册全局组件
    importFn.keys().forEach(key => {
      // 导入组件
      const component = importFn(key).default
      // 注册组件
      app.component(component.name, component)
    })
    // 自定义指令
    defineDirective(app)
  }
}

const defineDirective = (app) => {
  // 图片懒加载指令
  app.directive('lazyload', {
    // vue2 监听使用指令的DOM是否创建好，钩子函数：inserted
    // vue3 的指令拥有的钩子函数和组件的一样，使用指令的DOM是否创建好，钩子函数：mounted
    mounted (el, binding) {
      // 创建一个观察对象，来观察当前使用指令的元素是否进入可视区
      const observe = new IntersectionObserver(([{ isIntersecting }]) => {
        // 两个回调参数 entries被观察的元素信息对象的数组 [{元素信息},{}]，信息中isIntersecting判断进入或离开 , observer就是观察实例
        if (isIntersecting) {
          // 通过isIntersecting来判断是否进入可视区, 进入可视区之后停止观察
          observe.unobserve(el)
          // 处理图片加载失败的情况, 如果图片加载失败就显示默认图片
          el.onerror = () => {
            el.src = imgError
          }
          // 把指令的值设置给el元素的src属性 binding.value就是指令传递的值
          el.src = binding.value
        }
      }, {
        threshold: 0
      })
      observe.observe(el)
    }
  })
}
