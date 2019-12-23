<template>

	<a-modal :title="title" :width="800" :visible="visible" :confirmLoading="confirmLoading" @ok="handleOk" @cancel="handleCancel"
	 :destroyOnClose="true" :maskClosable="false">
		<a-spin :spinning='confirmLoading'>
			<a-form :form="form" autocomplete="off">
				<a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="机构名称">
					<a-input placeholder="机构名称" v-decorator="[ 'name', {rules: [{ required: true, message: '校区名称' }]} ]" />
				</a-form-item>

				<a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="状态">
					<a-select v-decorator="[ 'state', {rules: [{required: true} ] }]" placeholder="请选择状态">
						<a-select-option :value="1">启用</a-select-option>
						<a-select-option :value="0">停用</a-select-option>
					</a-select>
				</a-form-item>
				<a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="有效期">
					<a-date-picker class="w100" v-decorator="[ 'periodOfValidity']" format="YYYY-MM-DD HH:mm:ss"
					 :showTime="{ defaultValue: moment('00:00:00', 'HH:mm:ss') }" />
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
		infoManageapi
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
			moment,
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
				this.mdl = Object.assign({}, record)
				this.visible = true
				this.$nextTick(() => {
					this.form.setFieldsValue(pick(this.mdl, 'organizationName', 'name', 'schoolCode', 'state', 'remark'));
					if (this.mdl.periodOfValidity) {
						this.form.setFieldsValue({
							periodOfValidity: moment(this.mdl.periodOfValidity)
						})
					}

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
						if (parameter.periodOfValidity) {
							parameter.periodOfValidity = Date.parse(parameter.periodOfValidity.format('YYYY-MM-DD HH:mm:ss'))
						}
						_this.confirmLoading = true
						postAction(_this.isAdd ? infoManageapi.addOrg : infoManageapi.updateOrg, parameter).then(res => {
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
			// disabledEndDate(endValue) {
			// 	
			// 	return moment() >= endValue.valueOf();
			// }

		}
	}
</script>

<style scoped lang="less">
	/deep/ .ant-form-item-children {
		width: 100%;
		display: inline-block;
	}
</style>
