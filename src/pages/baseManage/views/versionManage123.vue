<template>
	<sub-page-view>
		<div class="viewlist">
			<!--筛选条件-->
			<div class="flex topbar">
				<filterbar @handlerSearch="handlerSearch" @handlerReset="handlerSearch" :field-list="superQueryFieldList" class="flex-1"></filterbar>
				<div class="handlerbtn">
					<a-button class="ant-btn-success">添加</a-button>
					<a-button type="danger" :disabled="selectedRowKeys.length <= 0">删除</a-button>
				</div>
			</div>
			<!--表格-->
			<s-table class="mt20" bordered :columns="columns" :data="loadData" rowKey="id" ref="table" :scroll="{ x: 1300 }"
			 size="middle" :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}">
				<a-tag :color="status==1?'#00a095':'#d43030'" slot="status" slot-scope="status">{{ status==1?'启用':'停用'}}</a-tag>
				<a-tag :color="isForceUpdate==1?'#00a095':'#d43030'" slot="isForceUpdate" slot-scope="isForceUpdate">{{ isForceUpdate==1?'是':'否' }}</a-tag>
				<span slot="operation" slot-scope="text" class="operation">
					<a href="javascript:;" title="编辑" class="edit"><i class="material-icons icon iconfont">border_color</i></a>
					<a href="javascript:;" title="删除" class="del"><i class="material-icons icon iconfont">delete</i></a>
				</span>
			</s-table>
		</div>
		<div class="page">
			<div id="filePicker">选择文件</div>

			<div class="file-panel">
				<h2>文件列表</h2>
				<div class="file-list">
					<ul class="file-item" :class="`file-${file.id}`" v-for="file in fileList">
						<li class="file-type" :icon="fileCategory(file.ext)"></li>
						<li class="file-name">{{file.name}}</li>
						<li class="file-size">{{fileSize(file.size)}}</li>
						<li class="file-status">上传中...</li>
						<li class="file-operate">
							<a title="开始" @click="resume(file)"><i class="iconfont icon-control-play"></i></a>
							<a title="暂停" @click="stop(file)"><i class="iconfont icon-video-pause"></i></a>
							<a title="移除" @click="remove(file)"><i class="iconfont icon-close-big"></i></a>
						</li>
						<li class="progress"></li>
					</ul>
					<div class="no-file" v-if="!fileList.length"><i class="iconfont icon-empty-file"></i> 暂无待上传文件</div>
				</div>
			</div>

			<!-- <vue-upload ref="uploader" uploadButton="#filePicker" multiple @fileChange="fileChange" @progress="onProgress"
			 @success="onSuccess" :url="fileUpload" :md5url='checkFileMd5'></vue-upload> -->
			<!-- <vue-upload ref="fileUpload" :ext="ext" :countLimit="5" :tip="tip">aaa</vue-upload> -->
		</div>
	</sub-page-view>
</template>

