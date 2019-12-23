/* 具体路由流程查看asssets/1.png */
import router from './router'
import store from './store/index'
import {
	getlistLevelOtherMenu
} from '@/api'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import {
	setStore,
	getStore,
	clearStore,
	clearAll
} from '@/utils/storage';
NProgress.configure({
	showSpinner: false
})
router.beforeEach((to, from, next) => {
	NProgress.start() // start progress bar
	/* 判断 token 校验用户信息， */
	if (getStore('userInfo')) {
		next()
	} else {
		location.href = 'login.html'
	}


})

router.afterEach(() => {
	NProgress.done() // finish progress bar
})
