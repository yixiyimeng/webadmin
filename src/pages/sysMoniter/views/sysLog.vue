<template>
	<sub-page-view>
		<div class="viewlist">
			<!--筛选条件-->
			<div class="flex topbar">
				<filterbar @handlerSearch="handlerSearch" @handlerReset="handlerSearch" :field-list="superQueryFieldList" class="flex-1"></filterbar>
				<div class="handlerbtn">
					<a-button type="danger"  @click="showDeleteConfirm(0)" :disabled="selectedRowKeys.length <= 0">删除</a-button>
				</div>
			</div>
			<!--表格-->
			<s-table class="mt20" bordered :columns="columns" :data="loadData" rowKey="id" ref="table" :scroll="{ x: 1300 }"
			 size="small" :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}">
			 <span slot="operationtype" slot-scope="text, record">
			 	{{text|filtername}}
			 </span>
				<span slot="action" slot-scope="text, record" class="operation">
					<a href="javascript:;" title="删除" class="del" @click="showDeleteConfirm(1,record.id)"><i
						 class="material-icons icon iconfont">delete</i></a>
				</span>
			</s-table>
		</div>
	</sub-page-view>
</template>

<script>
import subPageView from '@/layouts/subPageView';
import {
		rowSelection
	} from '@/mixins'
import {
	sysMoniterapi
} from '../api'
import {
	postAction
} from '@/api'
const columns = [
	{
		title: '序号',
		dataIndex: 'id',
		key: 'id',
		width: 120
	},
	// {
	// 	title: '用户id',
	// 	dataIndex: 'userId',
	// 	key: 'userId',
	// 	width: 180
	// },
	{
		title: '用户名',
		key: 'username',
		dataIndex: 'username'
	},

	// {
	// 	title: '标题',
	// 	key: 'title',
	// 	dataIndex: 'title'
	// },
	{
		title: '操作IP',
		key: 'ip',
		dataIndex: 'ip'
	},
	{
		title: '操作时间',
		key: 'gmtCreate',
		dataIndex: 'gmtCreate'
	},
	{
		title: '操作类型',
		key: 'type',
		dataIndex: 'type',
		scopedSlots: {
			customRender: 'operationtype'
		},
	},
	{
		title: '操作',
		key: 'operation',
		dataIndex: 'operation',
		
	},
	{
		title: '用时',
		key: 'time',
		dataIndex: 'time'
	},
	{
		title: '请求地址',
		key: 'http',
		dataIndex: 'http'
	},
	{
		title: '方法',
		key: 'method',
		dataIndex: 'method'
	},
	{
		title: '操作',
		key: 'action',
		dataIndex: 'action',
		scopedSlots: {
			customRender: 'action'
		},
		align: 'center',
		width: 160,
		fixed: 'right'
	}
];
import moment from 'moment';
export default {
	mixins:[rowSelection],
	components: { subPageView },
	data() {
		return {
			columns: columns,
			filter: {},
			loadData: parameter => {
				//做一些异步操作
				return postAction(
					sysMoniterapi.getLog,
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
				},
			   {
					type: 'select',
					value: 'type',
					text: '操作',
					defaultValue: '',
					optionlist: [{ value: '', text: '全部' }, { value: 0, text: '否' }, { value: 1, text: '是' }]
				},
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
					if (type == 1) {
						$me.removeLog(delId);
					} else {
						$me.batchRemoveLog();
					}
				},
				onCancel() {
				},
			});
		},
		/*删除*/
		removeLog(delId) {
			postAction(
				sysMoniterapi.removeLog, {
					id: delId
				}).then(res => {
				this.handlerRefresh();
			});
		},
		/*批量删除 */
		batchRemoveLog() {
			postAction(
				sysMoniterapi.batchRemoveLog, this.selectedRowKeys).then(res => {
				this.selectedRowKeys = [];
				this.handlerRefresh();
			});
		},
	},
	filters:{
		filtername:function(value){
			let txt=''
			switch (value){
				case 'R':{
					txt= '查询';
					break;
				}	case 'C':{
					txt= '保存';
					break;
				}	case 'U':{
					txt= '更新';
					break;
				}	case 'D':{
					txt= '删除 ';
					break;
				}
			}
			return txt
		}
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
