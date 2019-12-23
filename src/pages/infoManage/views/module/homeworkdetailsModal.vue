<template>

	<a-modal :title="title" :width="1200" :visible="visible" :confirmLoading="confirmLoading" @ok="handleOK" @cancel="handleCancel"
	 :destroyOnClose="true" :afterClose='afterClose' :maskClosable="false">
		<a-spin :spinning='confirmLoading'>
			<a-form :form="form" autocomplete="off" class="flex flex-align-top">
				<a-row :gutter="24" class="mb10 flex-1">
					<a-col :span="6">
						<a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="题目总数">
							<a-input-number v-decorator="['totalnum',{rules: [{ required: true, message: '请输入题目总数' }]}]" :min="1" class="w100" />
						</a-form-item>
					</a-col>
					<a-col :span="6">
						<a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="题目得分">
							<a-input-number v-decorator="['totalscore',{rules: [{ required: true, message: '请输入题目得分' }]}]" :min="0" class="w100" />
						</a-form-item>
					</a-col>
					<a-col :span="6">
						<a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="题目类型">
							<a-select v-decorator="['totaltype',{rules: [{ required: true, message: '请选择题目类型' }]}]" @change="changeQuestionType">
								<a-select-option :value="item.value" v-for="(item,index) in totaltypeList" :key="index">{{item.name}}</a-select-option>
							</a-select>
						</a-form-item>
					</a-col>
					<a-col :span="6">
						<a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="题目答案">
							<a-input placeholder="题目答案" v-decorator="[ 'totaltrueanswer',{rules: [{pattern:pattern, message: '请输入正确的答案' }]}]"
							 @change="changetotaltrueanswer" />
						</a-form-item>
					</a-col>
				</a-row>
				<a-button class="ant-btn-success ml20" style="margin-top: 3px;" @click="addlist()">确认插入</a-button>
			</a-form>
			<!--表格-->
			<a-table :columns="columns" :dataSource="list" bordered class="mt20" bordered size="middle" :scroll="{ y: 240 }"
			 :pagination="false">
				<span slot="serial" slot-scope="text, record, index">
					{{ index + 1 }}
				</span>
				<a-select slot="questionType" slot-scope="text,record" v-model="record.questionType" class="w100" @change="changeOneQuestionType(record)">
					<a-select-option :value="item.value" v-for="(item,index) in totaltypeList" :key="index">{{item.name}}</a-select-option>
				</a-select>
				<a-input-number :min="1" class="w100" slot="score" slot-scope="text,record" v-model="record.score" />
				<a-input placeholder="题目答案" slot="trueAnswer" class="w100" slot-scope="text,record" v-model="record.trueAnswer"
				 @change="changeOnetrueanswer(record)" />
				<span slot="operation" slot-scope="text,record,index" class="operation">
					<a href="javascript:;" title="删除" class="del" @click="showDeleteConfirm(record,index)"><i class="material-icons icon iconfont">delete</i></a>
				</span>
			</a-table>
		</a-spin>
	</a-modal>
</template>

