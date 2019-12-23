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
			<s-table class="mt20" bordered :columns="columns" :data="loadData" rowKey="id" ref="table" :scroll="{ x: 1300 }" size="small" :rowSelection="rowSelection">
				<a-tag :color="status==1?'#00a095':'#d43030'" slot="status" slot-scope="status">{{ status==1?'启用':'停用'}}</a-tag>
				<a-tag :color="isForceUpdate==1?'#00a095':'#d43030'" slot="isForceUpdate" slot-scope="isForceUpdate">{{ isForceUpdate==1?'是':'否' }}</a-tag>
				<span slot="operation" slot-scope="text" class="operation">
					<a href="javascript:;" title="下载全量文件" class="dowmloadall">下载全量文件</a>
					<a href="javascript:;" title="下载增量文件" class="dowmloadpart">下载增量文件</a>
				</span>
			</s-table>
		</div>
	</sub-page-view>
</template>

<script>
import subPageView from '@/layouts/subPageView';
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
		width: 240,
		fixed: 'right'
	}
];
import moment from 'moment';
export default {
	data() {
		return {
			columns: columns,
			loadData: parameter => {
				return new Promise(function(resolve, reject) {
					//做一些异步操作
					setTimeout(function() {
						console.log('执行完成');
						resolve({
							total: 1,
							rows: [
								{
									id: '310c8b5409a64465a9275de17d247185',
									fileType: null,
									currentVersion: 'V1.0.0.5',
									fullDownloadUrl: '/2019/08/1fb24dcd0dc49fe3993b7510b05975c9/1.0.0.5add.zip',
									incrDownloadUrl: '/2019/08/1fb24dcd0dc49fe3993b7510b05975c9/1.0.0.5add.zip',
									isForceUpdate: 0,
									sortOrder: null,
									status: 1,
									createUser: null,
									createTime: '2019-08-16 18:53:55',
									updateUser: null,
									updateTime: null,
									remark: '',
									delFlag: 1,
									fileTypeName: null
								}
							]
						});
					}, 2000);
				});
				// 				return postAction(
				// 					api.getAddressList,
				// 					Object.assign(parameter, {
				// 						data: { ...this.filter }
				// 					})
				// 				).then(res => {
				// 					return res.data;
				// 				});
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
		handlerSearch() {}
	}
};
</script>

<style scoped="scoped" lang="less">
.table-wrapper .operation {
	a {
		// font-size: 20px;
		color: #fff;
		margin: 0 5px;
		padding:2px 5px;
		&.dowmloadpart {
			background: #f8ac59;
		}
		&.dowmloadall {
			background: #00baad;
		}
	}
}
</style>
