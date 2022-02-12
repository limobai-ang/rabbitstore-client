import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 导入插件库
import UI from '@/components/library'
// 初始化样式
import 'normalize.css'
import '@/assets/style/common.less'
// 使用mockjs
import './mock'

createApp(App).use(store).use(router).use(UI).mount('#app')
