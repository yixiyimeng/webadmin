<template>
	<a-modal :title="title" :width="800" :visible="visible" :confirmLoading="confirmLoading" @ok="handleOk" @cancel="handleCancel"
	 :destroyOnClose="true" :afterClose="afterClose" :maskClosable="false">
		<a-spin :spinning='confirmLoading'>
			<a-form :form="form" autocomplete="off">
				<a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="姓名">
					<a-input placeholder="姓名" v-decorator="[ 'name', {rules: [{ required: true, message: '姓名' }]} ]" />
				</a-form-item>
				<a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="用户名">
					<a-input placeholder="用户名" v-decorator="[ 'username', {rules: [{ required: true, message: '用户名' }]} ]" />
				</a-form-item>
				<a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="密码" v-if="isAdd">
					<a-input placeholder="密码" type="password" v-decorator="[ 'password', {rules: [{ required: true, message: '密码' }]} ]" />
				</a-form-item>
				<a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="E-mail">
					<a-input placeholder="E-mail" v-decorator="[ 'email', {rules: [{ required: true,type:'email', message: '请输入E-mail' }]} ]" />
				</a-form-item>
				<a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="手机号">
					<a-input placeholder="手机号" v-decorator="[ 'mobile', {rules: [{ required: true,type:'email', message: '请输入手机号' }]} ]" />
				</a-form-item>
				<a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="状态">
					<a-select v-decorator="[ 'status', {rules: [{ required: true, message: '状态' } ] }]">
						<a-select-option :value="1">启用</a-select-option>
						<a-select-option :value="0">停用</a-select-option>
					</a-select>
				</a-form-item>
				<a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="管理员角色" v-if="isUserAdminRole">
					<a-checkbox @change="checkedAdmin" :checked="isAdmin">超级管理员</a-checkbox>
				</a-form-item>
				<template v-if="!isAdmin&&isUserAdminRole">
					<a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="所属机构">
						<a-select v-decorator="[ 'organization', {rules: [{ required: true, message: '所属机构' } ] }]" @change="onChangeOrg">
							<a-select-option :value="item.code" v-for="(item,index) in orglist" :key="index">{{item.name}}</a-select-option>
						</a-select>
					</a-form-item>
				</template>
				<a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="角色" v-if="(!isAdmin&&isUserAdminRole)||!isUserAdminRole">
					<a-checkbox-group :options="rolelist" @change="onChangeRole" v-model="roleIds">
					</a-checkbox-group>
				</a-form-item>
				<a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="所属校区" v-if="(!isOrgAdmin&&!isAdmin&&isUserAdminRole)||!isUserAdminRole">
					<a-select v-decorator="[ 'schoolCode', {rules: [{ required: true, message: '所属校区不能为空' } ] }]">
						<a-select-option :value="item.code" v-for="(item,index) in schoollist" :key="index">{{item.name}}</a-select-option>
					</a-select>
				</a-form-item>
			</a-form>
		</a-spin>
	</a-modal>
</template>

