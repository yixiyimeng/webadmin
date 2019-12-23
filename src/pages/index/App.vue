<template><a-locale-provider :locale="locale">
	<div id="app"><page-view></page-view></div>
	</a-locale-provider>
</template>
<script>
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN';
import pageView from '@/pages/index/layouts/pageView';
export default {
	name: 'home',
	components: {
		pageView
	},
	data() {
		return {
			locale: zhCN
		};
	},
	
	mounted() {
		console.log(process.env.VUE_APP_SRC);
	}
};
</script>
<style lang="less">
@import '../../assets/reset.css';
#app {
	font-family: 'Avenir', Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	// text-align: center;
	color: #2c3e50;
}
#nav {
	padding: 30px;
	a {
		font-weight: bold;
		color: #2c3e50;
		&.router-link-exact-active {
			color: #42b983;
		}
	}
}
</style>
