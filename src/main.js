/* eslint disabed */

import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
// import MyLibUI from '../packages'
import MyLibUI from '../lib/my-libui.common'
import '../lib/css/mylib.css'

Vue.config.productionTip = false

Vue.use(ElementUI)
Vue.use(MyLibUI)
new Vue({
  render: h => h(App),
}).$mount('#app')
