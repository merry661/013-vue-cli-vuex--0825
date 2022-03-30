import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 引入vant组件及样式
import Vant from 'vant'
import 'vant/lib/index.css'

// 加载执行--移动端REM适配工具
import 'amfe-flexible'

// 引入全局样式
import './styles/index.less'

// 加载 dayjs 初始化配置
import './utils/dayjs'

Vue.config.productionTip = false
Vue.use(Vant)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
