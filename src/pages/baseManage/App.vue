<template>
	<a-locale-provider :locale="locale">
		<div id="app" style="height: 100%;">
			<route-view></route-view>
		</div>
	</a-locale-provider>
</template>

<script>
	import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN';
	import RouteView from '@/layouts/RouteView';
	import {
		GetQueryString
	} from '@/utils/base'
	import store from './store/index'
	import router from './router'
	import {
		getlistLevelOtherMenu
	} from '@/api'
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
			/* 获取菜单 */
			let menuId = GetQueryString('menuId');
			this.$store.commit('SET_menuId', menuId);
			if (menuId && menuId != "undefined") {
				let menulist = [{
					"id": "186",
					"text": "版本管理",
					"state": null,
					"type": 1,
					"perms": "common:versionManage:versionManage",
					"component": "views/RouteView.vue",
					"redirect": "redirect",
					"isCacheRoute": 0,
					"orderNum": null,
					"checked": true,
					"attributes": {
						"icon": "apps",
						"url": "/versionType"
					},
					"children": [{
						"id": "187",
						"text": "HT46答题器",
						"state": null,
						"type": 1,
						"perms": null,
						"component": "views/versionManage.vue",
						"redirect": null,
						"isCacheRoute": 0,
						"orderNum": null,
						"checked": true,
						"attributes": {
							"icon": "airplay",
							"url": "/versionManage/46"
						},
						"children": [],
						"parentId": "186",
						"parentText": "版本管理",
						"hasParent": true,
						"hasChildren": false
					}, {
						"id": "188",
						"text": "HT45答题器",
						"state": null,
						"type": 1,
						"perms": null,
						"component": "views/versionManage.vue",
						"redirect": null,
						"isCacheRoute": 0,
						"orderNum": null,
						"checked": true,
						"attributes": {
							"icon": "airplay",
							"url": "/versionManage/45"
						},
						"children": [],
						"parentId": "186",
						"parentText": "版本管理",
						"hasParent": true,
						"hasChildren": false
					}, {
						"id": "154",
						"text": "添加",
						"state": null,
						"type": 2,
						"perms": "common:versionManage:add",
						"component": null,
						"redirect": null,
						"isCacheRoute": null,
						"orderNum": null,
						"checked": true,
						"attributes": {
							"icon": "",
							"url": "/common/versionManage/add"
						},
						"children": [],
						"parentId": "186",
						"parentText": "版本管理",
						"hasParent": true,
						"hasChildren": false
					}, {
						"id": "155",
						"text": "编辑",
						"state": null,
						"type": 2,
						"perms": "common:versionManage:edit",
						"component": null,
						"redirect": null,
						"isCacheRoute": null,
						"orderNum": null,
						"checked": true,
						"attributes": {
							"icon": "",
							"url": "/common/versionManage/edit"
						},
						"children": [],
						"parentId": "186",
						"parentText": "版本管理",
						"hasParent": true,
						"hasChildren": false
					}, {
						"id": "156",
						"text": "删除",
						"state": null,
						"type": 2,
						"perms": "common:versionManage:remove",
						"component": null,
						"redirect": null,
						"isCacheRoute": null,
						"orderNum": null,
						"checked": true,
						"attributes": {
							"icon": "",
							"url": "/common/versionManage/remove"
						},
						"children": [],
						"parentId": "186",
						"parentText": "版本管理",
						"hasParent": true,
						"hasChildren": false
					}, {
						"id": "157",
						"text": "批量删除",
						"state": null,
						"type": 2,
						"perms": "common:versionManage:batchRemove",
						"component": null,
						"redirect": null,
						"isCacheRoute": null,
						"orderNum": null,
						"checked": true,
						"attributes": {
							"icon": "",
							"url": "/common/versionManage/batchRemove"
						},
						"children": [],
						"parentId": "186",
						"parentText": "版本管理",
						"hasParent": true,
						"hasChildren": false
					}],
					"parentId": "1",
					"parentText": null,
					"hasParent": false,
					"hasChildren": true
				}, {
					"id": "78",
					"text": "数据字典",
					"state": null,
					"type": 1,
					"perms": "common:dict:dict",
					"component": "views/dict.vue",
					"redirect": null,
					"isCacheRoute": 1,
					"orderNum": null,
					"checked": true,
					"attributes": {
						"icon": "style",
						"url": "/dict"
					},
					"children": [{
						"id": "83",
						"text": "批量删除",
						"state": null,
						"type": 2,
						"perms": "common:dict:batchRemove",
						"component": null,
						"redirect": null,
						"isCacheRoute": null,
						"orderNum": null,
						"checked": true,
						"attributes": {
							"icon": "",
							"url": "/common/dict/batchRemove"
						},
						"children": [],
						"parentId": "78",
						"parentText": "数据字典",
						"hasParent": true,
						"hasChildren": false
					}, {
						"id": "81",
						"text": "删除",
						"state": null,
						"type": 2,
						"perms": "common:dict:remove",
						"component": null,
						"redirect": null,
						"isCacheRoute": null,
						"orderNum": null,
						"checked": true,
						"attributes": {
							"icon": "",
							"url": "/common/dict/remove"
						},
						"children": [],
						"parentId": "78",
						"parentText": "数据字典",
						"hasParent": true,
						"hasChildren": false
					}, {
						"id": "79",
						"text": "增加",
						"state": null,
						"type": 2,
						"perms": "common:dict:add",
						"component": null,
						"redirect": null,
						"isCacheRoute": null,
						"orderNum": null,
						"checked": true,
						"attributes": {
							"icon": "",
							"url": "/common/dict/add"
						},
						"children": [],
						"parentId": "78",
						"parentText": "数据字典",
						"hasParent": true,
						"hasChildren": false
					}, {
						"id": "80",
						"text": "编辑",
						"state": null,
						"type": 2,
						"perms": "common:dict:edit",
						"component": null,
						"redirect": null,
						"isCacheRoute": null,
						"orderNum": null,
						"checked": true,
						"attributes": {
							"icon": "",
							"url": "/common/dict/edit"
						},
						"children": [],
						"parentId": "78",
						"parentText": "数据字典",
						"hasParent": true,
						"hasChildren": false
					}],
					"parentId": "1",
					"parentText": null,
					"hasParent": false,
					"hasChildren": true
				}, {
					"id": "183",
					"text": "测试路由",
					"state": null,
					"type": 1,
					"perms": "test",
					"component": "http://www.baidu.com",
					"redirect": null,
					"isCacheRoute": 1,
					"orderNum": null,
					"checked": true,
					"attributes": {
						"icon": "style",
						"url": "/test"
					},
					"children": [],
					"parentId": "1",
					"parentText": null,
					"hasParent": false,
					"hasChildren": false
				}];
				store.dispatch('GenerateRoutes', {
					menulist
				}).then(() => {
					router.addRoutes(store.getters.addRouters)
				})
				sessionStorage.setItem('subMenu[' + menuId + ']', JSON.stringify(menulist))
				// getlistLevelOtherMenu({
				// 	'menuId': menuId
				// }).then(da => {
				// 	
				// 	
				// })
			}

		}
	};
