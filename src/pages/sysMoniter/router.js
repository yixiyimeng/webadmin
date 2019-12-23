import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
export const asyncRouterMap = [{
	path: '/',
	component: () => import( /* webpackChunkName: "PageView" */ '@/layouts/PageView.vue'),
	redirect: 'redirect',
	name: 'home',
	hidden: true,
	meta: {
		title: '系统监控',
		icon: 'home',
		permission: ['home']
	},
	children: [{
			path: '/online',
			name: 'online',
			component: () => import( /* webpackChunkName: "dict" */ './views/online.vue'),
			meta: {
				title: '在线用户',
				icon: 'account_circle',
				permission: ['online']
			}  
		},
		{
			path: '/sysLog',
			name: 'sysLog',
			component: () => import( /* webpackChunkName: "versionManage" */ './views/sysLog.vue'),
			meta: {
				title: '系统日志',
				icon: 'book',
				permission: ['common:log']
			}
		},
		{
			path: '/druid',
			name: 'druid',
			component: () => import( /* webpackChunkName: "downloadVersion" */ './views/druid.vue'),
			meta: {
				title: '运行监控',
				icon: 'center_focus_strong',
				permission: ['druid']
			}
		},
		{
			path: '/serverMonitor',
			name: 'serverMonitor',
			component: () => import( /* webpackChunkName: "versionManage" */ './views/serverMonitor.vue'),
			meta: {
				title: '服务监控',
				icon: 'speaker_notes',
				permission: ['monitor:server:view']
			}
		}
	]
}];
export const constantRouterMap = [];
const router = new Router({
	// mode: 'history',
	base: process.env.BASE_URL,
	routes: constantRouterMap
})

export default router
