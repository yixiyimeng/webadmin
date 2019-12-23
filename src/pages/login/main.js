import Vue from 'vue'
import App from './App.vue'
// import '@/assets/reset.css'//初始样式设置
import "@babel/polyfill" //用来兼容ie
// import '@/components' //按需加载的ant-design 样式
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.less'
 Vue.use(Antd)
Vue.config.productionTip = false
import {postAction} from '@/api';
Vue.prototype.$postAction=postAction;
new Vue({
  render: h => h(App)
}).$mount('#app')
