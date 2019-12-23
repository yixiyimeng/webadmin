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
				<a-tag :color="status==1?'#00a095':'#d43030'" slot="status" slot-scope="status">{{ status==1?'启用':'停用'}}</a-tag>
				<a-tag :color="isForceUpdate==1?'#00a095':'#d43030'" slot="isForceUpdate" slot-scope="isForceUpdate">{{ isForceUpdate==1?'是':'否' }}</a-tag>
				<span slot="operation" slot-scope="text" class="operation">
					<a href="javascript:;" title="编辑" class="edit"><i class="material-icons icon iconfont">border_color</i></a>
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
		title: '当前版本',
		dataIndex: 'currentVersion',
		key: 'value',
		width: 180
	},
	{
		title: '是否强制升级',
		key: 'isForceUpdate',
		dataIndex: 'isForceUpdate',
		scopedSlots: {
			customRender: 'isForceUpdate'
		}
	},
	{
		title: '状态',
		key: 'status',
		dataIndex: 'status',
		scopedSlots: {
			customRender: 'status'
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
import moment from 'moment';
export default {
	data() {
		return {
			columns: columns,
				loadData: parameter => {
					//做一些异步操作
					return postAction(
						workManageapi.getselfList,
						Object.assign(parameter, this.filter)
					).then(res => {
						return res;
					});
					
				},
			superQueryFieldList: [
				{
					type: 'string',
					value: 'currentVersion',
					text: '版本',
					defaultValue: ''
				},
			   {
					type: 'select',
					value: 'isForceUpdate',
					text: '是否强制升级',
					defaultValue: '',
					optionlist: [{ value: '', text: '全部' }, { value: 0, text: '否' }, { value: 1, text: '是' }]
				},
				{
					type: 'select',
					value: 'status',
					text: '状态',
					defaultValue: '',
					optionlist: [{ value: '', text: '全部' }, { value: 0, text: '停用' }, { value: 1, text: '启用' }]
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
