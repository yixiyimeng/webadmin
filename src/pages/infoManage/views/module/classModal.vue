<template>

	<a-modal :title="title" :width="800" :visible="visible" :confirmLoading="confirmLoading" @ok="handleOk" @cancel="handleCancel"
	 :destroyOnClose="true" :afterClose="afterClose" :maskClosable="false">
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
				<a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="班级名称">
					<a-input placeholder="班级名称" v-decorator="[ 'name', {rules: [{ required: true, message: '校区名称' }]} ]" />
				</a-form-item>
				<a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="状态">
					<a-select v-decorator="[ 'state', {rules: [ {required: true}] }]">
						<a-select-option :value="1">启用</a-select-option>
						<a-select-option :value="0">停用</a-select-option>
					</a-select>
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
		getAllshcoolList
	} from '../../api'
	import {
		postAction
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
				title: '新增',
				isAdd: true,
				schoolList: [],
				orgList: [],
				afterClose: () => {
					this.schoolList = [];
					this.orgList = [];
				},
				isUserAdminRole: false
			}
		},
		created() {
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
					state: 1
				})
			},
			edit(record) {
				this.title = '编辑';
				this.isAdd = false;
				this.initInfo(record)

			},
			initInfo(record) {
				this.mdl = Object.assign({}, record)
				if (this.isUserAdminRole) {
					this.getAllorgList();
					if (!this.isAdd) {
						this.getshcoolByorganization(this.mdl.organization);
					}
				} else {
					this.getshcoolByorganization()
				}

				this.visible = true;

				this.$nextTick(() => {
					this.form.setFieldsValue(pick(this.mdl, 'organization', 'name', 'schoolCode', 'state', 'remark'))
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
						parameter.schoolName = this.schoolList.find(item => item.code == values.schoolCode).name;
						_this.confirmLoading = true
						postAction(_this.isAdd ? infoManageapi.addClass : infoManageapi.updateClass, parameter).then(res => {
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
// 			getAllshcoolList(code) {
// 				let param = {
// 					organization: code
// 				}
// 				getAllshcoolList(param).then(da => {
// 					this.schoolList = da.data;
// 
// 					// console.log(this.schoolList)
// 				})
// 			},
			/*通过机构查询校区*/
			getshcoolByorganization(code) {
				getshcoolByorganization({
					organization: code
				}).then(da => {
					this.schoolList = da.data;
					console.log(this.schoolList)
				})
			},
			/*改变机构*/
			changeOrg(value) {
				// let organization = this.form.getFieldValue('organization');
				this.getshcoolByorganization(value);
				this.form.setFieldsValue({
					'schoolCode': ''
				})
			},
			/*改变机构,查询校区*/
			// changeOrg(value) {
			// 	this.getshcoolByorganization(value)
			// },
			/*改变校区*/
			changeSchool() {
				// let organization = this.form.getFieldValue('organization');
				// let schoolcode = this.form.getFieldValue('schoolCode');
				// console.log(schoolcode)
				// getAllshcoolList(organization,schoolcode)
			},


		}
	}
</script>

<style scoped>

</style>
