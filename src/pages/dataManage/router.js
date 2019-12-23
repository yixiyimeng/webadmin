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
			title: '数据管理',
			icon: 'home',
			permission: ['home']
		},
		children: [{
				path: '/statisticalReports',
				name: 'statisticalReports',
				redirect: 'redirect',
				component: () => import( /* webpackChunkName: "dict" */ './views/RouteView.vue'),
				meta: {
					title: '统计报表',
					icon: 'trending_up',
					permission: ['statisticalReports']
				},
				children: [{
						path: '/campusDimensions',
						name: 'campusDimensions',
						component: () => import( /* webpackChunkName: "dict" */ './views/campusDimension.vue'),
						meta: {
							title: '校区维度',
							icon: 'public',
							permission: ['inte:answerRec:schoolCount']
						}
					},
					{
						path: '/classDimension',
						name: 'classDimension',
						component: () => import( /* webpackChunkName: "dict" */ './views/classDimension.vue'),
						meta: {
							title: '班级维度',
							icon: 'school',
							permission: ['inte:answerRec:classCount']
						}
					}
				]
			},
			{
				path: '/answerRecord',
				name: 'answerRecord',
				component: () => import( /* webpackChunkName: "versionManage" */ './views/answerRecord.vue'),
				meta: {
					title: '答题记录',
					icon: 'touch_app',
					permission: ['inte:answerRec:answerRec']
				}
			},
			{
				path: '/accessRecord',
				name: 'accessRecord',
				component: () => import( /* webpackChunkName: "versionManage" */ './views/accessRecord.vue'),
				meta: {
					title: '接入记录',
					icon: 'track_changes',
					permission: ['inte:clientConnRec:clientConnRec']
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
