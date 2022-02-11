import axios from 'axios'
import store from '@/store'
import router from '@/router'

// 导出基本地址 （在其他模块下可能会使用）
// export const baseURL = 'http://pcapi-xiaotuxian-front-devtest.itheima.net/'
export const baseURL = 'https://apipc-xiaotuxian-front.itheima.net/'
const instance = axios.create({
  // axios的一些配置
  baseURL,
  timeout: 5000
})

// 配置请求拦截器
instance.interceptors.request.use(config => {
  // 如果本地有token 就在亲求头中携带token
  const { profile } = store.state.user
  if (profile.token) {
    config.headers.Authorization = `Bearer ${profile.token}`
  }
  return config
}, err => {
  return Promise.reject(err)
})

// 配置响应拦截
instance.interceptors.response.use(res => res.data, err => {
  // 统一处理错误
  if (err.response && err.response.status === 401) {
    // 清空无效的登录信息 跳转到登录页 并把当前地址作为参数传递，登录成功之后按照地址跳回原页面
    store.commit('user/setUser', {})
    // router.currentRoute 就是我们组件内使用的$route 但是在vue3中router.currentRoute是一个ref响应式对象，所以我们要.value获取
    // encodeURIComponent() js原生函数 函数可把字符串作为 URI 组件进行编码。
    const fullPath = encodeURIComponent(router.currentRoute.value.fullPath)
    router.push('/login?redirectUrl=' + fullPath)
  }
  return Promise.reject(err)
})

// 请求工具函数
export default (url, method, submitData) => {
  // 如果是get请求使用params传递数据, 不是就使用data传递数据
  // toLowerCase() 将字符串转为小写在判断
  return instance({
    url,
    method,
    [method.toLowerCase() === 'get' ? 'params' : 'data']: submitData
  })
}