</script>

<style scoped="scoped" lang="less">
	@import '../../assets/reset.css';

	#app {
		font-family: 'Avenir', Helvetica, Arial, sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		/* text-align: center; */
		color: #2c3e50;

		/deep/ .ant-btn {
			border-radius: 2px;
		}

		/deep/ .ant-table-thead>tr>th {
			background: #fafafa !important;
		}

		/deep/ .table-wrapper .operation {
			line-height: 1;

			a {
				font-size: 20px;
				margin: 0 10px;


				&.del {
					color: #d43030;
				}

				&.add {
					color: #00baad;
				}
			}
		}
	}

	p {
		margin-bottom: 0;
	}

	/deep/ .viewlist {
		.topbar {
			border-top: 1px solid #ddd;
			padding-top: 25px;

			.handlerbtn {
				width: 250px;
				text-align: right;

				.ant-btn {
					margin: 5px 10px;
				}
			}
		}

		.table-wrapper {
			background: #fff;
			box-shadow: 0 0 10px rgba(181, 181, 181, 0.5);
			margin-bottom: 20px;
			border-radius: 2px;
			overflow: hidden;

		}

		/deep/ .ant-card-body {
			padding: 0 20px;
		}

		/deep/ .ant-pagination-total-text {
			position: absolute;
			left: 8px;
		}
	}
</style>
<style lang="less">
	// @import '../../assets/m.less';
</style>
