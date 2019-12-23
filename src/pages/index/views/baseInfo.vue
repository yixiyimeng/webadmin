<template>
	<div class="position-relative">
		<a-form :form="form" autocomplete="off">
			<a-form-item :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol" label="姓名">
				<a-input v-decorator="['name', { rules: [{ required: true, message: '请输入你的姓名' }] }]" placeholder="请输入你的姓名" />
			</a-form-item>
			<a-form-item :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol" label="性别">
				<a-radio-group v-decorator="['sex']">
					<a-radio :value="0">男</a-radio>
					<a-radio :value="1">女</a-radio>
				</a-radio-group>
			</a-form-item>
			<a-form-item :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol" label="出生日期">
				<a-date-picker v-decorator="['birth', { rules: [{ required: true, message: '请选择出生日期' }] }]"
				 placeholder="请选择出生日期" style="width: 100%;" />
			</a-form-item>
			<a-form-item :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol" label="手机">
				<a-input v-decorator="['mobile', { rules: [{ required: true, message: '请输入你的手机号码' },{pattern:/^1[0-9]{10}$/,message:'请输入正确的手机号码'}] }]" placeholder="请输入你的手机号码" />
			</a-form-item>
			<a-form-item :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol" label="邮箱">
				<a-input v-decorator="[
						'email',
						{
							rules: [
								{
									type: 'email',
									message: 'The input is not valid E-mail!'
								},
								{
									required: true,
									message: 'Please input your E-mail!'
								}
							]
						}
					]"
				 placeholder="请输入你的邮箱" />
			</a-form-item>
			<!-- <a-form-item :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.maxwrapperCol" label="居住地">
				<div class="flex ">
					<a-select labelInValue :defaultValue="{ key: 'lucy' }">
						<a-select-option value="jack">Jack (100)</a-select-option>
						<a-select-option value="lucy">Lucy (101)</a-select-option>
					</a-select>
					<a-select labelInValue :defaultValue="{ key: 'lucy' }" class="ml10">
						<a-select-option value="jack">Jack (100)</a-select-option>
						<a-select-option value="lucy">Lucy (101)</a-select-option>
					</a-select>
					<a-select labelInValue :defaultValue="{ key: 'lucy' }" class="ml10">
						<a-select-option value="jack">Jack (100)</a-select-option>
						<a-select-option value="lucy">Lucy (101)</a-select-option>
					</a-select>
				</div>
			</a-form-item>
			<a-form-item :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.maxwrapperCol" label="联系地址">
				<a-textarea placeholder="请输入居住地址" :autosize="{ minRows: 2, maxRows: 6 }" v-decorator="['liveAddress']" />
			</a-form-item> -->
			<!-- <a-form-item :label-col="formTailLayout.labelCol" :wrapper-col="formTailLayout.wrapperCol">
				<a-checkbox :checked="checkNick">Nickname is required</a-checkbox>
			</a-form-item> -->
			<!-- <a-form-item :label-col="formTailLayout.labelCol" :wrapper-col="formTailLayout.wrapperCol"><a-button type="primary" @click="check">Check</a-button></a-form-item> -->
		</a-form>
		<div class="ant-upload-preview">
			<!-- <div class="mask">
		    <a-icon type="plus" />
		  </div> -->
		 	<!-- <img src="../../../assets/img/thumb.png" /> -->
			<img alt="" :src="fileUrl+userInfo.picUrl" />
			<a href="javascript:;" @click="$refs.modal.edit(1)" class="edit">修改头像</a>
		</div>
		<avatar-modal ref="modal" @uploadImg="uploadImg">

		</avatar-modal>
	</div>
</template>

<script>
	import AvatarModal from '@/pages/index/views/AvatarModal';
	import pick from 'lodash.pick'
	import moment from 'moment'
	import {
		api
	} from '@/api';
	import {
		fileUrl
	} from '@/utils/base'
	const formItemLayout = {
		labelCol: {
			span: 4
		},
		wrapperCol: {
			span: 8
		},
		maxwrapperCol: {
			span: 16
		}
	};
	const formTailLayout = {
		labelCol: {
			span: 4
		},
		wrapperCol: {
			span: 8,
			offset: 4
		}
	};
	export default {
		data() {
			return {
				formItemLayout,
				formTailLayout,
				form: this.$form.createForm(this),
				option: {
					img: '../../../assets/img/thumb.png'
				},
				userInfo: {},
				fileUrl
			};
		},
		components: {
			AvatarModal
		},
		created() {
			try {
				this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
				this.$nextTick(() => {
					this.form.setFieldsValue(pick(this.userInfo, 'name', 'email', 'sex', 'mobile'));
					this.form.setFieldsValue({'birth':this.userInfo.birth?moment(this.userInfo.birth):null})
				})
			} catch (e) {
				//TODO handle the exception
			}
			
		},
		methods: {
			updatePeronal() {
				this.form.validateFields((err,values) => {
					if (!err) {
						console.info('success');
					}
					let userInfo=Object.assign({},this.userInfo,values);
					userInfo.birth=Date.parse(userInfo.birth.format('YYYY-MM-DD'));
					this.$postAction(api.updatePeronal,userInfo).then(da=>{
						if(da.code==0){
							this.$message.success('修改个人信息成功');
							localStorage.setItem('userInfo',JSON.stringify(userInfo));
							this.$emit('save')
						}
					})
				});
			},
			uploadImg(imgurl){
				try{
					// let userInfo=Object.assign({},this.userInfo);
					this.userInfo.picUrl=imgurl;
					localStorage.setItem('userInfo',JSON.stringify(this.userInfo));
					this.$emit('save')
				}catch(e){
					//TODO handle the exception
				}
			}
			// getCurrLoginUser(){
			// 	this.$postAction(api.getCurrLoginUser).then(da=>{
			// 		if(da.code==0){
			// 			
			// 			localStorage.setItem('userInfo',JSON.stringify(userInfo))
			// 		}
			// 	})
			// 	
			// }
			
		}
	};
</script>
<style scoped="scoped" lang="less">
	.position-relative {
		position: relative;
	}

	.ant-upload-preview {
		position: absolute;
		width: 120px;
		max-width: 180px;
		right: 40px;
		top: 0;

		img {
			width: 120px;
			height: 120px;
			border-radius: 6px;
			position:relative;
			display:block;
			&:after {
				content: "";
				display: inline-block;
				position: absolute;
				z-index: 2;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				background-image: url(../../../assets/img/thumb.png);
				background-size: cover;
				background-color: none;
			}
		}

		.edit {
			display: block;
			width: 88px;
			color: #505050;
			border: 1px solid #ccc;
			border-radius: 5px;
			margin: 10px auto;
			text-align: center;
			line-height: 30px;
		}
	}
</style>
