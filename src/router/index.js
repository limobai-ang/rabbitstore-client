import { createRouter, createWebHashHistory } from 'vue-router'
const Home = () => import('@/views/home')
const Layout = () => import('@/views/Layout')

const routes = [
  {
    path: '/',
    component: Layout,
    children: [
      { path: '/', component: Home }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
