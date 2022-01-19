import { createRouter, createWebHashHistory } from 'vue-router'
const Home = () => import('@/views/home')
const Layout = () => import('@/views/Layout')
const category = () => import('@/views/category')
const sub = () => import('@/views/category/Sub')

const routes = [
  {
    path: '/',
    component: Layout,
    children: [
      { path: '/', component: Home },
      { path: '/category/:id', component: category },
      { path: '/category/sub/:id', component: sub }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior () {
    return { left: 0, top: 0 }
  }
})

export default router
