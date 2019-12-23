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
import ECharts from 'vue-echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/pie'
import 'echarts/lib/chart/radar'
import 'echarts/lib/chart/scatter'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/polar'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/title.js'
import theme from '@/assets/theme.json'
ECharts.registerTheme('ovilia-green', theme);
Vue.component('vChart', ECharts)
 Vue.use(Antd)
new Vue({
	router,
	store,
  render: h => h(App)
}).$mount('#app')
