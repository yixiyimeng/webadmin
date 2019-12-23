<template>
	<a-modal :title="title" :width="800" :visible="visible" :confirmLoading="confirmLoading" @ok="handleOk" @cancel="handleCancel"
	 :destroyOnClose="true" :maskClosable="false">
		<a-spin :spinning='confirmLoading'>
			<a-form :form="form" autocomplete="off">
				<a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="角色名">
					<a-input placeholder="角色名" v-decorator="[ 'roleName', {rules: [{ required: true, message: '角色名' }]} ]" />
				</a-form-item>
				<a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="所属机构" v-if="isUserAdminRole">
					<a-select v-decorator="[ 'organization', {rules: [{ required: true, message: '所属机构' } ] }]" >
						<a-select-option :value="item.code" v-for="(item,index) in orgList" :key="index">{{item.name}}</a-select-option>
					</a-select>
				</a-form-item>
				<a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="备注">
					<a-textarea placeholder="备注" v-decorator="[ 'remark', {rules: [ ]}]" />
				</a-form-item>
				<!-- <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="数据权限">
					<a-select  v-decorator="[ 'permission', {rules: [{ required: true, message: '数据权限' } ] }]" >
						<a-select-option value="all">机构全部权限</a-select-option>
						<a-select-option value="school">所属校区权限</a-select-option>
					</a-select>
				</a-form-item>
				<a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="菜单权限">
					<a-input placeholder="菜单权限" v-decorator="[ 'menuIds', {rules: [{ required: true, message: '菜单权限' }]} ]" />
				</a-form-item> -->
			</a-form>
		</a-spin>
	</a-modal>
</template>

<script>
	import {
		sysManageapi,getAllorgList
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
				orgList:[],
				isUserAdminRole:false
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
			initInfo(record){
				if(this.isUserAdminRole){
					this.getAllorgList();
				}
				this.mdl = Object.assign({}, record)
				this.visible = true
				this.$nextTick(() => {
					/*pick(this.mdl,需要回填的字段)*/
					this.form.setFieldsValue(pick(this.mdl, 'roleName', 'organization', 'remark'))
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
						let organizationName='';
						for(let key in _this.orgList) {
							if(parameter.organization == _this.orgList[key].code){
								organizationName = _this.orgList[key].name
							}
						}
						parameter['organizationName'] = organizationName
						_this.confirmLoading = true
						postAction(_this.isAdd ? sysManageapi.addroleList : sysManageapi.updateroleList, parameter).then(res => {
							if (res.code == 0) {
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
			/*查询所有机构*/
			getAllorgList() {
				getAllorgList().then(da => {
					this.orgList = da.data;
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
