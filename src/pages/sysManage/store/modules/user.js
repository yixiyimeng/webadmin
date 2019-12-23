// import {
// 	PartmentLimtTree
// } from "@/api/login"
import {
	setStore,
	getStore
} from "@/utils/storage";
const user = {
	state: {
		name: '',
		avatar: '',
		roles: [],
		info: {},
		userId: {},
		//PartmentLimtTree: {}
	},

	mutations: {
		SET_NAME: (state, name) => {
			state.name = name
		},
		SET_AVATAR: (state, avatar) => {
			state.avatar = avatar
		},
		SET_ROLES: (state, roles) => {
			state.roles = roles
		},
		SET_USERID:(state, userId) =>{
			state.userId = userId
		},
		SET_INFO: (state, info) => {
			state.info = info
		},
		// SET_TREE: (state, info) => {
		// 	state.PartmentLimtTree = info
		// },
	},

	actions: {
		// 获取用户信息
		GetInfo({
			commit
		}) {
			return new Promise((resolve, reject) => {
				try {
					const result = getStore('userinfo');
					if (result) {
						console.log("实话实说"+result)
						commit('SET_ROLES', result.userId)
						commit('SET_USERID',result.userId)
						commit('SET_INFO', result)
						commit('SET_NAME', result.fullname)
						resolve(result)
					} else {
						reject('1223')
					}

				} catch (e) {
					reject('1223456')
				}
			})
		},

		// 登出
		Logout({
			commit,
			state
		}) {
			return new Promise((resolve) => {
				logout().then(() => {
					commit('SET_TOKEN', '')
					commit('SET_ROLES', '')
					removeToken()
					resolve()
				}).catch(() => {
					resolve()
				})
			})
		},


		/* 查询权限部门树 */
		/* PartmentLimtTree({
			commit,
			state
		}) {
			return new Promise((resolve,reject) => {
				if (state.PartmentLimtTree.time && (parseInt(state.PartmentLimtTree.time) + 1000 * 60 * 2) > new Date().getTime()) {
					resolve(state.PartmentLimtTree.tree)
				} else {
					PartmentLimtTree().then((da) => {
						commit('SET_TREE', {
							time: new Date().getTime(),
							tree: da.data
						})
						resolve(state.PartmentLimtTree.tree)
					}).catch(() => {
						reject('')
					})
				}
				
			})

		} */
	},
}

export default user
