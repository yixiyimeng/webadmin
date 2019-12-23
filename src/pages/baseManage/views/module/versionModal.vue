<template>
	<a-modal :title="title" :width="800" :visible="visible" :confirmLoading="confirmLoading" @ok="handleOk" @cancel="handleCancel"
	 :destroyOnClose="true" :afterClose="afterClose" :bodyStyle="{maxHeight:'400px',overflow:'auto'}" :maskClosable="false">
		<a-spin :spinning='confirmLoading'>
			<a-form :form="form" autocomplete="off">
				<a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="当前版本">
					<a-input placeholder="当前版本" v-decorator="[ 'currentVersion', {rules: [{ required: true, message: '当前版本' }]} ]" />
				</a-form-item>
				<a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="强制升级">
					<a-select placeholder="是否强制升级" v-decorator="[ 'isForceUpdate', {rules: [{ required: true, message: '强制升级' }] }]">
						<a-select-option :value="1">是</a-select-option>
						<a-select-option :value="0">否</a-select-option>
					</a-select>
					<!-- <a-input placeholder="数据值" v-decorator="[ 'value', {rules: [{ required: true, message: '数据值' }] }]" /> -->
				</a-form-item>
				<a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="状态">
					<a-select placeholder="状态" v-decorator="[ 'status', {rules: [{ required: true, message: '状态' }] }]">
						<a-select-option :value="1">启用</a-select-option>
						<a-select-option :value="0">停用</a-select-option>
					</a-select>
				</a-form-item>
				<a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="Windown32全量文件" v-if="isAdd">
					<uploader :options="options" :file-status-text="statusText" class="uploader-example" ref="uploader" @file-complete="fileComplete32"
					 @complete="complete" @file-added="onFileAdded">
						<uploader-unsupport></uploader-unsupport>
						<uploader-drop>
							<uploader-btn :single="true" style="" class="uploader-btn">点击选择文件</uploader-btn>
						</uploader-drop>
						<uploader-list ref="uploader_list">
						</uploader-list>
					</uploader>
				</a-form-item>
				<a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="Windown32增量文件" v-if="isAdd">
					<uploader :options="options" :file-status-text="statusText" class="uploader-example" ref="uploader2"
					 @file-complete="incrfileComplete32" @complete="complete" @file-added="onFileAdded">
						<uploader-unsupport></uploader-unsupport>
						<uploader-drop>
							<uploader-btn :single="true" style="" class="uploader-btn">点击选择文件</uploader-btn>
						</uploader-drop>
						<uploader-list ref="uploader_list">
						</uploader-list>
					</uploader>
				</a-form-item>
				<a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="Windown64全量文件" v-if="isAdd">
					<uploader :options="options" :file-status-text="statusText" class="uploader-example" ref="uploader" @file-complete="fileComplete64"
					 @complete="complete" @file-added="onFileAdded">
						<uploader-unsupport></uploader-unsupport>
						<uploader-drop>
							<uploader-btn :single="true" style="" class="uploader-btn">点击选择文件</uploader-btn>
						</uploader-drop>
						<uploader-list ref="uploader_list">
						</uploader-list>
					</uploader>
				</a-form-item>
				<a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="Windown64增量文件" v-if="isAdd">
					<uploader :options="options" :file-status-text="statusText" class="uploader-example" ref="uploader2"
					 @file-complete="incrfileComplete64" @complete="complete" @file-added="onFileAdded">
						<uploader-unsupport></uploader-unsupport>
						<uploader-drop>
							<uploader-btn :single="true" style="" class="uploader-btn">点击选择文件</uploader-btn>
						</uploader-drop>
						<uploader-list ref="uploader_list">
						</uploader-list>
					</uploader>
				</a-form-item>
				<!-- <div>fullFileIdentifier64:{{fullFileIdentifier64}}</div>
				<div>incrFileIdentifier64{{incrFileIdentifier64}}</div> -->
				<a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="版本说明">
					<a-textarea :rows="5" placeholder="请填写版本说明" v-decorator="[ 'remark', {rules: [{ required: true, message: '请填写版本说明' }] }]" />
				</a-form-item>
			</a-form>
		</a-spin>
	</a-modal>
</template>

