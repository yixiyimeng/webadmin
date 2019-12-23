<template>
	<a-modal :title="title" :width="800" :visible="visible" :confirmLoading="confirmLoading" @ok="handleOk" @cancel="handleCancel"
	 :destroyOnClose="true" :maskClosable="false">
		<a-spin :spinning='confirmLoading'>
			<a-form :form="form" autocomplete="off">
				<a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="姓名">
					<a-input placeholder="姓名" v-decorator="[ 'name' ]" disabled="disabled"/>
				</a-form-item>
				<a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="用户名">
					<a-input placeholder="用户名" v-decorator="[ 'username' ]" disabled="disabled"/>
				</a-form-item>
				
				<a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="新密码">
					<a-input placeholder="新密码" v-decorator="[ 'pwdNew', {rules: [{ required: true, message: '新密码' }]} ]" type="password"/>
				</a-form-item>
				
			</a-form>
		</a-spin>
	</a-modal>
</template>

<script>
	import {
		sysManageapi
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
				title: '重置密码',
				isAdd: true
			} 
		},
		created() {
			// this.loadPermissions()
		},
		methods: {
			resetPwd(record) {
				this.title = '重置密码';
				this.isAdd = true;
				this.initInfo(record)
			},
			initInfo(record){
				this.mdl =pick(record, 'username','userId','name');
				this.visible = true
				this.$nextTick(() => {
					/*pick(this.mdl,需要回填的字段)*/
					this.form.setFieldsValue(pick(this.mdl, 'username','name'))
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
						let parameter =Object.assign({},{userId:this.mdl.userId},values);
						_this.confirmLoading = true
						postAction(sysManageapi.adminResetPwd, parameter).then(res => {
							if(res.code==0){
								_this.$message.success('重置密码成功')
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
			}

		}
	}
</script>

<style scoped>

</style>
