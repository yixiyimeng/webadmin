<template>
	<a-modal :title="title" :width="800" :visible="visible" :confirmLoading="confirmLoading" @ok="handleOk" @cancel="handleCancel"
	 :destroyOnClose="true" :maskClosable="false">
		<a-spin :spinning='confirmLoading'>
			<a-form :form="form" autocomplete="off">
				<a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="版本">
					<a-input placeholder="版本" v-decorator="[ 'currentVersion', {rules: [{ required: true, message: '版本' }]} ]" />
				</a-form-item>
				<a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="是否强制升级">
					<a-select  v-decorator="[ 'isForceUpdate', {rules: [ ] }]" >
						<a-select-option value="1" >是</a-select-option>
						<a-select-option value="0">否</a-select-option>
					</a-select>
				</a-form-item>
				<a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="排序(升序)">
					<a-input-number v-decorator="['sort', { initialValue: 1 }]" :min="1" style="width: 100%;" />
				</a-form-item>
				<a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="状态">
					<a-select  v-decorator="[ 'status', {rules: [ ] }]" >
						<a-select-option value="1">启用</a-select-option>
						<a-select-option value="0">停用</a-select-option>
					</a-select>
				</a-form-item>
				<a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="备注">
					<a-textarea :rows="5" placeholder="..." v-decorator="[ 'remarks', {rules: [] }]" />
				</a-form-item>
			</a-form>
		</a-spin>
	</a-modal>
</template>

<script>
	import {
		baseManageapi
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
				isAdd: true
			}
		},
		created() {
			// this.loadPermissions()
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
			initInfo(record){
				this.mdl = Object.assign({}, record)
				this.visible = true
				this.$nextTick(() => {
					/*pick(this.mdl,需要回填的字段)*/
					this.form.setFieldsValue(pick(this.mdl, 'currentVersion', 'isForceUpdate', 'status', 'sort', 'remarks'))
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
						let parameter =Object.assign({},this.mdl,values);
						_this.confirmLoading = true
						postAction(_this.isAdd ? baseManageapi.addVersionManage : baseManageapi.updateVersionManage, parameter).then(res => {
								_this.$message.success('保存成功')
								_this.$emit('ok')
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
