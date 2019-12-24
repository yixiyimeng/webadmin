import Vue from "vue";
import App from "./App.vue";
import router from "./router";//路由
import store from "./store/";//vuex 状态管理
import {VueAxios} from "@/utils/request";//接口请求
// import Antd from 'ant-design-vue'
// import 'ant-design-vue/dist/antd.less'
import "@babel/polyfill" //用来兼容ie
import './permission'//权限路由处理
// import './components' //按需加载的ant-design 样式
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.less'
Vue.use(Antd)
import {postAction} from '@/api';
Vue.prototype.$postAction=postAction;
Vue.config.productionTip = false;
new Vue({
  router,
  store,
  VueAxios,
  render: h => h(App)
}).$mount("#app");
