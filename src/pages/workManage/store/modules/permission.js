import {
    asyncRouterMap,
    constantRouterMap
} from "@/pages/workManage/router"

/**
 * 过滤账户是否拥有某一个权限，并将菜单从加载列表移除
 *
 * @param permission
 * @param route
 * @returns {boolean}
 */
function hasPermission(permslist, route) {
	if (route.meta && route.meta.permission) {

		let flag = false;
		if (route.meta.permission.includes('home')) {
			return true
		}
		console.log(route.meta.permission);
		for (let i = 0, len = permslist.length; i < len; i++) {
			flag = route.meta.permission.includes(permslist[i])
			if (flag) {
				return true
			}
		}
		return false
	}
	return true
}

function filterAsyncRouter(routerMap, permslist) {
	const accessedRouters = routerMap.filter(route => {
		if (hasPermission(permslist, route)) {
			if (route.children && route.children.length) {
				route.children = filterAsyncRouter(route.children, permslist)
			}
			return true
		}
		return false
		//return true
	})
	console.log(accessedRouters);
	return accessedRouters
}

function setredirect(routerMap) {
	console.log('routerMap',routerMap)
	routerMap.forEach(route => {
		if (route.redirect == 'redirect') {
			
			if (route.children && route.children.length > 0) {
				route.redirect = route.children[0].path;
				
				route.children=setredirect(route.children)
			}
			// return true
		}
		// return false
	})
	return routerMap
}
const permission = {
	state: {
		routers: constantRouterMap,
		addRouters: [],
		buttenpremissions: [],
		menuId: ''
	},
	mutations: {
		SET_ROUTERS: (state, routers) => {
			state.addRouters = routers;
			state.routers = constantRouterMap.concat(routers)
		},
		SET_PERMSLIST: (state, permslist) => {
			state.permslist = permslist;
			sessionStorage.setItem('buttenpremissions[' + state.menuId + ']', JSON.stringify(permslist))
		},
		SET_menuId: (state, menuId) => {
			state.menuId = menuId;
		}
	},
	actions: {
		GenerateRoutes({
			commit
		}, data) {
			return new Promise(resolve => {
				const {
					menulist
				} = data;
				/* 获取权限列表 */
				console.log(JSON.stringify(menulist));
				let permslist = JSON.stringify(menulist).match(/(?=\"perms\":")([^\,]*)(?=\,)/g).join(',').replace(/"perms":/g,
					'').replace(/\"/g, '').split(',');
				//console.log(permslist)
				const accessedRouters = filterAsyncRouter(asyncRouterMap, permslist)
				const router = setredirect(accessedRouters);
				console.log(router)
				commit('SET_ROUTERS', router)
				commit('SET_PERMSLIST', permslist)
				resolve()
			})
		}
	}
}

export default permission
