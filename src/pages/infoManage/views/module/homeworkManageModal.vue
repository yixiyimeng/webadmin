<template>

	<a-modal :title="title" :width="800" :visible="visible" :confirmLoading="confirmLoading" @ok="handleUpload" @cancel="handleCancel"
	 :destroyOnClose="true" :afterClose='afterClose' :maskClosable="false">
		<a-spin :spinning='confirmLoading'>
			<a-form :form="form" autocomplete="off">
				<a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="标题">
					<a-input placeholder="标题" v-decorator="[ 'titleName', {rules: [{ required: true, message: '标题' }]} ]" />
				</a-form-item>
				<a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="班级名称">
					<a-select v-decorator="[ 'classCode', {rules: [{ required: true, message: '班级名称' } ] }]">
						<a-select-option :value="item.code" v-for="(item,index) in classList" :key="index">{{item.name}}</a-select-option>
					</a-select>
				</a-form-item>
				<a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="科目">
					<a-select v-decorator="[ 'subjectCode', {rules: [{ required: true, message: '科目' } ] }]">
						<a-select-option :value="item.value" v-for="(item,index) in subjectList" :key="index">{{item.name}}</a-select-option>
					</a-select>
				</a-form-item>

				<a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="上传">
					<div class="flex flex-pack-justify flex-align-center">
						<a-upload name="file" :beforeUpload="beforeUpload" v-decorator="[ 'file', {rules: [{ required: isAdd, message: '上传文件' } ] }]"
						 :fileList="fileList">
							<a-button>
								<a-icon type="upload" /> 上传文件
							</a-button>
						</a-upload>
						<div>
							<a :href="fileUrl" class="ant-btn ant-btn-primary" download="课后作业模板.xlsx">
								<a-icon type="download" /><span>课后作业模板下载</span></a>
						</div>
					</div>
				</a-form-item>
				<a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="备注">
					<a-input placeholder="备注" v-decorator="[ 'remark']" />
				</a-form-item>
			</a-form>
		</a-spin>
	</a-modal>
</template>

<script>
	import {
		infoManageapi,
		getAllclassList,
		getAllSubjectList
	} from '../../api'
	import {
		postAction,
		postActionUpload
	} from '@/api'
	import pick from 'lodash.pick'
	import {
		baseURL
	} from '@/utils/base'
	export default {
		name: "RoleModal",
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
				classList: [],
				subjectList: [],
				fileList: [],
				// uploading: false,
				headers: {
					authorization: 'authorization-text',
				},
				afterClose: () => {
					this.confirmLoading = false;
					this.fileList = [];
					this.classList = [];
					this.subjectList = [];
				},
				baseURL,
				fileUrl: '', //模板地址
				fileUrl2: ''
			}
		},
		created() {
			this.fileUrl = baseURL + '/plat/files/test-template.xlsx'
		},
		methods: {
			add() {
				this.title = '新增课后作业';
				this.isAdd = true;
				this.initInfo({
					// id: 0
				})
			},
			edit(record) {
				this.title = '编辑课后作业';
				this.isAdd = false;
				this.initInfo(record)

			},
			initInfo(record) {
				this.getAllclassList();
				this.getAllSubjectList();
				this.mdl = Object.assign({}, record)
				this.visible = true
				this.$nextTick(() => {
					this.form.setFieldsValue(pick(this.mdl, 'classCode', 'subjectCode', 'titleName', 'file', 'remark'))
				})
			},
			close() {
				this.$emit('close')
				this.visible = false
			},
			/*上传文件*/
			beforeUpload(file) {
				// if (file.type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'||file.type=='application/vnd.ms-excel') {
				// 	this.fileList = [file]
				// }else{
				// 	this.$message.error('请选择Excel文件!');
				// }
				this.fileList = [file]
				return false;
			},
			handleUpload() {
				const _this = this;
				this.form.validateFields((err, values) => { // 验证表单没错误
					if (!err) {
						console.log('form values', values)
						let parameter = Object.assign({}, values);
						let className = '';
						let subjectName = '';
						for (let key in _this.classList) {
							if (parameter.classCode == _this.classList[key].code) {
								className = _this.classList[key].name
							}
						}
						for (let key in _this.subjectList) {
							if (parameter.subjectCode == _this.subjectList[key].value) {
								subjectName = _this.subjectList[key].name
							}
						}
						if (!_this.isAdd) {
							parameter.id = _this.mdl.id;
						
						}
						/* 设置默认type */
						parameter.type='common';
						_this.confirmLoading = true;
						const formData = new FormData();
						formData.append('className', className);
						formData.append('subjectName', subjectName);
						_this.fileList.forEach((file) => {
							formData.append('file', file);
						});
						for (let key in parameter) {
							if (parameter[key] && parameter[key] != undefined) {
								console.log(key, parameter[key])
								formData.append(key, parameter[key])
							}
						}
						postActionUpload(infoManageapi.uploadOfflineTestPaper, formData).then(res => {
							if (res.code == 0) {
								_this.$message.success('保存成功')
								_this.$emit('ok')
							}
						}).finally(() => {
							_this.confirmLoading = false
							_this.close()
						});
					}
				})
				// this.uploading = true;
			},
			handleCancel() {
				this.close()
			},
			/*查询班级*/
			getAllclassList() {
				getAllclassList().then(da => {
					this.classList = da.data;
				})
			},
			/*查询科目*/
			getAllSubjectList() {
				getAllSubjectList().then(da => {
					this.subjectList = da.data;
				})
			},
			

		}
	}
</script>

<style scoped>

</style>
