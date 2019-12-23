import Vue from 'vue'
import Vuex from 'vuex'
import tagsView from './modules/tagsView'
import app from './modules/app'
import user from './modules/user'
import permission from './modules/permission'
import getters from './getters'

Vue.use(Vuex)

export default new Vuex.Store({
	modules: {
		tagsView,
		app,
		user,
		permission
	},
	state: {
	},
	mutations: {

	},
	actions: {

	},
	getters
})
