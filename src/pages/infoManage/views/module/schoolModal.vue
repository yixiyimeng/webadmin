<template>

	<a-modal :title="title" :width="800" :visible="visible" :confirmLoading="confirmLoading" @ok="handleOk" @cancel="handleCancel"
	 :destroyOnClose="true" :maskClosable="false">
		<a-spin :spinning='confirmLoading'>
			<a-form :form="form" autocomplete="off">
				<a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="所属机构" v-if="isUserAdminRole">
					<a-select v-decorator="[ 'organization', {rules: [{ required: true, message: '所属机构' } ] }]">
						<a-select-option :value="item.code" v-for="(item,index) in orgList" :key="index">{{item.name}}</a-select-option>
					</a-select>
				</a-form-item>
				<a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="校区名称">
					<a-input placeholder="校区名称" v-decorator="[ 'name', {rules: [{ required: true, message: '校区名称' }]} ]" />
				</a-form-item>

				<a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="状态">
					<a-select v-decorator="[ 'state', {rules: [{required: true} ] }]">
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
				orgList: [],
				schoolList: [],
				isUserAdminRole: false
			}
		},
		created() {
			// this.loadPermissions()
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
					state: 1
				})
			},
			edit(record) {
				this.title = '编辑';
				this.isAdd = false;
				this.initInfo(record)

			},
			initInfo(record) {
				if (this.isUserAdminRole) {
					this.getAllorgList();
				}
				this.mdl = pick(record, 'id', 'organization', 'name', 'state', 'remark');
				this.visible = true
				this.$nextTick(() => {
					this.form.setFieldsValue(pick(this.mdl, 'organization', 'name', 'state', 'remark'))
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
						postAction(_this.isAdd ? infoManageapi.addSchool : infoManageapi.updateSchool, parameter).then(res => {
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
			}


		}
	}
</script>

<style scoped>

</style>