<script>
	import {
		sysManageapi,
		getAllorgList
	} from '../../api'
	import {
		postAction,
		getOrglist,
		geAllSchoollist
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
				rolelist: [],
				orglist: [],
				schoollist: [],
				isOrgAdmin: false, //是否机构管理员
				isAdmin: false, //是否是超级管理员
				roleIds: [],
				adminRoleId: '', //超级管理员角色id
				isUserAdminRole: false, //用户是否是超级管理员角色
				afterClose: () => {
					this.clear()
				}
			}
		},
		created() {

			/* 判断用户是否是管理员 */
			try {
				if (JSON.parse(localStorage.getItem('userInfo')).roleSign == 'admin') {
					this.isUserAdminRole = true;
					this.getAdminRoleId();
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
					status: 1
				})
			},
			edit(record) {
				this.title = '编辑';
				this.isAdd = false;
				this.initInfo(record)

			},
			initInfo(record) {
				if (this.isUserAdminRole) {
					this.getOrglist(); //查询机构
				} else {
					this.getSchoollist()
					this.getRolebyOrg();
				}
				this.mdl = Object.assign({}, record)
				this.visible = true
				this.$nextTick(() => {
					/*pick(this.mdl,需要回填的字段)*/
					this.form.setFieldsValue(pick(this.mdl, 'username', 'name', 'organization', 'status', 'schoolCode',
						'email'));
					this.roleIds = this.mdl.roleSigns || [];
					if (this.roleIds && this.roleIds.length > 0) {
						if (this.roleIds.some(item => item == 'admin')) {
							this.isAdmin = true;
						} else {
							this.onChangeRole(this.roleIds);
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
						let parameter = Object.assign({}, values);
						/* 如果选中了超级管理员 */
						if (_this.isAdmin) {
							parameter.roleIds = [_this.adminRoleId]
						} else {
							let roleIds = [];
							_this.rolelist.forEach(item => {
								if (this.roleIds.some(subitem => {
										return subitem == item.value
									})) {
									roleIds.push(item.id)
								}
							})
							parameter.roleIds = roleIds
						}
						if(!parameter.roleIds||parameter.roleIds.length<=0){
							_this.$message.error('请至少选中一个角色');
							return false
						}
						if (!_this.isAdd) {
							parameter.userId = this.mdl.userId;
						}
						if (values.schoolCode && values.schoolCode.length > 0) {
							console.log(this.schoollist.find(item => {
								return item.code == values.schoolCode
							}))
							parameter.schoolName = this.schoollist.find(item => {
								return item.code == values.schoolCode
							}).name;
						}
						if (_this.isAdd) {
							_this.checkusername(parameter['username']).then(da => {
								if (da) {
									_this.saveInfo(parameter)
								} else {
									_this.$message.error('用户名重复')
								}
							})
						} else {
							_this.saveInfo(parameter)
						}

					}
				})
			},
			saveInfo(parameter) {
				let _this = this;
				_this.confirmLoading = true;
				postAction(_this.isAdd ? sysManageapi.adduserList : sysManageapi.updateuserList, parameter).then(res => {
					if (res.code == 0) {
						_this.$message.success('保存成功')
						_this.$emit('ok')
					}
				}).finally(() => {
					_this.confirmLoading = false
					_this.close()
				});
			},
			handleCancel() {
				this.close()
			},
			/* 查询机构 */
			getOrglist() {
				getOrglist().then(da => {
					this.orglist = da;
					/* 根据机构查询角色 */
					let code = '';
					if (this.isAdd && this.orglist.length > 0) {
						this.form.setFieldsValue({
							organization: this.orglist[0].code
						});
						code = this.orglist[0].code;
					} else if (!this.isAdd) {
						code = this.mdl.organization
					}
					if(code){
						this.getRolebyOrg(code);
					}
					this.getSchoollist(code);
				})
			},
			getRolebyOrg(orgCode) {
				postAction(sysManageapi.getRolebyOrg, {
					"organization": orgCode
				}).then(da => {
					if (da.code == 0) {
						this.rolelist = [];
						if (da.data && da.data.length > 0) {
							this.rolelist = da.data.map(item => {
								return {
									id: item.roleId,
									value: item.roleSign,
									label: item.roleName,
									disabled: false
								}
							});
						}

					}
				})

			},
			onChangeOrg(value) {
				/* 切换机构，查询角色 */
				this.getRolebyOrg(value);
				this.getSchoollist(value);
				this.roleIds = [];
				this.isOrgAdmin = false;
				this.form.setFieldsValue({
					schoolCode: null
				})
			},
			onChangeRole(checkedValues) {
				/* 选中角色 */
				this.roleIds = checkedValues;
				console.log(checkedValues)
				if (checkedValues && checkedValues.length > 0 && checkedValues.indexOf('orgAdmin') > -1) {
					this.isOrgAdmin = true;
					this.rolelist.map(item => {
						if (item.value != 'orgAdmin') {
							item.disabled = true;
						} else {
							item.disabled = false
						}
						return item
					})
					this.roleIds = ['orgAdmin']
				} else {
					this.isOrgAdmin = false;
					this.rolelist.map(item => {
						item.disabled = false
						return item
					})
				}

			},
			/* 查询校区 */
			getSchoollist(org) {
				geAllSchoollist({
					organization: org
				}).then(da => {
					this.schoollist = da;
				})
			},
			checkedAdmin(e) {
				/* 选中超级管理员 */
				this.isAdmin = e.target.checked;
			},
			getAdminRoleId() {
				postAction(sysManageapi.getAdminRoleId).then(da => {
					this.adminRoleId = da.data.roleId;
				})
			},
			/*校验用户名*/
			checkusername(paramer) {
				return postAction(sysManageapi.checkusername, {
					username: paramer
				}).then(da => {
					return da.data
				})
			},
			clear() {
				this.form.resetFields();
				this.isAdmin = false; //是否选中管理员
				this.isOrgAdmin = false; //是否选中机构管理员
				this.rolelist = [];
				this.orglist = [];
				this.schoollist = [];
			}

		}
	}
</script>

<style scoped>

</style>
