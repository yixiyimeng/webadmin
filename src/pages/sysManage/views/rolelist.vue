<template>
	<sub-page-view>
		<div class="viewlist">
			<!--筛选条件-->
			<div class="flex topbar">
				<filterbar @handlerSearch="handlerSearch" @handlerReset="handlerSearch" :field-list="superQueryFieldList" class="flex-1"></filterbar>
				<div class="handlerbtn">
					<a-button class="ant-btn-success" v-has="'sys:role:add'" @click="addRole()">添加</a-button>
					<a-button type="danger" v-has="'sys:role:batchRemove'" @click="showDeleteConfirm(0)" :disabled="selectedRowKeys.length <= 0">删除</a-button>
				</div>
			</div>
			<!--表格-->
			<s-table class="mt20" bordered :columns="columns" :data="loadData" rowKey="roleId" ref="table" :scroll="{ x: 1300 }"
			 size="small" :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}">
				<a-tag :color="status==1?'#00a095':'#d43030'" slot="status" slot-scope="status">{{ status==1?'启用':'停用'}}</a-tag>
				<span slot="operation" slot-scope="text,record" class="operation">
					<a href="javascript:;" title="编辑" class="edit" v-has="'sys:role:edit'" @click="editRole(record)"><i class="material-icons icon iconfont">border_color</i></a>
					<a href="javascript:;" title="授权" class="add" @click="handlePerssion(record.roleId,record.roleSign)"><i class="material-icons icon iconfont">explore</i></a>
					<a href="javascript:;" title="删除" class="del" v-has="'sys:role:remove'" @click="showDeleteConfirm(1,record.roleId)"><i
						 class="material-icons icon iconfont">delete</i></a>
				</span>
			</s-table>
		</div>
		<user-role-modal ref="modalUserRole" @close="handlerRefresh"></user-role-modal>
		<!-- 添加，编辑 -->
		<role-list-modal ref="roleListModal" @ok="handlerRefresh"></role-list-modal>
		<!-- <modal :visible="true"></modal> -->
	</sub-page-view>
</template>

<script>
	import subPageView from '@/layouts/subPageView';
	import UserRoleModal from '../modules/UserRoleModal';
	import RoleListModal from './module/RoleListModal'
	import modal from '@/components/modal'
	import {
		rowSelection
	} from '@/mixins'
	import {
		sysManageapi,
		getAllorgList
	} from '../api';
	import {
		postAction
	} from '@/api';
	const columns = [{
			title: '序号',
			dataIndex: 'roleId',
			key: 'roleId',
			width: 180
		}, {
			title: '角色名',
			dataIndex: 'roleName',
			key: 'roleName',
			width: 180
		},
		{
			title: '所属机构',
			key: 'organizationName',
			dataIndex: 'organizationName'
		},
		{
			title: '权限',
			dataIndex: 'permission',
			key: 'permission',
		},
		{
			title: '备注',
			dataIndex: 'remark',
			key: 'remark',
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
			defaultValue: '',
			optionlist: []
		},
		{
			type: 'string',
			value: 'roleName',
			text: '角色名',
			defaultValue: ''
		}
	];
	import moment from 'moment';
	export default {
		mixins: [rowSelection],
		components: {
			UserRoleModal,
			RoleListModal,
			subPageView,
			modal
		},
		data() {
			return {
				columns: columns,
				loadData: parameter => {
					//做一些异步操作
					return postAction(
						sysManageapi.getroleList,
						Object.assign(parameter, this.filter)
					).then(res => {
						return res;
					});

				},
				superQueryFieldList: superQueryFieldList,
				rowSelection: {},
				orgList: []
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
			handlePerssion: function(roleId,roleSign) {
				this.$refs.modalUserRole.show(roleId,roleSign);
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
							$me.removeRoleList(delId);
						} else {
							$me.batchRemoveRoleList();
						}
					},
					onCancel() {},
				});
			},
			/* 添加 */
			addRole() {
				this.$refs.roleListModal.add();
				//this.visible=true;
			},
			/* 编辑 */
			editRole(record) {
				this.$refs.roleListModal.edit(record);
			},
			/*删除*/
			removeRoleList(delId) {
				postAction(
					sysManageapi.removeroleList, {
						roleId: delId
					}).then(res => {
					this.handlerRefresh();
				});
			},
			/*批量删除 */
			batchRemoveRoleList() {
				postAction(
					sysManageapi.batchRemoveroleList, this.selectedRowKeys).then(res => {
					this.selectedRowKeys = [];
					this.handlerRefresh();
				});
			},
		}
	};
</script>

<style scoped="scoped" lang="less">
	
</style>
