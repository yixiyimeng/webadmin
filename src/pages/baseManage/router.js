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
			title: '基础管理',
			icon: 'home',
			permission: ['home']
		},
		// children: [{
		// 		path: '/dict',
		// 		name: 'dict',
		// 		component: () => import( /* webpackChunkName: "dict" */ './views/dict.vue'),
		// 		meta: {
		// 			title: '数据字典',
		// 			icon: 'style',
		// 			permission: ['common:dict:dict']
		// 		}
		// 	},
		// 	{
		// 		path: '/versionManage',
		// 		name: 'versionManage',
		// 		component: () => import( /* webpackChunkName: "versionManage" */ './views/versionManage.vue'),
		// 		meta: {
		// 			title: '版本管理',
		// 			icon: 'apps',
		// 			permission: ['common:versionManage:versionManage']
		// 		}
		// 	},
		// 	{
		// 		path: '/downloadVersion',
		// 		name: 'downloadVersion',
		// 		component: () => import( /* webpackChunkName: "downloadVersion" */ './views/downloadVersion.vue'),
		// 		meta: {
		// 			title: '版本下载',
		// 			icon: 'file_download',
		// 			permission: ['common:versionDownload:versionDownload']
		// 		}
		// 	}
		// ]
	}];
export const constantRouterMap = [

]

const router = new Router({
	// mode: 'history',
	base: process.env.BASE_URL,
	routes: constantRouterMap
})

export default router
