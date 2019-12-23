<template>
	<sub-page-view>
		<div class="viewlist">
			<!--筛选条件-->
			<div class="flex topbar">
				<filterbar ref="filterbar" @handlerSearch="handlerSearch" @handlerReset="handlerSearch" :field-list="superQueryFieldList" class="flex-1"></filterbar>
				<div class="handlerbtn" style="width: auto;">
					<a-button :type="bit==64?'primary':'default'" @click="onChangebit(64)">windows64位</a-button>
					<a-button :type="bit==32?'primary':'default'" @click="onChangebit(32)">windows32位</a-button>
					<a-button class="ant-btn-success" v-has="'common:versionManage:add'" @click="addVersionManage()">添加</a-button>
					<a-button type="danger" v-has="'common:versionManage:batchRemove'" @click="showDeleteConfirm(0)" :disabled="selectedRowKeys.length <= 0">删除</a-button>
				</div>
			</div>
			<s-table class="mt20" bordered :columns="columns" :data="loadData" rowKey="id" ref="table" :scroll="{ x: 1300 }"
			 size="small" :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}">
				<div slot="remark" v-html="remark" slot-scope="remark" style="white-space: normal;height: auto; "></div>
				<a-tag :color="status==1?'#00a095':'#d43030'" slot="status" slot-scope="status">{{ status==1?'启用':'停用'}}</a-tag>
				<a-tag :color="isForceUpdate==1?'#00a095':'#d43030'" slot="isForceUpdate" slot-scope="isForceUpdate">{{ isForceUpdate==1?'是':'否' }}</a-tag>
				<span slot="operation" slot-scope="text, record" class="operation">
					<a href="javascript:;" title="编辑" class="edit" v-has="'common:versionManage:edit'" @click="editVersionManage(record)"><i
						 class="material-icons icon iconfont">border_color</i></a>
					<a href="javascript:;" title="删除" class="del" v-has="'common:versionManage:remove'" @click="showDeleteConfirm(1,record.id)"><i
						 class="material-icons icon iconfont">delete</i></a>
				</span>
			</s-table>

		</div>
		<!-- 添加，编辑 -->
		<version-modal ref="versionManageModal" @ok="handlerRefresh" :hardwareVersion="hardwareVersion"></version-modal>
	</sub-page-view>
</template>

<script>
	import subPageView from '@/layouts/subPageView';
	import VersionManageModal from './module/VersionManageModal';
	import versionModal from './module/versionModal';
	import {
		rowSelection
	} from '@/mixins';
	import {
		baseManageapi
	} from '../api'
	import {
		postAction
	} from '@/api';
	import {
		baseURL
	} from '@/utils/base'
	const columns = [{
			title: '当前版本',
			dataIndex: 'currentVersion',
			key: 'value'
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
			title: '版本说明',
			key: 'remark',
			dataIndex: 'remark',
			scopedSlots: {
				customRender: 'remark'
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
	export default {
		mixins: [rowSelection],
		components: {
			subPageView,
			VersionManageModal,
			versionModal
		},
		data() {
			return {
				columns: columns,
				loadData: parameter => {
					//做一些异步操作
					return postAction(
						baseManageapi.getVersionManage,
						Object.assign(parameter, this.filter, {
							hardwareVersion: this.hardwareVersion,
							bit: this.bit
						})
					).then(res => {
						return res;
					});
				},
				superQueryFieldList: [{
						type: 'string',
						value: 'currentVersion',
						text: '版本',
						defaultValue: ''
					},
					{
						type: 'select',
						value: 'isForceUpdate',
						text: '强制升级',
						defaultValue: null,
						optionlist: [{
							value: -1,
							text: '全部'
						}, {
							value: 0,
							text: '否'
						}, {
							value: 1,
							text: '是'
						}]
					},
					{
						type: 'select',
						value: 'status',
						text: '状态',
						defaultValue: null,
						optionlist: [{
							value: -1,
							text: '全部'
						}, {
							value: 0,
							text: '停用'
						}, {
							value: 1,
							text: '启用'
						}]
					}
				],
				selectedRowKeys: [],
				checkFileMd5: baseURL + baseManageapi.checkFileMd5,
				hardwareVersion: '',
				bit: 64

			};
		},
		watch: {
			$route: {
				handler: function(val, oldVal) {
					let type = ''
					if (this.$route.path.split('/').length > 0) {
						type = this.$route.path.split('/')[this.$route.path.split('/').length - 1];
					}
					this.hardwareVersion = type;
					this.$nextTick(() => {
						this.bit=64;
						this.$refs.filterbar.reset();
					})
					console.log(type);
				},
				deep: true,
				immediate: true
			}
		},
		created() {

		},
		methods: {
			/* 查询 */
			handlerSearch(obj) {
				this.filter = obj;
				this.$refs.table.refresh();
			},
			/* 刷新列表 */
			handlerRefresh() {
				console.log('刷新')
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
							$me.removeVersionManage(delId);
						} else {
							$me.batchRemoveVersionManage();
						}
					},
					onCancel() {
						console.log('Cancel');
					},
				});
			},
			/* 添加 */
			addVersionManage() {
				this.$refs.versionManageModal.add();
				//this.visible=true;
			},
			/* 编辑 */
			editVersionManage(record) {
				this.$refs.versionManageModal.edit(record);
			},
			/*删除*/
			removeVersionManage(delId) {
				postAction(
					baseManageapi.removeVersionManage, {
						id: delId
					}).then(res => {
					this.handlerRefresh();
				});
			},
			/*批量删除 */
			batchRemoveVersionManage() {
				postAction(
					baseManageapi.batchRemoveVersionManage, this.selectedRowKeys).then(res => {
					this.selectedRowKeys = [];
					this.handlerRefresh();
				});
			},
			onChangebit(bit) {
				this.bit = bit;
				this.handlerRefresh()
			}
		},

		mounted() {

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

	.uploader-example {
		width: 880px;
		padding: 15px;
		margin: 40px auto 0;
		font-size: 12px;
		box-shadow: 0 0 10px rgba(0, 0, 0, .4);
	}

	.uploader-example .uploader-btn {
		margin-right: 4px;
	}

	.uploader-example .uploader-list {
		max-height: 440px;
		overflow: auto;
		overflow-x: hidden;
		overflow-y: auto;
	}
</style>
