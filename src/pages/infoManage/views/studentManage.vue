<template>
	<sub-page-view>
		<div class="viewlist">
			<!--筛选条件-->
			<div class="flex topbar">
				<filterbar @handlerSearch="handlerSearch" @handlerReset="handlerSearch" :field-list="superQueryFieldList" class="flex-1"></filterbar>
				<div class="handlerbtn">
					<a-button class="ant-btn-primary" @click="uploadStudent()">导入</a-button>
					<a-button class="ant-btn-success" v-has="'foun:student:add'" @click="addTopicStudent()">添加</a-button>
					<a-button type="danger" v-has="'foun:student:batchRemove'" @click="showDeleteConfirm(0)" :disabled="selectedRowKeys.length <= 0">删除</a-button>
				</div>
			</div>
			<!--表格-->
			<s-table class="mt20" bordered :columns="columns" :data="loadData" rowKey="id" ref="table" :scroll="{ x: 1300 }"
			 size="small" :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}">
				<a-tag :color="state==1?'#00a095':'#d43030'" slot="state" slot-scope="state">{{ state==1?'启用':'停用'}}</a-tag>
				<a-tag slot="sex" slot-scope="sex">{{ sex == 1?'男':'女'}}</a-tag>
				<span slot="operation" slot-scope="text,record" class="operation">
					<a href="javascript:;" title="编辑" class="edit" v-has="'foun:student:edit'" @click="editTopicStudent(record)"><i
						 class="material-icons icon iconfont">border_color</i></a>
					<a href="javascript:;" title="删除" class="del" v-has="'foun:student:remove'" @click="showDeleteConfirm(1,record.id)"><i
						 class="material-icons icon iconfont">delete</i></a>
				</span>
			</s-table>
		</div>
		<!-- 上传 -->
		<student-upload-modal ref="studentUploadModal" @ok="handlerRefresh"></student-upload-modal>
		<!-- 添加，编辑 -->
		<student-manage-modal ref="studentManageModal" @ok="handlerRefresh"></student-manage-modal>
	</sub-page-view>
</template>

<script>
	import subPageView from '@/layouts/subPageView';
	import StudentManageModal from './module/studentManageModal';
	import StudentUploadModal from './module/studentUploadModal';
	import {
		infoManageapi,
		getAllorgList
	} from '../api';
	import {
		rowSelection
	} from '@/mixins';
	import {
		postAction
	} from '@/api';
	const columns = [{
			title: '学生姓名',
			dataIndex: 'stuName',
			key: 'stuName',
			width: 180
		},
		{
			title: '所属机构',
			dataIndex: 'organizationName',
			key: 'organizationName',
			width: 180
		},
		{
			title: '所属校区名称',
			key: 'schoolName',
			dataIndex: 'schoolName'
		},
		{
			title: '所属班级名称',
			key: 'className',
			dataIndex: 'className'
		},
		// {
		// 	title: '状态',
		// 	key: 'state',
		// 	dataIndex: 'state',
		// 	scopedSlots: {
		// 		customRender: 'state'
		// 	}
		// },
		{
			title: '性别',
			key: 'sex',
			dataIndex: 'sex',
			scopedSlots: {
				customRender: 'sex'
			}
		},
		{
			title: '手机号',
			key: 'phoneNum',
			dataIndex: 'phoneNum'
		},
		// {
		// 	title: '紧急联系人姓名',
		// 	key: 'emergencyContactPerson',
		// 	dataIndex: 'emergencyContactPerson'
		// },
		// {
		// 	title: '紧急联系人电话',
		// 	key: 'emergencyContactNum',
		// 	dataIndex: 'emergencyContactNum'
		// },
		{
			title: '出生年月',
			key: 'birthdate',
			dataIndex: 'birthdate'
		},
		// {
		// 	title: '地址详情',
		// 	key: 'addressDetail',
		// 	dataIndex: 'addressDetail'
		// },
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
	const superQueryFieldList = [{
			type: 'select',
			value: 'organization',
			text: '所属机构',
			defaultValue: '',
			optionlist: []
		},
		{
			type: 'string',
			value: 'schoolName',
			text: '校区名称',
			defaultValue: ''
		},
		{
			type: 'string',
			value: 'className',
			text: '班级名称',
			defaultValue: ''
		},
		{
			type: 'string',
			value: 'stuName',
			text: '学生名称',
			defaultValue: ''
		},
		{
			type: 'select',
			value: 'sex',
			text: '性别',
			defaultValue: -1,
			optionlist: [{
				value: -1,
				text: '全部'
			}, {
				value: 0,
				text: '女'
			}, {
				value: 1,
				text: '男'
			}]
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
						infoManageapi.getStudent,
						Object.assign(parameter, this.filter)
					).then(res => {
						return res;
					});

				},
				superQueryFieldList: superQueryFieldList,
				rowSelection: {},
				orgList: []
			};
		},
		created() {
			/* 判断用户是否是管理员 */
			try {
				if (JSON.parse(localStorage.getItem('userInfo')).roleSign == 'admin') {
					this.isUserAdminRole = true;
					this.getAllorgList();
				} else {
					this.columns = columns.filter(item => {
						if (item.dataIndex != 'organizationName') {
							return item
						}
					})
					this.superQueryFieldList = superQueryFieldList.filter(item => {
						if (item.value != 'organization') {
							return item
						}
					})
				}
			} catch (e) {
				//TODO handle the exception
			}
		},
		components: {
			subPageView,
			StudentManageModal,
			StudentUploadModal
		},
		methods: {
			/*查询所有机构*/
			getAllorgList() {
				getAllorgList().then(da => {
					this.orgList = [];
					if (da.data && da.data.length > 0) {
						this.orgList = da.data.map(item => {
							return {
								value: item.code,
								text: item.name
							}
						});
					}
					this.orgList.unshift({
						value: '',
						text: '全部'
					});
					this.superQueryFieldList[0].optionlist = this.orgList;
				})

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
							$me.removeStudent(delId);
						} else {
							$me.batchRemoveStudent();
						}
					},
					onCancel() {},
				});
			},
			/*上传*/
			uploadStudent() {
				this.$refs.studentUploadModal.uploadStudent();
			},
			/* 添加 */
			addTopicStudent() {
				this.$refs.studentManageModal.add();
				//this.visible=true;
			},
			/* 编辑 */
			editTopicStudent(record) {
				this.$refs.studentManageModal.edit(record);
			},
			/*删除*/
			removeStudent(delId) {
				postAction(
					infoManageapi.removeStudent, {
						id: delId
					}).then(res => {
					this.handlerRefresh();
				});
			},
			/*批量删除 */
			batchRemoveStudent() {
				postAction(
					infoManageapi.batchRemoveStudent, this.selectedRowKeys).then(res => {
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
