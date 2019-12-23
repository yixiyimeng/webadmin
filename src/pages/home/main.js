import '@babel/polyfill';
import Vue from 'vue'
import App from './App.vue'
import router from './router';
import store from './store';
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
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.less'
 Vue.use(Antd)
//import '@/pages/index/components' //按需加载的ant-design 样式
// import {
// 	VueAxios
// } from "@/utils/request"
 Vue.use(router)
Vue.config.productionTip = false
new Vue({
	router,
	store,
	render: h => h(App)
}).$mount('#app')
