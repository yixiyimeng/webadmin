<template>
	<a-modal :title="title" :width="800" :visible="visible" :confirmLoading="confirmLoading" @ok="handleOk" @cancel="handleCancel"
	 :destroyOnClose="true" :maskClosable="false">
		<a-spin :spinning='confirmLoading'>
			<a-form :form="form" autocomplete="off">
				<a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="标签名">
					<a-input placeholder="标签名" v-decorator="[ 'name', {rules: [{ required: true, message: '标签名' }]} ]" />
				</a-form-item>
				<a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="数据值">
					<a-input placeholder="数据值" v-decorator="[ 'value', {rules: [{ required: true, message: '数据值' }] }]" />
				</a-form-item>
				<a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="类型">
					<a-input placeholder="类型" v-decorator="[ 'type']" />
				</a-form-item>
				<a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="描述">
					<a-input placeholder="描述" v-decorator="[ 'description']" />
				</a-form-item>
				<a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="排序(升序)">
					<a-input-number v-decorator="['sort', { initialValue: 1 }]" :min="1" style="width: 100%;" />
				</a-form-item>
				<a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="备注信息">
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
					}, sm: {
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
				this.visible = true;
				this.initInfo({
					// id: 0
				})
			},
			edit(record) {
				this.title = '编辑';
				this.isAdd = false;
				this.visible = true;
				this.initInfo(record)
				
			},
			initInfo(record){
				this.mdl = Object.assign({}, record)
				this.$nextTick(() => {
					/*pick(this.mdl,需要回填的字段)*/
					this.form.setFieldsValue(pick(this.mdl, 'value', 'name', 'type', 'description', 'sort', 'remarks'))
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
						postAction(_this.isAdd ? baseManageapi.addDict : baseManageapi.updateDict, parameter).then(res => {
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
			}

		}
	}
</script>

<style scoped>

</style>
