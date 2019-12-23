<template>
	<sub-page-view>
		<div class="viewlist">
			<!--筛选条件-->
			<div class="flex topbar">
				<filterbar ref="filterbar" @handlerSearch="handlerSearch" @handlerReset="handlerSearch" :field-list="superQueryFieldList"
				 class="flex-1"></filterbar>
				<div class="handlerbtn" style="width: auto;">
					<a-button :type="bit==64?'primary':'default'" @click="onChangebit(64)">windows64位</a-button>
					<a-button :type="bit==32?'primary':'default'" @click="onChangebit(32)">windows32位</a-button>
					<!-- <a-button class="ant-btn-success">添加</a-button>
					<a-button type="danger">删除</a-button> -->
				</div>
			</div>
			<!--表格-->
			<s-table class="mt20" bordered :columns="columns" :data="loadData" rowKey="id" ref="table" :scroll="{ x: 1300 }"
			 size="small">
				<a-tag :color="status==1?'#00a095':'#d43030'" slot="status" slot-scope="status">{{ status==1?'启用':'停用'}}</a-tag>
				<a-tag :color="isForceUpdate==1?'#00a095':'#d43030'" slot="isForceUpdate" slot-scope="isForceUpdate">{{ isForceUpdate==1?'是':'否' }}</a-tag>
				<!-- <a-textarea slot="remark" slot-scope="remark" style="white-space: normal;height: auto; " v-model="remark"></a-textarea> -->
				<div slot="remark" v-html="remark" slot-scope="remark" style="white-space: normal;height: auto; "></div>
				<span slot="operation" slot-scope="text,record" class="operation">
					<a :href="fileUrl+record.fullDownloadUrl" title="下载全量文件" class="dowmloadall" :download="record.currentVersion+'全量文件'+record.fullFileType">下载全量文件</a>
					<a :href="fileUrl+record.incrDownloadUrl" title="下载增量文件" class="dowmloadpart" :download="record.currentVersion+'增量文件'+record.incrFileType">下载增量文件</a>
				</span>
			</s-table>
		</div>
	</sub-page-view>
</template>

<script>
	import subPageView from '@/layouts/subPageView';
	import {
		baseManageapi
	} from '../api';
	import {
		rowSelection
	} from '@/mixins';
	import {
		postAction
	} from '@/api';
	import {
		fileUrl
	} from '@/utils/base'
	const columns = [{
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
		// {
		// 	title: '状态',
		// 	key: 'status',
		// 	dataIndex: 'status',
		// 	scopedSlots: {
		// 		customRender: 'status'
		// 	}
		// },
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
			width: 260,
			fixed: 'right'
		}
	];
	import moment from 'moment';
	export default {
		mixins: [rowSelection],
		components: {
			subPageView
		},
		data() {
			return {
				columns: columns,
				hardwareVersion: '',
				bit: 64,
				loadData: parameter => {
					//做一些异步操作
					return postAction(
						baseManageapi.getVersionDownload,
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
							value: null,
							text: '全部'
						}, {
							value: 0,
							text: '否'
						}, {
							value: 1,
							text: '是'
						}]
					},
					// {
					// 	type: 'select',
					// 	value: 'status',
					// 	text: '状态',
					// 	defaultValue: null,
					// 	optionlist: [{
					// 		value: null,
					// 		text: '全部'
					// 	}, {
					// 		value: 0,
					// 		text: '停用'
					// 	}, {
					// 		value: 1,
					// 		text: '启用'
					// 	}]
					// }
				],
				rowSelection: {},
				fileUrl
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
						this.bit = 64;
						this.$refs.filterbar.reset();
						// this.$refs.table.refresh();
					})
					console.log(type);
				},
				deep: true,
				immediate: true
			}
		},
		components: {
			subPageView
		},
		methods: {
			handlerSearch(obj) {
				this.filter = obj;
				this.$refs.table.refresh();
			},
			onChangebit(bit) {
				this.bit = bit;
				this.$refs.table.refresh();
			}
		},
		filters: {
			filterName(val) {
				return val.split('/')[0]
			}
		}
	};
</script>

<style scoped="scoped" lang="less">
	.table-wrapper .operation {
		a {
			// font-size: 20px;
			color: #fff;
			margin: 0 5px !important;
			padding: 2px 5px;
			display: inline-block;
			line-height: 22px;
			font-size: 14px !important;
			border-radius: 2px;

			&.dowmloadpart {
				background: #f8ac59;
			}

			&.dowmloadall {
				background: #00baad;

			}
		}
	}
</style>
