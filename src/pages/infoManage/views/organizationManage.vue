<template>
	<sub-page-view>
		<div class="viewlist">
			<!--筛选条件-->
			<div class="flex topbar">
				<filterbar @handlerSearch="handlerSearch" @handlerReset="handlerSearch" :field-list="superQueryFieldList" class="flex-1"></filterbar>
				<div class="handlerbtn">
					<a-button class="ant-btn-success" @click="addOrg">添加</a-button>
					<a-button type="danger" @click="showDeleteConfirm(0)" :disabled="selectedRowKeys.length <= 0">删除</a-button>
				</div>
			</div>
			<!--表格-->
			<s-table class="mt20" bordered :columns="columns" :data="loadData" rowKey="id" ref="table" :scroll="{ x: 1300 }"
			 size="small" :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}">
				<a-tag :color="state==1?'#00a095':'#d43030'" slot="state" slot-scope="state">{{ state==1?'启用':'停用'}}</a-tag>
				<span slot="operation" slot-scope="text,record" class="operation">
					<a href="javascript:;" title="编辑" class="edit" @click="editOrg(record)"><i class="material-icons icon iconfont">border_color</i></a>
					<a href="javascript:;" title="删除" class="del" @click="showDeleteConfirm(1,record.id)"><i class="material-icons icon iconfont">delete</i></a>
				</span>
			</s-table>
		</div>
		<org-modal ref="orgModal" @ok="handlerRefresh"></org-modal>
	</sub-page-view>
</template>

<script>
	import subPageView from '@/layouts/subPageView';
	import OrgModal from './module/orgModal';
	import {
		rowSelection
	} from '@/mixins'

	import {
		infoManageapi
	} from '../api'
	import {
		postAction
	} from '@/api'
	const columns = [{
			title: '机构编码',
			dataIndex: 'code',
			key: 'code',
			width: 300
		},
		{
			title: '机构名称',
			dataIndex: 'name',
			key: 'name',
			width: 300
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
			title: '添加时间',
			key: 'addDatetime',
			dataIndex: 'addDatetime'
		}, {
			title: '有效期',
			key: 'periodOfValidity',
			dataIndex: 'periodOfValidity'
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
	import moment from 'moment';
	export default {
		mixins: [rowSelection],
		components: {
			subPageView,
			OrgModal
		},
		data() {
			return {
				columns: columns,
				filter: {},
				loadData: parameter => {
					//做一些异步操作
					return postAction(
						infoManageapi.getOrgList,
						Object.assign(parameter, this.filter)
					).then(res => {
						return res;
					});
				},
				superQueryFieldList: [{
						type: 'string',
						value: 'name',
						text: '机构名称',
						defaultValue: null
					},
					{
						type: 'select',
						value: 'state',
						text: '状态',
						defaultValue: -1,
						optionlist: [{
							value: -1,
							text: '全部'
						}, {
							value: 0,
							text: '停用'
						}, {
							value: 1,
							text: '启用'
						}]
					}
				],
				rowSelection: {}
			};
		},

		methods: {
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
							$me.removeOrg(delId);
						} else {
							$me.batchRemoveOrg();
						}
					},
					onCancel() {
						console.log('Cancel');
					},
				});
			},
			/* 添加 */
			addOrg() {
				this.$refs.orgModal.add();
				//this.visible=true;
			},
			/* 编辑 */
			editOrg(record) {
				this.$refs.orgModal.edit(record);
			},
			/*删除*/
			removeOrg(delId) {
				postAction(
					infoManageapi.removeOrg, {
						id: delId
					}).then(res => {
					this.handlerRefresh();
				});
			},
			/*批量删除 */
			batchRemoveOrg() {
				postAction(
					infoManageapi.batchRemoveOrg, this.selectedRowKeys).then(res => {
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
