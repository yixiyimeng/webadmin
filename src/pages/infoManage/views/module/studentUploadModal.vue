<template>

	<a-modal :title="title" :width="800" :visible="visible" :confirmLoading="confirmLoading" @ok="handleUpload" @cancel="handleCancel"
	 :destroyOnClose="true" :maskClosable="false">
		<a-spin :spinning='confirmLoading'>
			<a-form :form="form" autocomplete="off">
				<a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="所属机构" v-if="isUserAdminRole">
					<a-select @change="changeOrg" v-decorator="[ 'organization', {rules: [{ required: true, message: '所属机构' } ] }]">
						<a-select-option :value="item.code" v-for="(item,index) in orgList" :key="index">{{item.name}}</a-select-option>
					</a-select>
				</a-form-item>
				<a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="所属校区">
					<a-select @change="changeSchool" v-decorator="[ 'schoolCode', {rules: [{ required: true, message: '所属校区' } ] }]">
						<a-select-option :value="item.code" v-for="(item,index) in schoolList" :key="index">{{item.name}}</a-select-option>
					</a-select>
				</a-form-item>
				<a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="所属班级">
					<a-select v-decorator="[ 'classCode', {rules: [{ required: true, message: '所属班级' } ] }]">
						<a-select-option :value="item.code" v-for="(item,index) in classList" :key="index">{{item.name}}</a-select-option>
					</a-select>
				</a-form-item>
				<a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="上传">
					<div class="flex flex-pack-justify flex-align-center">
						<a-upload name="file" :beforeUpload="beforeUpload" :fileList="fileList" v-decorator="[ 'file', {rules: [{ required: true, message: '上传文件' } ] }]">
							<a-button>
								<a-icon type="upload" /> 上传文件
							</a-button>
						</a-upload>
						<a :href="baseURL+'/plat/files/students-templates.xlsx'" class="ant-btn ant-btn-primary" download="students-templates.xlsx">
							<a-icon type="download" /><span>模板下载</span></a>
					</div>
				</a-form-item>
			</a-form>
		</a-spin>
	</a-modal>
</template>

<script>
	import {
		infoManageapi,
		getAllorgList,
		getshcoolByorganization,
		getclassByschool,
	} from '../../api'
	import {
		baseURL
	} from '@/utils/base'
	import {
		postAction,
		postActionUpload
	} from '@/api'
	import pick from 'lodash.pick'

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
				title: '导入',
				isAdd: true,
				orgList: [],
				schoolList: [],
				classList: [],
				fileList: [],
				uploading: false,
				baseURL,
				isUserAdminRole: false
			}
		},
		created() {
			/* 判断用户是否是管理员 */
			try {
				if (JSON.parse(localStorage.getItem('userInfo')).roleSign == 'admin') {
					this.isUserAdminRole = true;

				}
			} catch (e) {
				//TODO handle the exception
			}
		},
		methods: {
			uploadStudent() {
				this.title = '导入';
				this.isAdd = true;
				this.initInfo({
					// id: 0
				})
			},
			initInfo(record) {
			
				this.mdl = Object.assign({}, record);
				if (this.isUserAdminRole) {
					this.getAllorgList();
				}else{
					this.getshcoolByorganization()
				}
				this.visible = true
				this.$nextTick(() => {
					this.form.setFieldsValue(pick(this.mdl, 'organization', 'schoolCode', 'classCode'))
				})
			},
			/*上传文件*/
			beforeUpload(file) {
				console.log('file.type',file.type);
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
						let parameter = Object.assign({}, this.mdl, values);
						let schoolName = '';
						let className = '';
						for (let key in _this.schoolList) {
							if (parameter.schoolCode == _this.schoolList[key].code) {
								schoolName = _this.schoolList[key].name
							}
						}
						for (let key in _this.classList) {
							if (parameter.classCode == _this.classList[key].code) {
								className = _this.classList[key].name
							}
						}
						_this.confirmLoading = true;
						const formData = new FormData();
						formData.append('schoolName', schoolName);
						formData.append('className', className);
						_this.fileList.forEach((file) => {
							formData.append('file', file);
						});
						for (let key in parameter) {
							formData.append(key, parameter[key])
						}
						postActionUpload(infoManageapi.studentUpload, formData).then(res => {
							if(res.code==0){
								_this.$message.success('保存成功')
								_this.$emit('ok')
							}
						}).finally(() => {
							_this.confirmLoading = false
							_this.close()
						});
					}
				})
				this.uploading = true;
			},
			close() {
				this.$emit('close')
				this.visible = false
			},
			handleCancel() {
				this.close()
			},
			/*查询所有机构*/
			getAllorgList() {
				getAllorgList().then(da => {
					this.orgList = da.data;
				})
			},
			/*通过机构查询校区*/
			getshcoolByorganization(code) {
				getshcoolByorganization({organization: code}).then(da => {
					this.schoolList = da.data;
				})
			},
			/*通过校区查询班级*/
			getclassByschool(code) {
				getclassByschool({
					schoolCode: code
				}).then(da => {
					this.classList = da.data;
				})
			},
			/*改变机构,查询校区*/
			changeOrg(value) {
				this.getshcoolByorganization(value);
				this.form.setFieldsValue({
					'schoolCode': '',
					'classCode':''
				})
			},
			/*改变校区，查询班级*/
			changeSchool(value) {
				this.getclassByschool(value);
				this.form.setFieldsValue({
					'classCode':''
				})
			},

		}
	}
</script>

<style scoped>

</style>
