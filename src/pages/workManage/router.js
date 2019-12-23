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
			title: '办公管理',
			icon: 'home',
			permission: ['home']
		},
		children: [{
				path: '/notice',
				name: 'notice',
				component: () => import( /* webpackChunkName: "notice" */ './views/notice.vue'),
				meta: {
					title: '通知公告',
					icon: 'volume_down',
					permission: ['oa:notify:notify']
				}
			},
			{
				path: '/mynotice',
				name: 'mynotice',
				component: () => import( /* webpackChunkName: "mynotice" */ './views/mynotice.vue'),
				meta: {
					title: '我的通知',
					icon: 'notifications',
					permission: ['selfNotify']
				}
			}
			
		]
	}

]
export const constantRouterMap = [];
const router = new Router({
	// mode: 'history',
	base: process.env.BASE_URL,
	routes: constantRouterMap
})

export default router
