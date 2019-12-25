<template>
	<div>
		<uploader :options="options" :file-status-text="statusText" class="uploader-example" ref="uploader" @file-complete="fileComplete"
		 @complete="complete" @file-added="onFileAdded">
			<uploader-unsupport></uploader-unsupport>
			<uploader-drop>
				<uploader-btn :single="true" style="" class="uploader-btn">点击选择文件</uploader-btn>
				<!-- <uploader-btn :attrs="attrs">选择图片</uploader-btn>
				<uploader-btn :directory="true">选择文件夹</uploader-btn> -->
			</uploader-drop>
			<uploader-list ref="uploader_list">
			</uploader-list>
		</uploader>
	</div>
</template>

<script>
	import SparkMD5 from 'spark-md5';
	let hasUploadFile = []; //已经上传过的文件，防止重复上传
	export default {
		data() {
			return {
				options: {
					target: '/upload', //上传地址
					withCredentials: true, //允许携带cookie
					testChunks: true, //服务端校验
					simultaneousUploads: 1,
					fileParameterName :'file',//文件的上传的参数名称
					chunkSize: 3 * 1024 * 1024, //分片大小
					checkChunkUploadedByResponse: function(chunk, message) {
						let objMessage = JSON.parse(message);
						if (objMessage.data.status.value == 101) { // 该文件没有上传过
							return false
						} else if (objMessage.data.status.value == 102) { // 如果102 ，返回未上传过的 chunkNumber 数组
							return (objMessage.data.result || []).indexOf(chunk.offset + 1) >= 0
						} else if (objMessage.data.status.value == 100) { // 该文件已经上传成功过了
							hasUploadFile.push(objMessage.data.result)
							return true;
						}

					}
				},
				statusText: {
					success: '成功了',
					error: '出错了',
					uploading: '上传中',
					paused: '暂停中',
					waiting: '等待中'
				},
				attrs: {
					accept: 'image/*'
				},
			}
		},
		methods: {
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
			// 上传完成
			complete() {
				console.log('complete', arguments)
			},
			// 全量 成功上传完成。
			fileComplete() {
				console.log('file complete', arguments)
				const identifier = arguments[0].uniqueIdentifier;
				const file = arguments[0].file;
				/* 上传成功后，合并文件 */
				this.uploadfile(file, identifier, 0);
			},
			uploadfile(file, identifier, type) {
				let that = this;
				if (hasUploadFile.indexOf(identifier) >= 0) {
					that.$message.success('文件已经上传过了');
					return false
				}
				/* TODO ,后台合并 文件 */
				that.$message.success('合并文件成功');
			},
		}
	}
</script>

<style>
</style>
