<template>
	<sub-page-view>
		<div class="viewlist">
			<!--筛选条件-->
			<div class="flex topbar">
				<filterbar @handlerSearch="handlerSearch" @handlerReset="handlerSearch" :field-list="superQueryFieldList" class="flex-1"></filterbar>
				<div class="handlerbtn">
					<a-button class="ant-btn-success" @click="addTopicQuestion()">添加</a-button>
					<a-button type="danger" @click="showDeleteConfirm(0)" :disabled="selectedRowKeys.length <= 0">删除</a-button>
				</div>
			</div>
			<!--表格-->
			<s-table class="mt20" bordered :columns="columns" :data="loadData" rowKey="id" ref="table" :scroll="{ x: 1300 }"
			 size="small" :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}">
				<span slot="operation" slot-scope="text,record" class="operation">
					<a href="javascript:;" title="编辑" class="edit" @click="editTopicQuestion(record)"><i class="material-icons icon iconfont">border_color</i></a>
					<a href="javascript:;" title="查看题目" class="add" @click="showDetails(record)"><i class="material-icons icon iconfont">assignment</i></a>
					<a href="javascript:;" title="删除" class="del" @click="showDeleteConfirm(1,record.id)"><i class="material-icons icon iconfont">delete</i></a>
				</span>
				<span slot="type" slot-scope="text,record">{{text=='common'?'普通试卷':'套题试卷'}}</span>
			</s-table>
		</div>
		<!-- 添加，编辑 -->
		<test-manage-modal ref="testManageModal" @ok="handlerRefresh"></test-manage-modal>
		<testdetails-modal ref="testdetailsModal"></testdetails-modal>
		<commontestdetails-modal ref="commontestdetailsModal"></commontestdetails-modal>
	</sub-page-view>
</template>

<script>
	import subPageView from '@/layouts/subPageView';
	import testManageModal from './module/testManageModal';
	import testdetailsModal from './module/testdetailsModal';
	import commontestdetailsModal from './module/commontestdetailsModal';
	import {
		infoManageapi,
		getAllSubjectList
	} from '../api';
	import {
		rowSelection
	} from '@/mixins';
	import {
		postAction
	} from '@/api';
	const columns = [{
			title: '试卷标题',
			key: 'titleName',
			dataIndex: 'titleName'
		}, {
			title: '老师名称',
			dataIndex: 'teacAssistantName',
			key: 'teacAssistantName',
			width: 180
		},
		{
			title: '所属机构',
			dataIndex: 'organizationName',
			key: 'organizationName',
			width: 180
		},
		{
			title: '班级名称',
			key: 'className',
			dataIndex: 'className'
		},
		{
			title: '科目',
			key: 'subjectName',
			dataIndex: 'subjectName'
		},
		{
			title: '试卷类型',
			key: 'type',
			dataIndex: 'type',
			scopedSlots: {
				customRender: 'type'
			},
		},

		{
			title: '上传时间',
			key: 'uploadDatetime',
			dataIndex: 'uploadDatetime'
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
						infoManageapi.getTestPaper,
						Object.assign(parameter, this.filter)
					).then(res => {
						return res;
					});

				},
				superQueryFieldList: [{
						type: 'string',
						value: 'className',
						text: '班级名称',
						defaultValue: ''
					}, {
						type: 'string',
						value: 'titleName',
						text: '试卷标题',
						defaultValue: null
					},
					{
						type: 'select',
						value: 'subjectCode',
						text: '科目',
						optionlist: [],
						defaultValue: -1
					},
					{
						type: 'select',
						value: 'type',
						text: '试卷类型',
						defaultValue: -1,
						optionlist: [{
							value: -1,
							text: '全部'

						}, {
							value: 'common',
							text: '普通试卷'
						}, {
							value: 'classify',
							text: '套题试卷'
						}]
					}
				],
			};
		},
		components: {
			subPageView,
			testManageModal,
			testdetailsModal,
			commontestdetailsModal
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
			getAllSubjectList().then(da => {
				let list = da.data;
				if (list && list.length > 0) {
					this.superQueryFieldList[2].optionlist = list.map(item => {
						return {
							value: item.value,
							text: item.name
						}
					})
					this.superQueryFieldList[2].optionlist.unshift({
						value: -1,
						text: '全部'
					})
				}

			});
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
							$me.removeTopic(delId);
						} else {
							$me.batchRemoveTopic();
						}
					},
					onCancel() {},
				});
			},
			/* 添加 */
			addTopicQuestion() {
				this.$refs.testManageModal.add();
				//this.visible=true;
			},
			/* 编辑 */
			editTopicQuestion(record) {
				this.$refs.testManageModal.edit(record);
			},
			/*删除*/
			removeTopic(delId) {
				postAction(
					infoManageapi.removeTestPaper, {
						id: delId
					}).then(res => {
					this.handlerRefresh();
				});
			},
			/*批量删除 */
			batchRemoveTopic() {
				postAction(
					infoManageapi.batchRemoveTestPaper, this.selectedRowKeys).then(res => {
					this.selectedRowKeys = [];
					this.handlerRefresh();
				});
			},
			showDetails(record) {
				if (record.type == 'common') {
					this.$refs.commontestdetailsModal.show(record);

				} else {
					this.$refs.testdetailsModal.show(record)
				}
			}
		}
	};
</script>

<style scoped="scoped" lang="less">
	.table-wrapper .operation {
		a {
			font-size: 20px;
			margin: 0 10px;
			line-height: 1;

			&.del {
				color: #d43030;
			}

			&.add {
				color: #00baad;
			}
		}
	}
</style>
