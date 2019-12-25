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
/* UI框架 */
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.less'
Vue.use(Antd)
/* 筛选条件和 table */
import filterbar from '@/components/filterbar'
import STable from '@/components/Table';
Vue.component('filterbar',filterbar)
Vue.component('STable',STable)
/* 全局封装的post请求 */
import {postAction} from '@/api';
Vue.prototype.$postAction=postAction;
/* 时间格式化插件 */
import moment from 'moment'
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
window.moment = moment;
/* 上传插件 */
import uploader from 'vue-simple-uploader'
Vue.use(uploader)
/* 代码高亮 */
import hljs from 'highlight.js'
//样式文件,这里我选的是sublime样式，文件里面还有其他样式可供选择
// import 'highlight.js/styles/monokai-sublime.css' 
import 'highlight.js/styles/googlecode.css'
Vue.directive('highlight',function (el) {
    let blocks = el.querySelectorAll('pre code');
        blocks.forEach((block)=>{
        hljs.highlightBlock(block)
    })
})

Vue.config.productionTip = false
new Vue({
	router,
	store,
	render: h => h(App)
}).$mount('#app')
