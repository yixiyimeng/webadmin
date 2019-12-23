<template>
	<sub-page-view>
		<div class="viewlist">
			<!--筛选条件-->
			<div class="flex topbar">
				<filterbar @handlerSearch="handlerSearch" @handlerReset="handlerSearch" :field-list="superQueryFieldList" class="flex-1"></filterbar>
				<div class="handlerbtn">
					<a-button class="ant-btn-success" v-has="'foun:class:add'" @click="addClass()">添加</a-button>
					<a-button type="danger" v-has="'foun:class:batchRemove'" @click="showDeleteConfirm(0)" :disabled="selectedRowKeys.length <= 0">删除</a-button>
				</div>
			</div>
			<!--表格-->
			<s-table class="mt20" bordered :columns="columns" :data="loadData" rowKey="id" ref="table" :scroll="{ x: 1300 }"
			 size="small" :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}">
				<a-tag :color="state==1?'#00a095':'#d43030'" slot="state" slot-scope="state">{{ state==1?'启用':'停用'}}</a-tag>
				<span slot="operation" slot-scope="text,record" class="operation">
					<a href="javascript:;" title="编辑" class="edit" v-has="'foun:class:add'" @click="editClass(record)"><i class="material-icons icon iconfont">border_color</i></a>
					<a href="javascript:;" title="删除" class="del" v-has="'foun:class:batchRemove'" @click="showDeleteConfirm(1,record.id)"><i
						 class="material-icons icon iconfont">delete</i></a>
				</span>
			</s-table>
		</div>
		<class-modal ref="classModal" @ok="handlerRefresh"></class-modal>
	</sub-page-view>
</template>

<script>
	import subPageView from '@/layouts/subPageView';
	import ClassModal from './module/classModal'
	import {
		rowSelection
	} from '@/mixins'

	import {
		infoManageapi,
		getAllorgList
	} from '../api'
	import {
		postAction
	} from '@/api'
	const columns = [{
			title: '班级名称',
			dataIndex: 'name',
			key: 'name',
			width: 300
		},
		{
			title: '所属机构',
			dataIndex: 'organizationName',
			key: 'organizationName',
			width: 300
		},
		{
			title: '所属校区',
			key: 'schoolName',
			dataIndex: 'schoolName'
		},

		{
			title: '状态',
			key: 'state',
			dataIndex: 'state',
			scopedSlots: {
				customRender: 'state'
			}
		},
		{
			title: '备注',
			key: 'remark',
			dataIndex: 'remark'
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
		}, {
			type: 'string',
			value: 'schoolName',
			text: '校区名称',
			defaultValue: null
		},
		{
			type: 'string',
			value: 'name',
			text: '班级名称',
			defaultValue: null
		},
		{
			type: 'select',
			value: 'state',
			text: '状态',
			defaultValue: null,
			optionlist: [{
				value: null,
				text: '全部'
			}, {
				value: 0,
				text: '停用'
			}, {
				value: 1,
				text: '启用'
			}]
		}
	];
	import moment from 'moment';
	export default {
		mixins: [rowSelection],
		components: {
			subPageView,
			ClassModal
		},
		data() {
			return {
				columns: columns,
				filter: {},
				loadData: parameter => {
					//做一些异步操作
					return postAction(
						infoManageapi.getClassList,
						Object.assign(parameter, this.filter)
					).then(res => {
						return res;
					});
				},
				superQueryFieldList: superQueryFieldList,
				rowSelection: {},
				isUserAdminRole: false,
				orgList:[]
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
			
			/* 查询 */
			handlerSearch(obj) {
				this.filter = obj;
				this.$refs.table.refresh();
			},
			/* 刷新列表 */
			handlerRefresh() {
				this.$refs.table.refresh();
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
							$me.removeClass(delId);
						} else {
							$me.batchRemoveClass();
						}
					},
					onCancel() {
						console.log('Cancel');
					},
				});
			},
			/* 添加 */
			addClass() {
				this.$refs.classModal.add();
				//this.visible=true;
			},
			/* 编辑 */
			editClass(record) {
				this.$refs.classModal.edit(record);
			},
			/*删除*/
			removeClass(delId) {
				postAction(
					infoManageapi.removeClass, {
						id: delId
					}).then(res => {
					this.handlerRefresh();
				});
			},
			/*批量删除 */
			batchRemoveClass() {
				postAction(
					infoManageapi.batchRemoveClass, this.selectedRowKeys).then(res => {
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

			&.del {
				color: #d43030;
			}

			&.add {
				color: #00baad;
			}
		}
	}
</style>
