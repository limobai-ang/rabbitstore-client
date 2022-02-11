import store from '@/store'
import { createRouter, createWebHashHistory } from 'vue-router'
const Home = () => import('@/views/home')
const Layout = () => import('@/views/Layout')
const category = () => import('@/views/category')
const sub = () => import('@/views/category/Sub')
const goods = () => import('@/views/goods')
const login = () => import('@/views/login')
const loginCallback = () => import('@/views/login/callback')
const cart = () => import('@/views/cart')
const checkout = () => import('@/views/member/pay/Checkout')
const pay = () => import('@/views/member/pay')
const PayResult = () => import('@/views/member/pay/PayResult')
const MemberLayout = () => import('@/views/member/Layout')
const MemberHome = () => import('@/views/member/home')

const routes = [
  {
    path: '/',
    component: Layout,
    children: [
      { path: '/', component: Home },
      { path: '/category/:id', component: category },
      { path: '/category/sub/:id', component: sub },
      { path: '/product/:id', component: goods },
      { path: '/cart', component: cart },
      { path: '/member/checkout', component: checkout },
      { path: '/member/pay', component: pay },
      { path: '/pay/callback', component: PayResult },
      // 查看订单详情
      { path: '/member/order' },
      {
        path: '/member',
        component: MemberLayout,
        children: [
          { path: '/member', component: MemberHome }
        ]
      }

    ]
  },
  {
    name: 'login',
    path: '/login',
    component: login
  },
  {
    path: '/login/callback',
    component: loginCallback
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior () {
    return { left: 0, top: 0 }
  }
})

// 前置导航守卫
router.beforeEach((to, from, next) => {
  // 用户信息
  const { token } = store.state.user.profile
  // 跳转去member开头的地址却没有登录
  if (to.path.startsWith('/member') && !token) {
    next({ path: '/login', query: { redirectUrl: to.fullPath } })
  }
  next()
})
export default router
