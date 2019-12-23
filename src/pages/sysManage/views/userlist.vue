<template>
	<sub-page-view>
		<div class="viewlist">
			<!--筛选条件-->
			<div class="flex topbar">
				<filterbar @handlerSearch="handlerSearch" @handlerReset="handlerSearch" :field-list="superQueryFieldList" class="flex-1"></filterbar>
				<div class="handlerbtn">
					<a-button class="ant-btn-success" v-has="'sys:user:add'" @click="addUser()">添加</a-button>
					<a-button type="danger" v-has="'sys:user:batchRemove'" @click="showDeleteConfirm(0)" :disabled="selectedRowKeys.length <= 0">删除</a-button>
				</div>
			</div>
			<!--表格-->
			<s-table class="mt20" bordered :columns="columns" :data="loadData" rowKey="userId" ref="table" :scroll="{ x: 1300 }"
			 size="small" :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}">
				<a-tag :color="status==1?'#00a095':'#d43030'" slot="status" slot-scope="status">{{ status==1?'启用':'停用'}}</a-tag>
				<span slot="operation" slot-scope="text,record" class="operation">
					<a href="javascript:;" title="编辑" class="edit" v-has="'sys:user:edit'" @click="editUser(record)"><i class="material-icons icon iconfont">border_color</i></a>
					<a href="javascript:;" title="重置密码" class="add" v-has="'sys:user:resetPwd'" @click="adminResetPwd(record)"><i
						 class="material-icons icon iconfont">enhanced_encryption</i></a>
					<a href="javascript:;" title="删除" class="del" v-has="'sys:user:remove'" @click="showDeleteConfirm(1,record.userId)"><i
						 class="material-icons icon iconfont">delete</i></a>
				</span>
				<span slot="roleNames" slot-scope="text,record">{{text.join(',')}}</span>
			</s-table>
		</div>
		<!-- 添加，编辑 -->
		<user-list-modal ref="userListModal" @ok="handlerRefresh"></user-list-modal>
		<!-- 重置密码  -->
		<rest-password-modal ref="restPasswordModal" @ok="handlerRefresh"></rest-password-modal>
	</sub-page-view>
</template>

<script>
	import subPageView from '@/layouts/subPageView';
	import UserListModal from './module/UserListModal';
	import RestPasswordModal from './module/restPasswordModal';
	import {
		sysManageapi,
		getAllorgList
	} from '../api';
	import {
		rowSelection
	} from '@/mixins';
	import {
		postAction
	} from '@/api';
	const columns = [{
			title: '用户ID',
			dataIndex: 'userId',
			key: 'userId',
			width: 180
		}, {
			title: '姓名',
			dataIndex: 'name',
			key: 'name',
			width: 180
		},
		{
			title: '用户名',
			key: 'username',
			dataIndex: 'username'
		},
		{
			title: '所属机构',
			dataIndex: 'organizationName',
			key: 'organizationName',
		},
		{
			title: '邮箱',
			dataIndex: 'email',
			key: 'email',
		},
		{
			title: '所属校区',
			key: 'schoolName',
			dataIndex: 'schoolName'
		},
		{
			title: '角色',
			key: 'roleNames',
			dataIndex: 'roleNames',
			scopedSlots: {
				customRender: 'roleNames'
			}
		},
		{
			title: '状态',
			dataIndex: 'status',
			key: 'status',
			align: 'center',
			width: 180,
			scopedSlots: {
				customRender: 'status'
			}
		},
		{
			title: '操作',
			key: 'operation',
			dataIndex: 'operation',
			scopedSlots: {
				customRender: 'operation'
			},
			align: 'center',
			width: 160,
			fixed: 'right'
		}
	];
	const superQueryFieldList = [{
			type: 'select',
			value: 'organization',
			text: '所属机构',
			defaultValue: null,
			optionlist: []
		},
		{
			type: 'string',
			value: 'name',
			text: '姓名',
			defaultValue: null
		}
	];
	import moment from 'moment';
	export default {
		mixins: [rowSelection],
		data() {
			return {
				columns: columns,
				loadData: parameter => {
					//做一些异步操作
					return postAction(
						sysManageapi.getuserList,
						Object.assign(parameter, this.filter)
					).then(res => {
						return res;
					});

				},
				superQueryFieldList: superQueryFieldList,
				rowSelection: {},
				orgList: [],
				isUserAdminRole: false, //用户是否是超级管理员角色
			};
		},
		created() {
			/* 判断用户是否是管理员 */
			try {
				if (JSON.parse(localStorage.getItem('userInfo')).roleSign == 'admin') {
					this.isUserAdminRole = true;
					this.getAllorgList();
				} else {
					this.columns = columns.filter(item => {
						if (item.dataIndex != 'organizationName') {
							return item
						}
					})
					this.superQueryFieldList = superQueryFieldList.filter(item => {
						if (item.value != 'organization') {
							return item
						}
					})
				}
			} catch (e) {
				//TODO handle the exception
			}
		},
		components: {
			subPageView,
			UserListModal,
			RestPasswordModal
		},
		methods: {
			/*查询所有机构*/
			getAllorgList() {
				getAllorgList().then(da => {
					this.orgList = [];
					if (da.data && da.data.length > 0) {
						this.orgList = da.data.map(item => {
							return {
								value: item.code,
								text: item.name
							}
						});
					}
					this.orgList.unshift({
						value: '',
						text: '全部'
					});
					this.superQueryFieldList[0].optionlist = this.orgList;
				})

			},
			/*改变机构*/
			changeOrg() {
				getAllorgList()
			},
			/*查询*/
			handlerSearch(obj) {
				this.filter = obj;
				this.$refs.table.refresh();
			},
			/* 刷新列表 */
			handlerRefresh() {
				this.$refs.table.refresh();
			},
			/*重置密码*/
			adminResetPwd(record) {
				this.$refs.restPasswordModal.resetPwd(record);
			},
			/* 确认是否删除 */
			showDeleteConfirm(type, delId) {
				let $me = this;
				this.$confirm({
					title: type == 1 ? '你确定要删除这条吗?' : '你确定要删除这' + $me.selectedRowKeys.length + '条选中的数据吗？',
					content: '',
					okText: '确定',
					cancelText: '取消',
					class: 'confirmbox',
					okType: 'danger',
					onOk() {
						//console.log('OK');
						if (type == 1) {
							$me.removeUserList(delId);
						} else {
							$me.batchRemoveUserList();
						}
					},
					onCancel() {},
				});
			},
			/* 添加 */
			addUser() {
				this.$refs.userListModal.add();
				//this.visible=true;
			},
			/* 编辑 */
			editUser(record) {
				this.$refs.userListModal.edit(record);
			},
			/*删除*/
			removeUserList(delId) {
				postAction(
					sysManageapi.removeuserList, {
						userId: delId
					}).then(res => {
					this.handlerRefresh();
				});
			},
			/*批量删除 */
			batchRemoveUserList() {
				postAction(
					sysManageapi.batchRemoveuserList, this.selectedRowKeys).then(res => {
					this.selectedRowKeys = [];
					this.handlerRefresh();
				});
			},
		}
	};
</script>

<style scoped="scoped" lang="less">
	.table-wrapper .operation {
		a {
			font-size: 20px;
			margin: 0 10px;
			line-height: 1;

			&.del {
				color: #d43030;
			}

			&.add {
				color: #00baad;
			}
		}
	}
</style>
