import Vue from 'vue'
import App from './App.vue'
import store from './store';
// import '@/assets/reset.css'//初始样式设置
import "@babel/polyfill" //用来兼容ie
// import '@/components' //按需加载的ant-design 样式
import filterbar from '@/components/filterbar'
import STable from '@/components/Table';
import router from './router';
import './permission'//权限路由处理
import '@/utils/hasPermission'
Vue.config.productionTip = false
Vue.component('filterbar',filterbar)
Vue.component('STable',STable)
import moment from 'moment'
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
window.moment = moment;
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.less'
 Vue.use(Antd)
new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
