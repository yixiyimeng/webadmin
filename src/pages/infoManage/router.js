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
			title: '信息管理',
			icon: 'home',
			permission: ['home']
		},
		children: [{
				path: '/organizationManage',
				name: 'organizationManage',
				component: () => import( /* webpackChunkName: "organizationManage" */ './views/organizationManage.vue'),
				meta: {
					title: '机构管理',
					icon: 'store_mall_directory',
					permission: ['foun:org:org']
				}
        	},
			{
				path: '/schoolManage',
				name: 'schoolManage',
				component: () => import( /* webpackChunkName: "schoolManage" */ './views/schoolManage.vue'),
				meta: {
					title: '校区管理',
					icon: 'business',
					permission: ['foun:school:school']
				}
			},

            {
                path: '/classManage',
                name: 'classManage',
                component: () => import( /* webpackChunkName: "classManage" */ './views/classManage.vue'),
                meta: {
                    title: '班级管理',
                    icon: 'library_books',
                    permission: ['foun:class:class']
                }
            },
            {
                path: '/studentManage',
                name: 'studentManage',
                component: () => import( /* webpackChunkName: "studentManage" */ './views/studentManage.vue'),
                meta: {
                    title: '学生管理',
                    icon: 'assignment_ind',
                    permission: ['foun:student:student']
                }
            },
            {
                path: '/preTopicManage',
                name: 'preTopicManage',
                component: () => import( /* webpackChunkName: "preTopicManage" */ './views/preTopicManage.vue'),
                meta: {
                    title: '试卷管理',
                    icon: 'format_size',
                    permission: ['foun:preTopic:preTopic']
                }
            },
            {
                path: '/preTopicQuestionManage',
                name: 'preTopicQuestionManage',
                component: () => import( /* webpackChunkName: "preTopicQuestionManage" */ './views/preTopicQuestionManage.vue'),
                meta: {
                    title: '题目管理',
                    icon: 'format_list_numbered',
                    permission: ['foun:preTopicQuestion:preTopicQuestion']
                }
            },
			
		]
	}

]
export const constantRouterMap=[];
const router = new Router({
	// mode: 'history',
	base: process.env.BASE_URL,
	routes: constantRouterMap
})

export default router
