import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
export const constantRouterMap = [{
		path: '/',
		component: () => import( /* webpackChunkName: "PageView" */ '@/layouts/PageView.vue'),
		redirect: '/about',
		name: 'home',
		hidden: true,
		meta: {
			title: '首页',
			icon: 'home',
			permission: ['home']
		},
		children: [{
				path: '/about',
				name: 'about',
				component: () => import( /* webpackChunkName: "about" */ './views/about.vue'),
				meta: {
					title: '了解中科讯联',
					icon: 'hourglass_empty',
					permission: ['about']
				}
			}, {
				path: '/base',
				name: 'base',
				component: () => import( /* webpackChunkName: "about" */ './views/base.vue'),
				meta: {
					title: '基础组件',
					icon: 'hourglass_empty',
					permission: ['about']
				}
			},
			{
				path: '/test',
				name: 'test',
				component: () => import( /* webpackChunkName: "about" */ './views/test.vue'),
				meta: {
					title: '二次封装组件',
					icon: 'hourglass_empty',
					permission: ['test']
				}
			}
		]
	}

]

const router = new Router({
	// mode: 'history',
	base: process.env.BASE_URL,
	routes: constantRouterMap
})

export default router