<script>
	import SparkMD5 from 'spark-md5';
	import {
		baseManageapi
	} from '../../api'
	import {
		baseURL
	} from '@/utils/base'
	import {
		postAction
	} from '@/api'
	import pick from 'lodash.pick'
	let hasUploadFile = []; //已经上传过的文件，防止重复上传
	export default {
		name: "RoleModal",
		props: {
			hardwareVersion: {
				type: [String, Number],
				default: 46
			}
		},
		data() {
			return {
				labelCol: {
					xs: {
						span: 24
					},
					sm: {
						span: 5
					},
				},
				wrapperCol: {
					xs: {
						span: 24
					},
					sm: {
						span: 16
					},
				},
				visible: false,
				confirmLoading: false,
				mdl: {},
				form: this.$form.createForm(this),
				permissions: [],
				title: '新增',
				isAdd: true,
				fullfile: '',
				incrfile: '',
				incrFileIdentifier32: '',
				fullFileIdentifier32: '',
				incrFileIdentifier64: '',
				fullFileIdentifier64: '',
				afterClose: () => {
					this.confirmLoading = false;
					this.fileList = [];
					this.fullfile = '';
					this.incrfile = '';
					this.fullFileIdentifier32 = '';
					this.incrFileIdentifier32 = '';
					this.fullFileIdentifier64 = '';
					this.incrFileIdentifier64 = '';
					hasUploadFile = [];
					this.parameter = {}
				},
				parameter: {},
				options: {
					target: baseURL + baseManageapi.checkFile,
					withCredentials: true,
					testChunks: true,
					simultaneousUploads: 1,
					chunkSize: 3 * 1024 * 1024,
					checkChunkUploadedByResponse: function(chunk, message) {
						console.log('message', message);
						console.log('chunk', chunk);
						let objMessage = JSON.parse(message);
						if (objMessage.data.status.value == 101) {
							return false
						} else if (objMessage.data.status.value == 102) {
							return (objMessage.data.result || []).indexOf(chunk.offset + 1) >= 0
						} else if (objMessage.data.status.value == 100) {
							hasUploadFile.push(objMessage.data.result)
							return true;
						}

					}
				},
				attrs: {
					accept: 'image/*'
				},
				statusText: {
					success: '成功了',
					error: '出错了',
					uploading: '上传中',
					paused: '暂停中',
					waiting: '等待中'
				},

			}
		},
		created() {},
		computed: {
			// uploader() {
			// 	return this.$refs.uploader;
			// },
			// uploader2() {
			// 	return this.$refs.uploader2;
			// }
		},
		methods: {
			add() {
				this.title = '新增';
				this.isAdd = true;
				this.initInfo({
					isForceUpdate: 1,
					status: 1
				})
			},
			edit(record) {
				this.title = '编辑';
				this.isAdd = false;
				this.initInfo(record)

			},
			initInfo(record) {
				this.mdl = Object.assign({}, record)
				this.visible = true
				this.$nextTick(() => {
					this.form.setFieldsValue(pick(this.mdl, 'isForceUpdate', 'status', 'currentVersion', 'remark'))
				})
			},
			close() {
				this.$emit('close')
				this.visible = false
			},
			handleOk() {
				const _this = this;
				/*校验增量文件*/
				//console.log(!((this.fullFileIdentifier32&&this.incrFileIdentifier32)||(!this.fullFileIdentifier32&&!this.incrFileIdentifier32)))
				//console.log(!((this.fullFileIdentifier64&&this.incrFileIdentifier64)||(!this.fullFileIdentifier64&&!this.incrFileIdentifier64)))
				// return false;
				if ((!((this.fullFileIdentifier32 && this.incrFileIdentifier32) || (!this.fullFileIdentifier32 && !this.incrFileIdentifier32)) ||
						!((this.fullFileIdentifier64 && this.incrFileIdentifier64) || (!this.fullFileIdentifier64 && !this.incrFileIdentifier64)) ||
						(!this.fullFileIdentifier64 && !this.incrFileIdentifier64 && !this.fullFileIdentifier32 && !this.incrFileIdentifier32)
					) && this.isAdd) {
					this.$message.error('文件不能为空')
					return false;
				}
				// if ((!(!this.fullFileIdentifier32||!this.incrFileIdentifier32)||!(this.fullFileIdentifier64 && this.incrFileIdentifier64)) && this.isAdd) {
				// 	this.$message.error('文件不能为空')
				// 	return false;
				// }
				// 触发表单验证
				this.form.validateFields((err, values) => {
					// 验证表单没错误
					if (!err) {
						console.log('form values', values)
						_this.parameter = Object.assign({}, this.mdl, values);
						_this.confirmLoading = true;
						if (_this.isAdd) {
							_this.parameter.fullFileIdentifier32 = this.fullFileIdentifier32;
							_this.parameter.incrFileIdentifier32 = this.incrFileIdentifier32;
							_this.parameter.fullFileIdentifier64 = this.fullFileIdentifier64;
							_this.parameter.incrFileIdentifier64 = this.incrFileIdentifier64;
							_this.parameter.hardwareVersion = this.hardwareVersion;
							this.saveInfo();
						} else {
							this.saveInfo();
						}

					}
				})
			},
			saveInfo() {
				const _this = this;
				let url = _this.isAdd ? baseManageapi.addVersion : baseManageapi.updateVersion;
				postAction(url, this.parameter).then(res => {
					if (res && res.code == 0) {
						_this.$message.success('保存成功')
						_this.$emit('ok')
					}
				}).finally(() => {
					_this.confirmLoading = false
					_this.close()
				});
			},
			handleCancel() {
				this.close()
			},

			// 上传完成
			complete() {
				console.log('complete', arguments)
			},
			// 全量 成功上传完成。
			fileComplete32() {
				console.log('file complete', arguments)
				const identifier = arguments[0].uniqueIdentifier;
				const file = arguments[0].file;
				this.uploadfile(file, identifier, 0);
			},
			// 增量 成功上传完成。
			incrfileComplete32() {
				const identifier = arguments[0].uniqueIdentifier;
				const file = arguments[0].file;
				this.uploadfile(file, identifier, 1);

			},
			fileComplete64() {
				console.log('file complete', arguments)
				const identifier = arguments[0].uniqueIdentifier;
				const file = arguments[0].file;
				this.uploadfile(file, identifier, 2);
			},
			// 增量 成功上传完成。
			incrfileComplete64() {
				const identifier = arguments[0].uniqueIdentifier;
				const file = arguments[0].file;
				this.uploadfile(file, identifier, 3);

			},
			uploadfile(file, identifier, type) {
				let that = this;
				if (hasUploadFile.indexOf(identifier) >= 0) {
					that.$message.success(((type == 0 || type == 2) ? '全量' : '增量') + '文件已经上传过了');
					that.setFileIdentifier(type, identifier)
					return false
				}
				postAction(baseManageapi.mergeFile, {
					filename: file.name,
					identifier: identifier,
					totalSize: file.size,
					type: file.type
				}, {
					timeout: 40 * 1000
				}).then(function(response) {
					console.log('response', response)
					if (response && response.code == 0) {
						that.$message.success('合并' + (type == 0 ? '全量' : '增量') + '文件成功');
						that.setFileIdentifier(type, identifier)
					}
				}).catch(function(error) {
					console.log(error);
				});
			},
			setFileIdentifier(type, identifier) {
				let that = this;
				switch (type) {
					case 0:
						{
							that.fullFileIdentifier32 = identifier;
							break;
						}
					case 1:
						{
							that.incrFileIdentifier32 = identifier;
							break;
						}
					case 2:
						{
							that.fullFileIdentifier64 = identifier;
							break;
						}
					case 3:
						{
							that.incrFileIdentifier64 = identifier;
							break;
						}
				}
			},
			computeMD5(file) {
				var that = this;
				var fileReader = new FileReader();
				let time = new Date().getTime();
				let md5 = '';

				file.pause();

				fileReader.readAsArrayBuffer(file.file);
				fileReader.onload = function(e) {
					if (file.size != e.target.result.byteLength) {
						this.error('Browser reported success but could not read the file until the end.');
						console.log("文件读取失败");
						return false;
					}
					md5 = SparkMD5.ArrayBuffer.hash(e.target.result, false);
					console.log(`MD5计算完毕：${file.id} ${file.name} MD5：${md5} 用时：${new Date().getTime() - time} ms`);
					file.uniqueIdentifier = md5;
					file.resume();
				}

			},
			onFileAdded(file) {
				// 计算MD5，下文会提到
				this.computeMD5(file);
			},


		},
		// computed: {
		// 	//Uploader实例
		// 	uploader() {
		// 		return this.$refs.uploader.uploader;
		// 	}
		// },
		destroyed() {}
	}
</script>
<style lang="less" scoped="scoped">
	.webuploader-pick {
		padding: 0 15px;
	}

	.file-panel {
		width: 80%;
		margin-top: 10px;
		margin: 0 auto;

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
			overflow-y: auto;
			min-height: 100px;
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

	.uploader-btn {
		padding: 10px 15px;
		color: #fff;
		text-align: center;
		border-radius: 3px;
		overflow: hidden;
		background: #00b7ee;
		border: none;
	}

	.uploader-btn:hover {
		background: #00a2d4
	}
</style>
