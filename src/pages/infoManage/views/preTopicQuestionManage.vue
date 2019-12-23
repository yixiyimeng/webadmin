<template>
	<sub-page-view>
		<div class="viewlist">
			<!--筛选条件-->
			<div class="flex topbar">
				<filterbar @handlerSearch="handlerSearch" @handlerReset="handlerSearch" :field-list="superQueryFieldList" class="flex-1"></filterbar>
				<div class="handlerbtn">
					<!-- <a-button class="ant-btn-success" @click="addTopicQuestion()">添加</a-button> -->
					<a-button type="danger" @click="showDeleteConfirm(0)" :disabled="selectedRowKeys.length <= 0">删除</a-button>
				</div>
			</div>
			<!--表格-->
			<s-table class="mt20" bordered :columns="columns" :data="loadData" rowKey="id" ref="table" :scroll="{ x: 1300 }"
			 size="small" :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}">
			 <template slot="questionType" slot-scope="text,record">
				 {{text==1?'单题单选':(text==2?'单题多选':'判断题')}}
			 </template>
				<span slot="operation" slot-scope="text,record" class="operation">
					<a href="javascript:;" title="编辑" class="edit" @click="editTopicQuestion(record)"><i class="material-icons icon iconfont">border_color</i></a>
					<a href="javascript:;" title="删除" class="del" @click="showDeleteConfirm(1,record.id)"><i class="material-icons icon iconfont">delete</i></a>
				</span>
			</s-table>
		</div>
		<!-- 添加，编辑 -->
		<question-manage-modal ref="questionManageModal" @ok="handlerRefresh"></question-manage-modal>
	</sub-page-view>
</template>

<script>
	import subPageView from '@/layouts/subPageView';
	import QuestionManageModal from './module/questionManageModal';
	import {
		infoManageapi
	} from '../api';
	import {
		rowSelection
	} from '@/mixins';
	import {
		postAction
	} from '@/api';
	const columns = [{
			title: '试卷标题',
			dataIndex: 'titleName',
			key: 'titleName',
			width: 180
		},
		{
			title: '所属机构',
			dataIndex: 'organizationName',
			key: 'organizationName',
			width: 180
		},
		{
			title: '题号',
			key: 'questionId',
			dataIndex: 'questionId'
		},
		{
			title: '题目类型',
			key: 'questionType',
			dataIndex: 'questionType',
			scopedSlots: {
				customRender: 'questionType'
			},
		},
		{
			title: '正确答案',
			key: 'trueAnswer',
			dataIndex: 'trueAnswer'
		},
		{
			title: '分值',
			key: 'score',
			dataIndex: 'score'
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
		data() {
			return {
				columns: columns,
				loadData: parameter => {
					//做一些异步操作
					return postAction(
						infoManageapi.getTopicQuestionList,
						Object.assign(parameter, this.filter)
					).then(res => {
						return res;
					});

				},
				superQueryFieldList: [{
					type: 'string',
					value: 'titleName',
					text: '试卷标题',
					defaultValue: null
				}],
				rowSelection: {}
			};
		},
		components: {
			subPageView,
			QuestionManageModal
		},
		created() {
			/* 判断用户是否是管理员 */
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
							$me.removeTopicQuestion(delId);
						} else {
							$me.batchRemoveTopicQuestion();
						}
					},
					onCancel() {},
				});
			},
			/* 添加 */
			addTopicQuestion() {
				this.$refs.questionManageModal.add();
				//this.visible=true;
			},
			/* 编辑 */
			editTopicQuestion(record) {
				this.$refs.questionManageModal.edit(record);
			},
			/*删除*/
			removeTopicQuestion(delId) {
				postAction(
					infoManageapi.removeTopicQuestion, {
						id: delId
					}).then(res => {
					this.handlerRefresh();
				});
			},
			/*批量删除 */
			batchRemoveTopicQuestion() {
				postAction(
					infoManageapi.batchRemoveTopicQuestion, this.selectedRowKeys).then(res => {
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
