<template>
	<a-modal :title="title" :width="800" :visible="visible" :confirmLoading="confirmLoading" @ok="handleOk" @cancel="handleCancel"
	 :destroyOnClose="true" :maskClosable="false">
		<a-spin :spinning='confirmLoading'>
			<a-form :form="form" autocomplete="off">
				<a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="上级菜单">
					<a-input placeholder="上级菜单" v-decorator="[ 'parentText', {rules: [{ required: true, message: '父id' }]} ]"
					 :disabled="true" />
				</a-form-item>
				<a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="类型">
					<a-select v-decorator="[ 'type', {rules: [{ required: true, message: '类型' } ] }]" @change="changeMenutype">
						<a-select-option :value="0">目录</a-select-option>
						<a-select-option :value="1">菜单</a-select-option>
						<a-select-option :value="2">按钮</a-select-option>
					</a-select>
				</a-form-item>
				<a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="名称">
					<a-input placeholder="名称" v-decorator="[ 'name', {rules: [{ required: true, message: '名称' }]} ]" />
				</a-form-item>

				<a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="显示地址" v-if="menutype!=2">
					<a-input placeholder="地址" v-decorator="[ 'url',{rules: [{ required: true, message: '显示地址' }]}]" />
				</a-form-item>

				<a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="图标" v-if="menutype!=2">
					<!-- <a-input placeholder="图标"  /> -->
					<a-input placeholder="点击右侧按钮选择图标" v-decorator="[ 'icon']">
						<a-icon slot="addonAfter" type="setting" @click="selectIcons" />
					</a-input>
				</a-form-item>
				<template v-if="menutype==1">
					<a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="链接方式">
						<a-radio-group v-model="linkway">
							<a-radio :value="1">外部链接</a-radio>
							<a-radio :value="2">内部链接</a-radio>
						</a-radio-group>
					</a-form-item>
					<a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="外部链接地址" v-if="linkway==1" extra="外部链接地址,类似http://www.baidu.com">
						<a-input placeholder="外部链接地址" v-decorator="[ 'component',{rules: [{ required: true, message: '名称' }]}]" />
					</a-form-item>
					<a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="内部链接地址" v-if="linkway==2" extra="内部链接地址,类似views/test.vue">
						<a-input placeholder="内部链接地址" v-decorator="[ 'component',{rules: [{ required: true, message: '名称' }]}]" />
					</a-form-item>
					<a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="默认跳转地址">
						<a-input placeholder="默认跳转地址" v-decorator="[ 'redirect']" />
					</a-form-item>
					<a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="是否缓存">
						<a-radio-group v-decorator="[ 'isCacheRoute',{ initialValue: 0}]">
							<a-radio :value="0">否</a-radio>
							<a-radio :value="1">是</a-radio>
						</a-radio-group>
					</a-form-item>
				</template>
				<a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="权限标识">
					<a-input placeholder="权限标识" v-decorator="[ 'perms']" />
				</a-form-item>
				<a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="排序号">
					<a-input-number v-decorator="['orderNum', { initialValue: 1 }]" :min="1" style="width: 100%;" />
				</a-form-item>

			</a-form>
			<allicon @choose="chooseIcon" ref="allicon"></allicon>
		</a-spin>
	</a-modal>
</template>

<script>
	import allicon from '@/components/allicon/allicon';
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
				title: '新增',
				isAdd: true,
				menutype: 0,
				linkway: 1
			}
		},
		components: {
			allicon
		},
		created() {},
		methods: {
			add(parentId, parentText) {
				this.title = '新增';
				this.isAdd = true;
				this.initInfo({
					parentId: parentId ? parentId : '0',
					parentText: parentText
				})
			},
			edit(record) {
				this.title = '编辑';
				this.isAdd = false;
				this.initInfo(record)

			},
			initInfo(record) {
				this.mdl = Object.assign({}, record)
				this.visible = true;
				this.menutype = this.mdl.type || 0;
				this.$nextTick(() => {
					this.linkway = (!this.mdl.component||this.mdl.component.indexOf('http://')>=0) ? 1 : 2;
					/*pick(this.mdl,需要回填的字段)*/
					this.form.setFieldsValue(pick(this.mdl, 'perms', 'type', 'parentText', 'component', 'isCacheRoute', 'redirect','orderNum'));
					this.form.setFieldsValue({
						name: this.mdl.text,
						parentText: this.mdl.parentText ? this.mdl.parentText : '根目录',
						icon: (this.mdl.attributes && this.mdl.attributes.icon) || '',
						url: (this.mdl.attributes && this.mdl.attributes.url) || ''
					});



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
						let parameter = Object.assign({}, {
							menuId: this.mdl.id,
							parentId: this.mdl.parentId
						}, values);
						if (parameter.parentText == '根目录') {
							parameter.parentText = null;
						}
						_this.confirmLoading = true
						postAction(_this.isAdd ? sysManageapi.addmenuList : sysManageapi.updatemenuList, parameter).then(res => {
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
			handleCancel() {
				this.close()
			},
			changeMenutype(value) {
				this.menutype = value
			},
			chooseIcon(icon) {
				this.form.setFieldsValue({
					icon: icon
				});
				// console.log(icon)
			},
			selectIcons() {
				this.$refs.allicon.show();
			}

		}
	}
</script>

<style scoped>

</style>
