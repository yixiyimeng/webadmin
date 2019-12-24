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
			//console.log(menuId)
			if (menuId && menuId != "undefined") {
				let menulist = [{
					"id": "2",
					"text": "系统菜单",
					"state": null,
					"type": 1,
					"perms": "sys:menu:menu",
					"component": "views/menulist.vue",
					"redirect": null,
					"isCacheRoute": 1,
					"orderNum": null,
					"checked": true,
					"attributes": {
						"icon": "account_balance",
						"url": "/menulist"
					},
					"children": [{
						"id": "61",
						"text": "批量删除",
						"state": null,
						"type": 2,
						"perms": "sys:menu:batchRemove",
						"component": null,
						"redirect": null,
						"isCacheRoute": null,
						"orderNum": null,
						"checked": true,
						"attributes": {
							"icon": null,
							"url": ""
						},
						"children": [],
						"parentId": "2",
						"parentText": "系统菜单",
						"hasParent": true,
						"hasChildren": false
					}, {
						"id": "21",
						"text": "编辑",
						"state": null,
						"type": 2,
						"perms": "sys:menu:edit",
						"component": null,
						"redirect": null,
						"isCacheRoute": null,
						"orderNum": null,
						"checked": true,
						"attributes": {
							"icon": "",
							"url": ""
						},
						"children": [],
						"parentId": "2",
						"parentText": "系统菜单",
						"hasParent": true,
						"hasChildren": false
					}, {
						"id": "20",
						"text": "新增",
						"state": null,
						"type": 2,
						"perms": "sys:menu:add",
						"component": null,
						"redirect": null,
						"isCacheRoute": null,
						"orderNum": null,
						"checked": true,
						"attributes": {
							"icon": "",
							"url": ""
						},
						"children": [],
						"parentId": "2",
						"parentText": "系统菜单",
						"hasParent": true,
						"hasChildren": false
					}, {
						"id": "22",
						"text": "删除",
						"state": null,
						"type": 2,
						"perms": "sys:menu:remove",
						"component": null,
						"redirect": null,
						"isCacheRoute": null,
						"orderNum": null,
						"checked": true,
						"attributes": {
							"icon": "",
							"url": ""
						},
						"children": [],
						"parentId": "2",
						"parentText": "系统菜单",
						"hasParent": true,
						"hasChildren": false
					}],
					"parentId": "3",
					"parentText": null,
					"hasParent": false,
					"hasChildren": true
				}, {
					"id": "211",
					"text": "账户管理",
					"state": null,
					"type": 1,
					"perms": null,
					"component": "views/accountlist.vue",
					"redirect": null,
					"isCacheRoute": 0,
					"orderNum": null,
					"checked": true,
					"attributes": {
						"icon": "face",
						"url": "/accountlist"
					},
					"children": [],
					"parentId": "3",
					"parentText": null,
					"hasParent": false,
					"hasChildren": false
				}, {
					"id": "6",
					"text": "用户管理",
					"state": null,
					"type": 1,
					"perms": "sys:user:user",
					"component": "views/userlist.vue",
					"redirect": null,
					"isCacheRoute": 1,
					"orderNum": null,
					"checked": true,
					"attributes": {
						"icon": "style",
						"url": "/userlist"
					},
					"children": [{
						"id": "12",
						"text": "新增",
						"state": null,
						"type": 2,
						"perms": "sys:user:add",
						"component": null,
						"redirect": null,
						"isCacheRoute": null,
						"orderNum": null,
						"checked": true,
						"attributes": {
							"icon": "",
							"url": ""
						},
						"children": [],
						"parentId": "6",
						"parentText": "用户管理",
						"hasParent": true,
						"hasChildren": false
					}, {
						"id": "14",
						"text": "删除",
						"state": null,
						"type": 2,
						"perms": "sys:user:remove",
						"component": null,
						"redirect": null,
						"isCacheRoute": null,
						"orderNum": null,
						"checked": true,
						"attributes": {
							"icon": null,
							"url": null
						},
						"children": [],
						"parentId": "6",
						"parentText": "用户管理",
						"hasParent": true,
						"hasChildren": false
					}, {
						"id": "25",
						"text": "停用",
						"state": null,
						"type": 2,
						"perms": "sys:user:disable",
						"component": null,
						"redirect": null,
						"isCacheRoute": null,
						"orderNum": null,
						"checked": true,
						"attributes": {
							"icon": null,
							"url": null
						},
						"children": [],
						"parentId": "6",
						"parentText": "用户管理",
						"hasParent": true,
						"hasChildren": false
					}, {
						"id": "13",
						"text": "编辑",
						"state": null,
						"type": 2,
						"perms": "sys:user:edit",
						"component": null,
						"redirect": null,
						"isCacheRoute": null,
						"orderNum": null,
						"checked": true,
						"attributes": {
							"icon": "",
							"url": ""
						},
						"children": [],
						"parentId": "6",
						"parentText": "用户管理",
						"hasParent": true,
						"hasChildren": false
					}, {
						"id": "24",
						"text": "批量删除",
						"state": null,
						"type": 2,
						"perms": "sys:user:batchRemove",
						"component": null,
						"redirect": null,
						"isCacheRoute": null,
						"orderNum": null,
						"checked": true,
						"attributes": {
							"icon": "",
							"url": ""
						},
						"children": [],
						"parentId": "6",
						"parentText": "用户管理",
						"hasParent": true,
						"hasChildren": false
					}, {
						"id": "26",
						"text": "重置密码",
						"state": null,
						"type": 2,
						"perms": "sys:user:resetPwd",
						"component": null,
						"redirect": null,
						"isCacheRoute": null,
						"orderNum": null,
						"checked": true,
						"attributes": {
							"icon": "",
							"url": ""
						},
						"children": [],
						"parentId": "6",
						"parentText": "用户管理",
						"hasParent": true,
						"hasChildren": false
					}],
					"parentId": "3",
					"parentText": null,
					"hasParent": false,
					"hasChildren": true
				}, {
					"id": "7",
					"text": "角色管理",
					"state": null,
					"type": 1,
					"perms": "sys:role:role",
					"component": "views/rolelist.vue",
					"redirect": null,
					"isCacheRoute": 1,
					"orderNum": null,
					"checked": true,
					"attributes": {
						"icon": "recent_actors",
						"url": "/rolelist"
					},
					"children": [{
						"id": "55",
						"text": "编辑",
						"state": null,
						"type": 2,
						"perms": "sys:role:edit",
						"component": null,
						"redirect": null,
						"isCacheRoute": null,
						"orderNum": null,
						"checked": true,
						"attributes": {
							"icon": "",
							"url": ""
						},
						"children": [],
						"parentId": "7",
						"parentText": "角色管理",
						"hasParent": true,
						"hasChildren": false
					}, {
						"id": "56",
						"text": "删除",
						"state": null,
						"type": 2,
						"perms": "sys:role:remove",
						"component": null,
						"redirect": null,
						"isCacheRoute": null,
						"orderNum": null,
						"checked": true,
						"attributes": {
							"icon": null,
							"url": ""
						},
						"children": [],
						"parentId": "7",
						"parentText": "角色管理",
						"hasParent": true,
						"hasChildren": false
					}, {
						"id": "62",
						"text": "批量删除",
						"state": null,
						"type": 2,
						"perms": "sys:role:batchRemove",
						"component": null,
						"redirect": null,
						"isCacheRoute": null,
						"orderNum": null,
						"checked": true,
						"attributes": {
							"icon": null,
							"url": ""
						},
						"children": [],
						"parentId": "7",
						"parentText": "角色管理",
						"hasParent": true,
						"hasChildren": false
					}, {
						"id": "15",
						"text": "新增",
						"state": null,
						"type": 2,
						"perms": "sys:role:add",
						"component": null,
						"redirect": null,
						"isCacheRoute": null,
						"orderNum": null,
						"checked": true,
						"attributes": {
							"icon": "",
							"url": ""
						},
						"children": [],
						"parentId": "7",
						"parentText": "角色管理",
						"hasParent": true,
						"hasChildren": false
					}],
					"parentId": "3",
					"parentText": null,
					"hasParent": false,
					"hasChildren": true
				}];
				console.log(menulist);
				store.dispatch('GenerateRoutes', {
					menulist
				}).then(() => {
					router.addRoutes(store.getters.addRouters)
				})
				sessionStorage.setItem('subMenu[' + menuId + ']', JSON.stringify(menulist))
				
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
