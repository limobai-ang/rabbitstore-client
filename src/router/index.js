import { createRouter, createWebHashHistory } from 'vue-router'
const Home = () => import('@/views/home')
const Layout = () => import('@/views/Layout')
const category = () => import('@/views/category/Category')
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
  routes
})

export default router
