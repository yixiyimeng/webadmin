<template>

	<a-modal :title="title" :width="800" :visible="visible" :confirmLoading="confirmLoading" @ok="handleOk" @cancel="handleCancel"
	 :destroyOnClose="true" :maskClosable="false">
		<a-spin :spinning='confirmLoading'>
			<a-form :form="form" autocomplete="off">
				<a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="学生姓名">
					<a-input placeholder="学生姓名" v-decorator="[ 'stuName', {rules: [{ required: true, message: '学生姓名' }]}]" />
				</a-form-item>
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
				<!-- <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="状态">
					<a-select v-decorator="[ 'state', {rules: [{ required: true, message: '状态' } ] }]">
						<a-select-option :value="1">启用</a-select-option>
						<a-select-option :value="0">停用</a-select-option>
					</a-select>
				</a-form-item> -->
				<a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="性别">
					<a-select v-decorator="[ 'sex', {rules: [{ required: true, message: '性别' } ] }]">
						<a-select-option :value="1">男</a-select-option>
						<a-select-option :value="0">女</a-select-option>
					</a-select>
				</a-form-item>
				<a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="手机号">
					<a-input placeholder="手机号" v-decorator="[ 'phoneNum' , {rules: [{ pattern: /^1[0-9]{10}$/, message: '请输入正确的手机号码' } ] }]" />
				</a-form-item>
				<a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="出生年月">
					<a-date-picker placeholder="出生年月" v-decorator="['birthdate']" class="w100" />
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
		getAllorgList,
		getshcoolByorganization,
		getclassByschool
	} from '../../api'
	import {
		postAction
	} from '@/api'
	import pick from 'lodash.pick'
	import moment from 'moment'

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
				orgList: [],
				schoolList: [],
				classList: [],
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
			add() {
				this.title = '新增';
				this.isAdd = true;
				this.initInfo({
					// id: 0
				})
			},
			edit(record) {
				this.title = '编辑';
				this.isAdd = false;
				this.initInfo(record)

			},
			initInfo(record) {
				// this.getclassByschool();
				this.mdl = Object.assign({}, record);
				if (this.isUserAdminRole) {
					this.getAllorgList();
					if (!this.isAdd) {
						this.getshcoolByorganization(this.mdl.organization);
						this.getclassByschool(this.mdl.schoolCode);
					}
				} else {
					this.getshcoolByorganization();
					if (!this.isAdd) {
						this.getclassByschool(this.mdl.schoolCode);
					}
				}
				this.visible = true
				this.$nextTick(() => {
					this.form.setFieldsValue(pick(this.mdl, 'stuName', 'organization', 'schoolCode', 'classCode', 'sex', 
						'phoneNum', 'birthdate', 'remark'))
					this.form.setFieldsValue({
						'birthdate': this.mdl['birthdate'] ? moment(this.mdl['birthdate']) : null
					})
				})
			},
			close() {
				this.$emit('close')
				this.visible = false
			},
			handleOk() {
				const _this = this
				// 触发表单验证
				this.form.validateFields((err, values) => {
					// 验证表单没错误
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
						parameter['schoolName'] = schoolName;
						parameter['className'] = className;
						console.log('456' + parameter['birthdate'])
						if (parameter['birthdate']) {
							parameter['birthdate'] = Date.parse(parameter['birthdate'].format('YYYY-MM-DD'));
						}
						_this.confirmLoading = true
						postAction(_this.isAdd ? infoManageapi.addStudent : infoManageapi.updateStudent, parameter).then(res => {
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
					//console.log(this.schoolList)
					
				})
			},
			/*通过校区查询班级*/
			getclassByschool(code) {
				console.log('code',code);
				getclassByschool({
					schoolCode: code
				}).then(da => {
					this.classList = da.data;
					// console.log(this.classList)
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
