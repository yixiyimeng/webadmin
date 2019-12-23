<template>
	<a-locale-provider :locale="locale">
		<div id="app" style="height: 100%;"><route-view></route-view></div>
	</a-locale-provider>
</template>

<script>
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN';
import RouteView from '@/layouts/RouteView';
import {
		updateTheme
	} from '@/components/SettingDrawer/settingConfig'
export default {
	name: 'app',
	components: {
		RouteView
	},
	computed: {},
	data() {
		return {
			locale: zhCN
		};
	},
	computed: {},
	created() {
		updateTheme(localStorage.getItem('primaryColor') || '#125fc9');
	}
};
</script>

<style scoped="scoped">
@import '../../assets/reset.css';
#app {
	font-family: 'Avenir', Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	/* text-align: center; */
	color: #2c3e50;
}
p {
	margin-bottom: 0;
}
</style>