<script>
	import subPageView from '@/layouts/subPageView';
	import {
		rowSelection
	} from '@/mixins'

	import {
		baseManageapi
	} from '../api'
	import {
		postAction
	} from '@/api'
	import {
		baseURL
	} from '@/utils/base'
	const columns = [{
			title: '当前版本',
			dataIndex: 'currentVersion',
			key: 'value'
		},
		{
			title: '强制升级',
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
	export default {
		mixins: [rowSelection],
		components: {
			subPageView,
			vueUpload
		},
		data() {
			return {
				columns: columns,
				loadData: parameter => {
					//做一些异步操作
					return postAction(
						baseManageapi.getVersionManage,
						Object.assign(parameter, this.filter)
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
						text: '是否强制升级',
						defaultValue: '',
						optionlist: [{
							value: '',
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
						defaultValue: '',
						optionlist: [{
							value: '',
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
				fileUpload: baseURL + baseManageapi.fileUpload,
				checkFileMd5: baseURL + baseManageapi.checkFileMd5,
				fileList: [],
				ext: 'png,jpg,jpeg,mp3,mp4,pdf',
				tip: '可上传png/jpg/jpeg/mp3/mp4/pdf，大小不超过200M'

			};
		},
		computed: {
			uploader() {
				return this.$refs.uploader;
			}
		},
		methods: {
			handlerSearch() {},
			fileChange(file) {
				if (!file.size) return;
				this.fileList.push(file);
				console.log(file);
			},
			onProgress(file, percent) {
				$(`.file-${file.id} .progress`).css('width', percent * 100 + '%');
				$(`.file-${file.id} .file-status`).html((percent * 100).toFixed(2) + '%');
			},
			onSuccess(file, response) {
				console.log('上传成功', file);
				// if (response.needMerge) {
				// 	// api.mergeUpload({
				// 	// 	tempName: response.tempName,
				// 	// 	fileName: file.name
				// 	// }).then(res => {
				// 	// 	let $fileStatus = $(`.file-${file.id} .file-status`);
				// 	// 	console.log(res);
				// 	// 	if (res.status === 0) {
				// 	// 		$fileStatus.html('上传成功，转码中');
				// 	// 	} else if (res.status === 1) {
				// 	// 		$fileStatus.html('上传失败');
				// 	// 	} else if (res.status === 2) {
				// 	// 		$fileStatus.html('上传成功');
				// 	// 	}
				// 	// });
				// }
			},
			resume(file) {
				this.uploader.upload(file);
			},
			stop(file) {
				this.uploader.stop(file);
			},
			remove(file) {
				// 取消并中断文件上传
				this.uploader.cancelFile(file);
				// 在队列中移除文件
				this.uploader.removeFile(file, true);
				// 在ui上移除
				let index = this.fileList.findIndex(ele => ele.id === file.id);
				this.fileList.splice(index, 1);
			},
			fileSize(size) {
				return WebUploader.Base.formatSize(size);
			},
			fileCategory(ext) {
				let type = '';
				const typeMap = {
					image: ['gif', 'jpg', 'jpeg', 'png', 'bmp', 'webp'],
					video: ['mp4', 'm3u8', 'rmvb', 'avi', 'swf', '3gp', 'mkv', 'flv'],
					text: ['doc', 'txt', 'docx', 'pages', 'epub', 'pdf', 'numbers', 'csv', 'xls', 'xlsx', 'keynote', 'ppt', 'pptx']
				};
				Object.keys(typeMap).forEach((_type) => {
					const extensions = typeMap[_type];
					if (extensions.indexOf(ext) > -1) {
						type = _type
					}
				});
				return type
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

	.file-panel {
		width: 840px;
		margin-top: 10px;
		box-shadow: 0 2px 12px 1px rgba(0, 0, 0, 0.1);

		>h2 {
			height: 40px;
			line-height: 40px;
			padding: 0 10px;
			border-radius: 4px 4px 0 0;
			border-bottom: 1px solid #ccc;
			background-color: #fff;
		}

		.file-list {
			position: relative;
			height: 360px;
			overflow-y: auto;
			background-color: rgb(250, 250, 250);
		}

		.file-item {
			position: relative;
			height: 50px;
			line-height: 50px;
			padding: 0 10px;
			border-bottom: 1px solid #ccc;
			background-color: #fff;
			z-index: 1;

			>li {
				display: inline-block;
			}
		}

		.file-type {
			width: 24px;
			height: 24px;
			vertical-align: -5px;
		}

		.file-name {
			width: 40%;
			margin-left: 10px;
		}

		.file-size {
			width: 20%;
		}

		.file-status {
			width: 20%;
		}

		.file-operate {
			width: 10%;

			>a {
				padding: 10px 5px;
				cursor: pointer;
				color: #666;

				&:hover {
					color: #ff4081;
				}
			}
		}

		// .file-type[icon=text] {
		//     background: url(../../assets/images/icon/text-icon.png);
		// }
		// .file-type[icon=video] {
		//     background: url(../../assets/images/icon/video-icon.png);
		// }
		// .file-type[icon=image] {
		//     background: url(../../assets/images/icon/image-icon.png);
		// }
		.progress {
			position: absolute;
			top: 0;
			left: 0;
			height: 49px;
			width: 0;
			background-color: #E2EDFE;
			z-index: -1;
		}

		.no-file {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			font-size: 16px;
		}
	}
</style>
