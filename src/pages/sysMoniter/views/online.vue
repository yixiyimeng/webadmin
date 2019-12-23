<template>
	<sub-page-view>
	<div class="viewlist">
			<!--筛选条件-->
			<div class="flex topbar">
				<filterbar @handlerSearch="handlerSearch" @handlerReset="handlerSearch" :field-list="superQueryFieldList" class="flex-1"></filterbar>
			</div>
			<!--表格-->
			<s-table class="mt20" bordered :columns="columns" :data="loadData" rowKey="id" ref="table" :scroll="{ x: 1300 }"
			 size="small" :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}" :showPagination="false">
			 	<a-tag :color="status=='on_line' ? '#00a095':'#d43030' " slot="status" slot-scope="status">{{ status == 'on_line' ? '在线':'离线'}}</a-tag>
				<span slot="operation" slot-scope="text, record" class="operation">
					<a href="javascript:;" title="下线" class="del" @click="showDeleteConfirm(record.id)"><i class="material-icons icon iconfont">delete</i></a>
				</span>
			</s-table>
		</div>
	</sub-page-view>
</template>

<script>
	import subPageView from '@/layouts/subPageView';
	import {
		sysMoniterapi
	} from '../api';
	import {
		rowSelection
	} from '@/mixins';
	import {
		postAction
	} from '@/api';
const columns = [
	{
		title: '序号',
		dataIndex: 'id',
		key: 'id',
		width: 180
	},
	{
		title: '用户名',
		dataIndex: 'username',
		key: 'username',
		width: 180
	},
	{
		title: '主机',
		key: 'host',
		dataIndex: 'host'
	},

	{
		title: '登录时间',
		key: 'startTimestamp',
		dataIndex: 'startTimestamp'
	},
	{
		title: '最后访问时间',
		key: 'lastAccessTime',
		dataIndex: 'lastAccessTime'
	},
	// {
	// 	title: '过期时间',
	// 	key: 'timeout',
	// 	dataIndex: 'timeout'
	// },
	{
		title: '状态',
		key: 'status',
		dataIndex: 'status',
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
import moment from 'moment';
export default {
	mixins:[rowSelection],
	components: {
		subPageView,
	},
	data() {
		return {
			columns: columns,
			filter: {},
			loadData: parameter => {
				//做一些异步操作
				return postAction(
					sysMoniterapi.getOnline,
					Object.assign(parameter, this.filter)
				).then(res => {
					return res;
				});
 			
			},
			superQueryFieldList: [
				{
					type: 'string',
					value: 'username',
					text: '用户名',
					defaultValue: ''
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
		showDeleteConfirm(delId) {
			let $me = this;
			this.$confirm({
				title: '是否强制该用户下线?',
				content: '',
				okText: '确定',
				cancelText: '取消',
				class: 'confirmbox',
				okType: 'danger',
				onOk() {
					$me.removeOnline(delId);
				},
				onCancel() {
				},
			});
		},
		/*删除*/
		removeOnline(delId) {
			postAction(
				sysMoniterapi.forceLogout, {
					id: delId
				}).then(res => {
				this.handlerRefresh();
			});
		},
	}
};
</script>

<style scoped="scoped" lang="less">
// .table-wrapper .operation {
// 			a {
// 				font-size: 20px;
// 				margin: 0 10px;
// 				&.del {
// 					color: #d43030;
// 				}
// 				&.add {
// 					color: #00baad;
// 				}
// 			}
// 		}
</style>
