import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 初始化样式
import 'normalize.css'
import '@/assets/style/common.less'

createApp(App).use(store).use(router).mount('#app')
