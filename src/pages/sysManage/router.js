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
			title: '系统管理',
			icon: 'home',
			permission: ['home']
		},
		// children: [{
		// 		path: '/userlist',
		// 		name: 'userlist',
		// 		component: () => import( /* webpackChunkName: "userlist" */ './views/userlist.vue'),
		// 		meta: {
		// 			title: '用户管理',
		// 			icon: 'style',
		// 			permission: ['sys:user:user']
		// 		}
		// 	},
		// 	{
		// 		path: '/rolelist',
		// 		name: 'rolelist',
		// 		component: () => import( /* webpackChunkName: "rolelist" */ './views/rolelist.vue'),
		// 		meta: {
		// 			title: '角色管理',
		// 			icon: 'recent_actors',
		// 			permission: ['sys:role:role']
		// 		}
		// 	},
		// 	{
		// 		path: '/menulist',
		// 		name: 'menulist',
		// 		component: () => import( /* webpackChunkName: "menulist" */ './views/menulist.vue'),
		// 		meta: {
		// 			title: '系统菜单',
		// 			icon: 'account_balance',
		// 			permission: ['sys:menu:menu']
		// 		}
		// 	}
		// ]
	}

]
export const constantRouterMap = [];
const router = new Router({
	// mode: 'history',
	base: process.env.BASE_URL,
	routes: constantRouterMap
})

export default router
