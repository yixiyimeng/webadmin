<template>
	<div>
		<!-- <a-form :form="form">
			<a-form-item :label-col="formTailLayout.labelCol" :wrapper-col="formTailLayout.wrapperCol" label="姓名">
				<a-input v-decorator="['username', { rules: [{ required: true, message: '请输入你的姓名' }] }]" placeholder="请输入你的姓名" />
			</a-form-item>
		</a-form> -->
		<a-form :form="form" autocomplete="off">
			<a-form-item label="旧密码" :labelCol="formTailLayout.labelCol" :wrapperCol="formTailLayout.wrapperCol">
				<a-input placeholder="请输入旧密码" ref="userNameInput" :type="inputType[0]" style="width: 100%;" v-decorator="['pwdOld', { rules: [{ required: true, message: '密码必须包含大小写字母和数字，长度不低于8位' }, { validator: checkConfirmold }] }]">
					<a-icon slot="suffix" type="eye" class="eye" :class="inputType[0] == 'password' ? '' : 'eye_active'" @click="openPwd(0)" />
				</a-input>
			</a-form-item>
			<a-form-item label="新密码" :labelCol="formTailLayout.labelCol" :wrapperCol="formTailLayout.wrapperCol">
				<a-input placeholder="请输入新密码" ref="userNameInput" :type="inputType[1]" style="width: 100%;" v-decorator="['pwdNew', { rules: [{ required: true, message: '密码必须包含大小写字母和数字，长度不低于8位' }, { validator: validateToNextPassword }] }]">
					<a-icon slot="suffix" type="eye" class="eye" :class="inputType[1] == 'password' ? '' : 'eye_active'" @click="openPwd(1)" />
				</a-input>
			</a-form-item>
			<a-form-item label="确认密码" :labelCol="formTailLayout.labelCol" :wrapperCol="formTailLayout.wrapperCol">
				<a-input placeholder="请再次输入新密码" ref="userNameInput" :type="inputType[2]" v-decorator="['confirm_password', { rules: [{ required: true, message: '密码必须包含大小写字母和数字，长度不低于8位' }, { validator: compareToFirstPassword }] }]"
				 @blur="handleConfirmBlur">
					<a-icon slot="suffix" type="eye" class="eye" :class="inputType[2] == 'password' ? '' : 'eye_active'" @click="openPwd(2)" />
				</a-input>
			</a-form-item>
		</a-form>
	</div>
</template>

<script>
	import {
		isPwd
	} from '@/utils/validate';
	import {
		api
	} from '@/api';
	export default {
		data() {
			return {
				formTailLayout: {
					labelCol: {
						span: 4
					},
					wrapperCol: {
						span: 18
					}
				},
				form: this.$form.createForm(this),
				inputType: ['password', 'password', 'password'],
				editpwdinfo: {},
				confirmDirty: ''
			};
		},
		methods: {
			openPwd(num) {
				var type = this.inputType[num] == 'password' ? 'text' : 'password';
				this.$set(this.inputType, num, type);
				//this.inputType[num] = type;
			},
			/*校验旧密码*/
			checkConfirmold(rule, value, callback) {
				if (value) {
					if (!isPwd(value)) {
						// 正则验证
						callback('密码必须包含大小写字母和数字，长度不低于8位'); // 校验未通过
					}
				}
				callback(); // 校验通过
			},
			/*校验新密码*/
			// checkConfirmnew(rule, value, callback) {
			// 	if (value) {
			// 		if (!isPwd(value)) {
			// 			// 正则验证
			// 			callback('密码必须包含大小写字母和数字，长度不低于8位'); // 校验未通过
			// 		}
			// 		if (this.editpwdinfo.confirm_password && value != this.editpwdinfo.confirm_password) {
			// 			callback('两次输入的密码不匹配'); // 校验未通过
			// 		}
			// 	}
			// 	callback();
			// },
			/*校验再次输入密码*/
			// checkConfirm(rule, value, callback) {
			// 	if (value) {
			// 		if (!isPwd(value)) {
			// 			// 正则验证
			// 			callback('密码必须包含大小写字母和数字，长度不低于8位'); // 校验未通过
			// 		}
			// 		// if (this.editpwdinfo.pwdNew && value != this.editpwdinfo.pwdNew) {
			// 		// 	callback('两次输入的密码不匹配'); // 校验未通过
			// 		// }
			// 	}
			// 	callback();
			// },
			handleConfirmBlur(e) {
				const value = e.target.value;
				this.confirmDirty = this.confirmDirty || !!value;
			},
			compareToFirstPassword(rule, value, callback) {
				const form = this.form;
				if (value) {
					if (!isPwd(value)) {
						// 正则验证
						callback('密码必须包含大小写字母和数字，长度不低于8位'); // 校验未通过
					} else if (value !== form.getFieldValue('pwdNew')) {
						callback('两次输入的密码不匹配');
					} else {
						callback();
					}
				} else {
					callback();
				}
				// if ( && value !== form.getFieldValue('pwdNew')) {
				// 	callback('两次输入的密码不匹配');
				// } else {
				// 	
				// }
			},
			validateToNextPassword(rule, value, callback) {
				const form = this.form;
				if (value) {
					if (!isPwd(value)) {
						// 正则验证
						callback('密码必须包含大小写字母和数字，长度不低于8位'); // 校验未通过
					} else if (this.confirmDirty) {
						form.validateFields(['confirm_password'], {
							force: true
						});

					}
				}
				callback();
			},

			resetPwd() {
				this.form.validateFields((err, values) => {
					// 验证表单没错误
					if (!err) {
						console.log('form values', values)
						let parameter = Object.assign({}, values);
						this.$postAction(api.resetPwd, parameter).then(da => {
							if (da.code == 0) {
								this.$message.success('修改密码成功');
								this.form.resetFields()
							}
						})

					}
				})

			}
		}
	};
</script>

<style scoped="scoped" lang="less">
	.eye {
		font-size: 16px;
		color: #cccccc;
		cursor: pointer;
	}

	.eye_active {
		color: rgba(0, 0, 0, 0.65);
	}
</style>