<script>
	const columns = [{
			title: '题号',
			scopedSlots: {
				customRender: 'serial'
			},
			width: 100
		}, {
			title: '题目类型',
			dataIndex: 'questionType',
			key: 'questionType',
			width: 250,
			scopedSlots: {
				customRender: 'questionType'
			},
		},
		{
			title: '正确答案',
			dataIndex: 'trueAnswer',
			key: 'trueAnswer',
			width: 250,
			scopedSlots: {
				customRender: 'trueAnswer'
			},
		},
		{
			title: '得分',
			key: 'score',
			dataIndex: 'score',
			scopedSlots: {
				customRender: 'score'
			},
		},

		{
			title: '操作',
			key: 'operation',
			dataIndex: 'operation',
			scopedSlots: {
				customRender: 'operation'
			},
			align: 'center',
			width: 100,

		}
	];
	import {
		infoManageapi
	} from '../../api'
	import {
		rowSelection
	} from '@/mixins';
	import {
		postAction
	} from '@/api'
	import pick from 'lodash.pick'

	export default {
		name: "RoleModal",
		mixins: [rowSelection],
		data() {
			return {
				labelCol: {
					xs: {
						span: 24
					},
					sm: {
						span: 8
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
				totaltypeList: [{
						value: '1',
						name: '单选字母'
					},
					{
						value: '2',
						name: '单题判断'
					},
					{
						value: '3',
						name: '单选数字'
					},
					{
						value: '4',
						name: '多选'
					}
				],
				mdl: {},
				form: this.$form.createForm(this),
				columns: columns,
				titleCode: '',
				title: '题目详情',
				list: [],
				record: {},
				afterClose: () => {
					this.confirmLoading = false;
				},
				pattern: /^[E-F]{1}$/
			}
		},
		created() {

		},
		methods: {
			show(record) {
				this.titleCode = record.titleCode;
				this.record = record;
				this.visible = true
				this.$nextTick(() => {
					this.loadData();
				})
			},
			loadData() {
				//做一些异步操作
				postAction(
					infoManageapi.offlineTestPaperQuestionlist, {
						titleCode: this.titleCode
					}

				).then(res => {
					this.list = res.data;
				});
			},
			close() {
				this.$emit('close')
				this.visible = false
			},

			handleCancel() {
				this.close()
			},
			handleOK() {
				/* 批量插入或者修改 */
				let paramer = pick(this.record, 'titleCode');
				if (this.list && this.list.length > 0) {
					paramer.questionList = this.list.map((item, index) => {
						var obj = pick(item, 'questionType', 'score', 'trueAnswer', 'questionId', 'id');
						obj.questionId = JSON.stringify(index + 1);
						return obj
					})
				}
				postAction(
					infoManageapi.editofflineTestPaperQuestion, paramer

				).then(res => {
					// this.list = res.data;
					this.$message.success(res.msg)
					this.loadData()
				});
			},
			/* 确认是否删除 */
			showDeleteConfirm(record, index) {
				let $me = this;
				this.$confirm({
					title: '你确定要删除这条吗?',
					content: '',
					okText: '确定',
					cancelText: '取消',
					class: 'confirmbox',
					okType: 'danger',
					onOk() {
						$me.list.splice(index, 1);
						
					},
					onCancel() {},
				});
			},
			addlist() {
				this.form.validateFields((err, values) => { // 验证表单没错误
					if (!err) {
						// console.log('form values', values)
						var totalnum = values['totalnum'];
						for (var i = 0; i < totalnum; i++) {
							var item = {
								questionType: values['totaltype'],
								score: values['totalscore'],
								trueAnswer: values['totaltrueanswer']
							}
							this.list.push(item)
						}
					}
				})
			},
			changeQuestionType(value) {
				if (value == 1) {
					this.pattern = /^[A-D]{1}$/
				} else if (value == 2) {
					this.pattern = /^[E-F]{1}$/
				} else if (value == 3) {
					this.pattern = /^[0-9]{1}$/
				} else {
					this.pattern = /^(?!.*([A-F]).*\1)[A-F]{2,6}$/
				}
				this.form.setFieldsValue({
					totaltrueanswer: ''
				})
			},
			changeOneQuestionType(item) {
				item.trueAnswer = ''
			},
			changetotaltrueanswer(e) {
				console.log(e.target.value)
				e.target.value = e.target.value.toLocaleUpperCase().split('').sort().join('')
			},
			changeOnetrueanswer(record) {
				var answerreg = null;
				if (record.questionType == 1) {
					answerreg = /^[A-D]{1}$/;
				} else if (record.questionType == 2) {
					answerreg = /^[E-F]{1}$/;
				} else if (record.questionType == 3) {
					answerreg = /^[0-9]{1}$/
				}else {
					answerreg = /^(?!.*([A-F]).*\1)[A-F]{2,6}$/
				}
				if (answerreg && record.trueAnswer) {
					record.trueAnswer = record.trueAnswer.toLocaleUpperCase().split('').sort().join('')
					if (!answerreg.test(record.trueAnswer)) {
						record.trueAnswer = '';
						this.$message.error('请输入正确的答案')
						
					}
				}

			},
			removequestion(delId,index) {
				postAction(
					infoManageapi.removeTestQuestion, {
						id: delId
					}).then(res => {
						this.list.splice(index, 1)
					});
			}

		}
	}
</script>

<style scoped lang="less">
	.w100 {
		width: 100%;
	}

	/deep/ .ant-table-wrapper .operation {
		a {
			font-size: 20px;
			margin: 0 10px;

			&.del {
				color: #d43030;
			}

			&.add {
				color: #00baad;
			}
		}
	}
</style>
