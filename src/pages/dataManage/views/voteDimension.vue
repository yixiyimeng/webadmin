<template>
	<sub-page-view>
		<div class="viewlist">
			<!--筛选条件-->
			<div class="flex topbar">
				<votefilterbar @handlerSearch="handlerSearch" @handlerReset="handlerSearch" class="flex-1"></votefilterbar>
				<div class="handlerbtn">
					<a-button type="danger" v-has="'inte:voteScoreTitle:batchRemove'" @click="showDeleteConfirm(0)" :disabled="selectedRowKeys.length <= 0">删除</a-button>
				</div>
			</div>

			<!-- 	<div class="tip">主题: <span>{{topicName}}</span>讲师: <span>{{teacherName}}</span>创建时间: <span>{{createDate}}</span>班级名称:
				<span>{{className}}</span>答题人数: <span>{{totalStu}}</span></div> -->
			<!--表格-->
			<s-table class="mt20" bordered :columns="columns" :data="loadData" rowKey="id" ref="table" :scroll="{ x: 1300 }"
			 size="small" :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}" >
				<span slot="serial" slot-scope="text, record, index">
					{{ index + 1 }}
				</span>
				<span slot="questionType" slot-scope="text, record, index">{{text==6?'评分':'投票'}}</span>
				<span slot="operation" slot-scope="text,record" class="operation">
					<a href="javascript:;" @click="showStuDetail(record)"><i class="material-icons icon iconfont">explore</i></a>
					<a href="javascript:;" title="删除" class="del" v-has="'inte:voteScoreTitle:remove'" @click="showDeleteConfirm(1,record.id)"><i
						 class="material-icons icon iconfont">delete</i></a>
				</span>
			</s-table>

			<!-- <a-table bordered :columns="columns" :dataSource="dataSource" rowKey="stuCode" ref="table" :scroll="{ x: 1300 }"
			 size="small" :pagination="false"  class="table-wrapper mt20" :loading="loading">
				<a href="javascript:;" slot="stuName" slot-scope="text, record, index" @click="showStuDetail(record)">{{text}}</a>
				<span slot="serial" slot-scope="text, record, index" v-if="index<dataSource.length-1">
					{{ index + 1 }}
				</span>
				<span slot="questionType" slot-scope="text, record, index">{{text==6?'评分':'投票'}}</span>
			</a-table> -->
			
		</div>
		<!-- 学生详情 -->
		<votedetails ref="votedetails"></votedetails>
	</sub-page-view>
</template>

<script>
	import subPageView from '@/layouts/subPageView';
	import votefilterbar from '@/components/filterbar/votefilterbar'
	import votedetails from './module/votedetails'
	import ECharts from 'vue-echarts'
	import 'echarts/lib/chart/bar'
	import 'echarts/lib/component/tooltip'
	import 'echarts/lib/component/polar'
	import 'echarts/lib/component/legend'
	import 'echarts/lib/component/title.js'
	import theme from '@/assets/theme.json'
	ECharts.registerTheme('ovilia-green', theme);
	import pick from 'lodash.pick'
	import {
		dataManageapi
	} from '../api';
	import {
		rowSelection
	} from '@/mixins';
	import {
		postAction
	} from '@/api';
	import {
		fileUrl
	} from '@/utils/base.js';
	const columns = [{
			title: '#',
			scopedSlots: {
				customRender: 'serial'
			},
			align: 'center'
		}, {
			title: '机构名称',
			dataIndex: 'organizationName',
		},
		{
			title: '校区',
			key: 'schoolName',
			dataIndex: 'schoolName',
		},
		{
			title: '班级',
			key: 'className',
			dataIndex: 'className',
		},
		{
			title: '主题',
			dataIndex: 'topicName',
		},
		{
			title: '讲师',
			dataIndex: 'teacAssistantName',
		},
		{
			title: '类型',
			dataIndex: 'questionType',
			scopedSlots: {
				customRender: 'questionType'
			},
		},
		{
			title: '投票/评分主题',
			dataIndex: 'titleName',
		},
		{
			title: '开始时间',
			dataIndex: 'startDatetime',
			width: 180,
		},
		{
			title: '操作',
			scopedSlots: {
				customRender: 'operation'
			},
			width: 80,
		},

	];

	
	export default {
		mixins: [rowSelection],
		components: {
			subPageView,
			votefilterbar,
			'vChart': ECharts,
			votedetails
		},
		data() {
			return {
				columns: columns,
				topicName: '',
				teacherName: '',
				createDate: '',
				className: '',
				totalStu: '',
				dataSource: [],
				filter: {},
				titleNames: [],
				countpolar: {},
				isRate: false,
				loading: false
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
			loadData(parameter) {
				return postAction(
					dataManageapi.getVoteScorelist,
					Object.assign(parameter, this.filter)
				).then(res => {
					return res;
				});

			},
			/*查询*/
			handlerSearch(obj) {
				this.filter = obj;
				this.$refs.table.refresh();
			},
			/* 刷新列表 */
			handlerRefresh() {
				this.filter = {};
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
							$me.removeUserList(delId);
						} else {
							$me.batchRemoveUserList();
						}
					},
					onCancel() {},
				});
			},
			/*删除*/
			removeUserList(delId) {
				postAction(
					dataManageapi.removeVoteList, {
						id: delId
					}).then(res => {
					this.$refs.table.refresh();
				});
			},
			/*批量删除 */
			batchRemoveUserList() {
				postAction(
					dataManageapi.batchRemoveVoteList, this.selectedRowKeys).then(res => {
					this.selectedRowKeys = [];
					this.$refs.table.refresh();
				});
			},
			/* 查看详情 */
			showStuDetail(record) {
				this.$refs.votedetails.show(record)
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

	.tip {
		color: #676a6c;
		font-size: 14px;
		line-height: 30px;
		margin: 10px 10px 0;
	}

	.tip span {
		color: #125fc9;
		margin-right: 40px;
	}

	.echart {
		width: 100%;
		background: none;
	}
</style>
