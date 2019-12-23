<template>
	<sub-page-view>
		<div class="viewlist">
			<!--筛选条件-->
			<div class="flex topbar">
				<filterbar @handlerSearch="handlerSearch" @handlerReset="handlerSearch" :field-list="superQueryFieldList" class="flex-1"></filterbar>
				<div class="handlerbtn">
					<a-button class="ant-btn-success" v-has="'common:dict:add'" @click="addDict()">添加</a-button>
					<a-button type="danger" v-has="'common:dict:batchRemove'" @click="showDeleteConfirm(0)" :disabled="selectedRowKeys.length <= 0">删除</a-button>
				</div>
			</div>
			<!--表格-->
			<s-table class="mt20" bordered :columns="columns" :data="loadData" rowKey="id" ref="table" :scroll="{ x: 1300 }"
			 size="small" :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}">
				<span slot="operation" slot-scope="text, record" class="operation">
					<a href="javascript:;" title="编辑" class="edit" v-has="'common:dict:edit'" @click="editDict(record)"><i class="material-icons icon iconfont">border_color</i></a>
					<a href="javascript:;" title="删除" class="del" v-has="'common:dict:remove'" @click="showDeleteConfirm(1,record.id)"><i
						 class="material-icons icon iconfont">delete</i></a>
				</span>
			</s-table>
		</div>
		<!-- 添加，编辑 -->
		<dict-modal ref="dictModal" @ok="handlerRefresh"></dict-modal>
	</sub-page-view>
</template>

<script>
	import subPageView from '@/layouts/subPageView';
	import DictModal from './module/DictModal'
	import {
		rowSelection
	} from '@/mixins'

	import {
		baseManageapi
	} from '../api'
	import {
		postAction
	} from '@/api'
	const columns = [{
			title: '标签名',
			dataIndex: 'name',
			key: 'name',
			width: 180
		},
		{
			title: '数据值',
			dataIndex: 'value',
			key: 'value',
			width: 180
		},
		{
			title: '类型',
			key: 'type',
			dataIndex: 'type'
		},

		{
			title: '描述',
			key: 'description',
			dataIndex: 'description'
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
	export default {
		mixins:[rowSelection],
		components: {
			subPageView,
			DictModal
		},
		data() {
			return {
				columns: columns,
				filter: {},
				loadData: parameter => {
					//做一些异步操作
					return postAction(
						baseManageapi.getdictList,
						Object.assign(parameter, this.filter)
					).then(res => {
						return res;
					});
				},
				superQueryFieldList: [{
						type: 'string',
						value: 'name',
						text: '标签名',
						defaultValue: ''
					},
					{
						type: 'string',
						value: 'value',
						text: '数据值',
						defaultValue: ''
					},
					{
						type: 'string',
						value: 'type',
						text: '类型',
						defaultValue: ''
					}
					
				],

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
							$me.removeDict(delId);
						} else {
							$me.batchRemoveDict();
						}
					},
					onCancel() {
						console.log('Cancel');
					},
				});
			},
			/* 添加 */
			addDict() {
				this.$refs.dictModal.add();
				//this.visible=true;
			},
			/* 编辑 */
			editDict(record) {
				this.$refs.dictModal.edit(record);
			},
			/*删除*/
			removeDict(delId) {
				postAction(
					baseManageapi.removeDict, {
						id: delId
					}).then(res => {
					this.handlerRefresh();
				});
			},
			/*批量删除 */
			batchRemoveDict() {
				postAction(
					baseManageapi.batchRemoveDict, this.selectedRowKeys).then(res => {
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
