<template>
	<sub-page-view>
		<div class="viewlist">
			<!--筛选条件-->
			<div class="flex topbar">
				<filterbar @handlerSearch="handlerSearch" @handlerReset="handlerSearch" :field-list="superQueryFieldList" class="flex-1"></filterbar>
				<div class="handlerbtn">
					<a-button class="ant-btn-success">添加</a-button>
					<a-button type="danger">删除</a-button>
				</div>
			</div>
			<!--表格-->
			<s-table class="mt20" bordered :columns="columns" :data="loadData" rowKey="id" ref="table" :scroll="{ x: 1300 }" size="middle" :rowSelection="rowSelection">
				<span slot="operation" slot-scope="text" class="operation">
					<a href="javascript:;" title="编辑" class="edit"><i class="material-icons icon iconfont">border_color</i></a>
					<a href="javascript:;" title="添加" class="add"><i class="material-icons icon iconfont">note_add</i></a>
					<a href="javascript:;" title="删除" class="del"><i class="material-icons icon iconfont">delete</i></a>
				</span>
			</s-table>
		</div>
	</sub-page-view>
</template>

<script>
	import subPageView from '@/layouts/subPageView';
	import {
		workManageapi
	} from '../api';
	import {
		rowSelection
	} from '@/mixins';
	import {
		postAction
	} from '@/api';
const columns = [
	{
		title: '标题',
		dataIndex: 'title',
		key: 'name',
		width: 180
	},
	{
		title: '类型',
		dataIndex: 'type',
		key: 'value',
		width: 180
	},
	{
		title: '状态',
		key: 'type',
		dataIndex: 'type'
	},

	{
		title: '备注信息',
		key: 'content',
		dataIndex: 'content'
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
	data() {
		return {
			columns: columns,
				loadData: parameter => {
					//做一些异步操作
					return postAction(
						workManageapi.getNotify,
						Object.assign(parameter, this.filter)
					).then(res => {
						return res;
					});
					
				},
			superQueryFieldList: [
				{
					type: 'string',
					value: 'name',
					text: '标签名',
					defaultValue: ''
				},
				{
					type: 'string',
					value: 'type',
					text: '类型',
					defaultValue: ''
				}
			],
			rowSelection: {}
		};
	},
	components: { subPageView },
	methods: {
		/*查询*/
		handlerSearch(obj) {
			this.filter = obj;
			this.$refs.table.refresh();
		},
		/* 刷新列表 */
		handlerRefresh() {
			this.$refs.table.refresh();
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
