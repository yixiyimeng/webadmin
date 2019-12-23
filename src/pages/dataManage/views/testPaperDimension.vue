<template>
	<sub-page-view>
		<div class="viewlist">
			<!--筛选条件-->
			<div class="flex topbar">
				<testfilterbar  @handlerSearch="handlerSearch" @handlerReset="handlerSearch" class="flex-1"></testfilterbar>
				<div class="handlerbtn">
					<a-button type="danger" v-has="'inte:testPaperRec:batchRemove'" @click="showDeleteConfirm(0)" :disabled="selectedRowKeys.length <= 0">删除</a-button>
				</div>
			</div>

			<!--表格-->
			<s-table class="mt20" bordered :columns="columns" :data="loadData" rowKey="id" ref="table" :scroll="{ x: 1300 }"
			 size="small" :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}">
				<span slot="serial" slot-scope="text, record, index">
					{{ index + 1 }}
				</span>
				<span slot="operation" slot-scope="text,record" class="operation">
					<a href="javascript:;"  @click="showStuDetail(record)"><i
						 class="material-icons icon iconfont">explore</i></a>
					<a href="javascript:;" title="删除" class="del" v-has="'inte:testPaperRec:remove'" @click="showDeleteConfirm(1,record.id)"><i
						 class="material-icons icon iconfont">delete</i></a>
				</span>
			</s-table>

			<!-- <a-table bordered :columns="columns" :dataSource="dataSource" rowKey="stuCode" ref="table" :scroll="{ x: 1300 }"
			 size="small" :pagination="false" v-show="!isRate" class="table-wrapper" :loading="loading">
				<a href="javascript:;" slot="stuName" slot-scope="text, record, index" @click="showStuDetail(record)">{{text}}</a>
				<span slot="serial" slot-scope="text, record, index" v-if="index<dataSource.length-1">
					{{ index + 1 }}
				</span>
				<span :slot="item.key" v-for="(item,index) in titleNames" :key="index" slot-scope="text, record" :style="{color:text.split('|')[1]=='true'?'#00a095':'#d43030'}">{{text.split('|')[0]}}</span>
			</a-table> -->
			<div class="echartbox" v-show="isRate">
				<v-chart theme="ovilia-green" :options="ratepolar" class="echart" autoresize />
				<v-chart theme="ovilia-green" :options="countpolar" class="echart" autoresize />
			</div>
		</div>
		<!-- 学生详情 -->
		<testdetails ref="testdetails"></testdetails>
	</sub-page-view>
</template>

<script>
	import subPageView from '@/layouts/subPageView';
	import testfilterbar from '@/components/filterbar/testfilterbar'
	import testdetails from './module/testdetails'
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
			title: '科目',
			key: 'subjectName',
			dataIndex: 'subjectName',
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
			title: '试卷名称',
			dataIndex: 'titleName',
		
		},
		{
			title: '随堂检测时间',
			dataIndex: 'startDatetime',
		
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
			testfilterbar,
			'vChart': ECharts,
			testdetails
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
				ratepolar: {},
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
					dataManageapi.gettestPaperReclist,
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
					dataManageapi.removetestPaperList, {
						id: delId
					}).then(res => {
						this.$refs.table.refresh();
					// this.handlerRefresh();
				});
			},
			/*批量删除 */
			batchRemoveUserList() {
				postAction(
					dataManageapi.batchRemovetestPaperList, this.selectedRowKeys).then(res => {
					this.selectedRowKeys = [];
					this.$refs.table.refresh();
					// this.handlerRefresh();
				});
			},
			/* 查看详情 */
			showStuDetail(record) {
				this.$refs.testdetails.show(record)
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
