<template>
	<div class="main flex" style="height: 100%;">
		<sider-menu :collapsed="collapsed" :menus="subMenu" :theme="menuTheme"></sider-menu>
		<div class="flex-1"><route-view></route-view></div>
	</div>
</template>

<script>
import SiderMenu from '@/components/menu/SiderMenu';
import RouteView from '@/layouts/RouteView';
import { mapGetters, mapActions, mapState } from 'vuex';
export default {
	name: 'PageView',
	components: {
		SiderMenu,
		RouteView
	},
	computed: {
		key() {
			// return this.$route.path+Math.random()
			return this.$route.path;
		}
	},
	data() {
		return {
			theme: 'light',
			title: '',
			selectkey: [],
			menuTheme: 'dark',
			menuMode: 'inline',
			collapsed: this.collapsed,
			subMenu: []
		};
	},
	computed: {
		...mapState({
			// 动态主路由
			mainMenu: state => state.permission.routers
		})
	},
	created() {
		/* 获取路由 */
		this.subMenu = this.mainMenu.find(item => item.path === '/').children;
	}
};
</script>

<style></style>
