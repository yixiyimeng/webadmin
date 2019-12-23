<template>
	<sub-page-view>
		<div class="viewlist">
			<!--筛选条件-->
			<div class="flex topbar">
				<superfilterbar @handlerSearch="handlerSearch" @handlerReset="handlerSearch" :field-list="superQueryFieldList"
				 class="flex-1"></superfilterbar>
				<div class="handlerbtn">
					<!--<a-button class="ant-btn-success">添加</a-button>-->
					<a-button type="danger" v-has="'inte:clientConnRec:batchRemove'" @click="showDeleteConfirm(0)" :disabled="selectedRowKeys.length <= 0">删除</a-button>
				</div>
			</div>
			<!--表格-->
			<s-table class="mt20" bordered :columns="columns" :data="loadData" rowKey="id" ref="table" :scroll="{ x: 1300 }"
			 size="small" :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}">
				<span slot="operation" slot-scope="text, record" class="operation">
					<a href="javascript:;" title="删除" class="del" v-has="'inte:clientConnRec:remove'" @click="showDeleteConfirm(1,record.id)"><i
						 class="material-icons icon iconfont">delete</i></a>
				</span>
				 <template slot="buildOptionText" slot-scope="props">
					 12233
				      <span v-if="props.value!=='50'">{{props.value}}条/页</span>
				      <span v-if="props.value==='50'">全部</span>
				    </template>
			</s-table>
		</div>
	</sub-page-view>
</template>

<script>
	import subPageView from '@/layouts/subPageView';
	import superfilterbar from '@/components/filterbar/superfilterbar'
	import {
		dataManageapi
	} from '../api';
	import {
		rowSelection
	} from '@/mixins';
	import {
		postAction,
		getToplist
	} from '@/api';
	const columns = [{
			title: '所属机构',
			dataIndex: 'organizationName',
			key: 'organizationName',
			// width: 180
		},
		{
			title: '校区',
			key: 'schoolName',
			dataIndex: 'schoolName'
		},
		{
			title: '班级名称',
			key: 'className',
			dataIndex: 'className'
		},
		{
			title: '老师名称',
			key: 'teacAssistantName',
			dataIndex: 'teacAssistantName'
		},
		{
			title: '主题名称',
			dataIndex: 'topicName',
			key: 'topicName',
			// width: 180
		},
		{
			title: '连接开始时间',
			key: 'startDatetime',
			dataIndex: 'startDatetime'
		},
		{
			title: '连接结束时间',
			key: 'endDatetime',
			dataIndex: 'endDatetime'
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
		mixins: [rowSelection],
		components: {
			subPageView,
			superfilterbar
		},
		data() {
			return {
				columns: columns,
				loadData: parameter => {
					//做一些异步操作
					return postAction(
						dataManageapi.getAccess,
						Object.assign(parameter, this.filter)
					).then(res => {
						return res;
					});
				},
				superQueryFieldList: [{
						type: 'date',
						value: 'startDateTime',
						text: '时间',
						defaultValue:null,
						
					},
					{
						type: 'select',
						value: 'topicCode',
						text: '科目',
						defaultValue: '',
						optionlist: []
					}
				],
			};
		},
		created() {
			try {
				if (JSON.parse(localStorage.getItem('userInfo')).roleSign != 'admin') {
					this.columns = columns.filter(item => {
						if (item.dataIndex != 'organizationName') {
							return item
						}
					})
				}
			} catch (e) {
				//TODO handle the exception
			}
		},
		methods: {
			/*查询*/
			handlerSearch(obj) {
				this.filter = {
					topicCode: obj.topicCode
				};
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
			/*删除*/
			removeDict(delId) {
				postAction(
					dataManageapi.removeselfList, {
						id: delId
					}).then(res => {
					this.handlerRefresh();
				});
			},
			/*批量删除 */
			batchRemoveDict() {
				postAction(
					dataManageapi.batchRemoveselfList, this.selectedRowKeys).then(res => {
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
