<template>

	<a-modal :title="title" :width="800" :visible="visible" :confirmLoading="confirmLoading" @ok="handleOk" @cancel="handleCancel"
	 :destroyOnClose="true" :maskClosable="false">
		<a-spin :spinning='confirmLoading'>
			<a-form :form="form" autocomplete="off">
				<a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="题目类型">
					<a-select v-decorator="[ 'questionType', {rules: [{ required: true, message: '题目类型' } ] }]" @change="changeQuestionType">
						<a-select-option value="1">单题单选</a-select-option>
						<a-select-option value="2">单题多选</a-select-option>
						<!-- <a-select-option value="3">多题单选</a-select-option> -->
						<a-select-option value="4">判断题</a-select-option>
						<!-- <a-select-option value="5">主观题</a-select-option>
						<a-select-option value="6">抢红包</a-select-option>
						<a-select-option value="7">语音测评</a-select-option>
						<a-select-option value="8">语音识别</a-select-option> -->
					</a-select>
				</a-form-item>
				<a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="正确答案">
					<a-input placeholder="正确答案" v-decorator="[ 'trueAnswer',{rules: [{pattern:pattern, message: '请输入正确的答案' }]}]" @change="changetotaltrueanswer"/>
				</a-form-item>
				<a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="得分">
					<a-input placeholder="得分" v-decorator="[ 'score', {rules: [{ required: true, message: '得分' }] }]" />
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
				isAdd: true,
				pattern: null
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
			initInfo(record) {
				this.mdl = Object.assign({}, record)
				this.visible = true
				this.$nextTick(() => {
					this.form.setFieldsValue(pick(this.mdl, 'titleCode', 'titleName', 'questionType', 'trueAnswer', 'score','remark'))
					if (!this.isAdd) {
						if (this.mdl.questionType == 1) {
							this.pattern = /^[A-D]{1}$/
						} else if (this.mdl.questionType == 2) {
							this.pattern = /^(?!.*([A-D]).*\1)[A-D]{2,4}$/
						} else if (this.mdl.questionType == 4) {
							this.pattern = /^[E-F]{1}$/
						}
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
						_this.confirmLoading = true
						postAction(_this.isAdd ? infoManageapi.addTopicQuestion : infoManageapi.updateTopicQuestion, parameter).then(
							res => {
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
			changeQuestionType(value) {
				if (value == 1) {
					this.pattern = /^[A-D]{1}$/
				} else if (value == 2) {
					this.pattern = /^(?!.*([A-D]).*\1)[A-D]{2,4}$/
				} else if (value == 4) {
					this.pattern = /^[E-F]{1}$/
				}
				this.form.setFieldsValue({
					totaltrueanswer: ''
				})
			},
			changetotaltrueanswer(e) {
				console.log(e.target.value)
				e.target.value = e.target.value.toLocaleUpperCase().split('').sort().join('')
			},

		}
	}
</script>

<style scoped>

</style>
