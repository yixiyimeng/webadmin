<template>
	<a-modal :title="title" :width="1200" :visible="visible" :confirmLoading="confirmLoading" :destroyOnClose="true"
	 @cancel="handleCancel" :bodyStyle="{maxHeight:'450px',overflow:'auto'}" :footer="false" :maskClosable="false">
		<s-table bordered :columns="columns" :data="loadData" rowKey="id" ref="table" size="small" 
		 bordered :isFirstLoad="false">
			<span slot="serial" slot-scope="text, record, index">
				<!-- {{ index + 1 }} -->
				{{text}}
			</span>
			<span slot="questionType" slot-scope="text, record">{{text|filterType}}</span>
			<span slot="answer" slot-scope="text, record">{{text|filterAnswer}}</span>
			<span slot="trueAnswer" slot-scope="text, record" >{{text|filterAnswer}}</span>
			<a-tag :color="answerResult=='true'?'#00a095':'#d43030'" slot="answerResult" slot-scope="answerResult" v-if="answerResult">{{ answerResult=='true'?'正确':'错误'}}</a-tag>
		</s-table>
	</a-modal>
</template>

<script>
	import {
		dataManageapi
	} from '../../api';
	import {
		postAction
	} from '@/api';
	const columns = [{
			title: '序号',
			dataIndex: 'questionId',
			scopedSlots: {
				customRender: 'serial'
			},
		}, {
			title: '学生姓名',
			dataIndex: 'stuName',
			key: 'stuName',
		}, {
			title: '题目类型',
			dataIndex: 'questionType',
			key: 'questionType',
			scopedSlots: {
				customRender: 'questionType'
			},

		},
		{
			title: '答案',
			key: 'answer',
			dataIndex: 'answer',
			scopedSlots: {
				customRender: 'answer'
			},
		},
		{
			title: '正确答案',
			key: 'trueAnswer',
			dataIndex: 'trueAnswer',
			scopedSlots: {
				customRender: 'trueAnswer'
			},
		},
		{
			title: '作答结果',
			key: 'answerResult',
			dataIndex: 'answerResult',
			scopedSlots: {
				customRender: 'answerResult'
			},
		},
		{
			title: '积分',
			key: 'score',
			dataIndex: 'score',

		},

	];

	export default {
		data() {
			return {
				visible: false,
				confirmLoading: false,
				title: '',
				columns: columns,
				record: {},
				isRate: false, //显示列表还是图表
				barxAxis: [],
				barData: [],
				dataSource: [],
				ratepolar: {},
				answerNumpolar: {},
				countpolar: {},
				testCode: '',

			}
		},
		created() {


		},
		methods: {
			handleCancel() {
				this.visible = false;

			},
			loadData(parameter) {
				console.log(this.testCode)
				const $me = this;
				return postAction(
					dataManageapi.testPaperRecdetails,
					Object.assign(parameter, {
						testCode: $me.testCode
					})
				).then(res => {
					return res;
				});

			},
			show(record) {
				console.log(record)
				this.title = '详情';
				this.visible = true;
				this.$nextTick(() => {
					this.testCode = record.testCode;
					console.log(this.testCode)
					this.$refs.table.refresh();
				})
			}
		},
		filters: {
			filterType(value) {
				var str = 'cesi';
				switch (value) {
					case '1':
						{
							str = "单题单选-字母题"
							break;
						}
					case '2':
						{
							str = "单题单选-判断题"
							break;
						}
					case '3':
						{
							str = "单题单选-数字题"
							break;
						}
					case '4':
						{
							str = "单题多选"
							break;
						}
					case '6':
						{
							str = "评分"
							break;
						}
					case '5':
						{
							str = "投票"
							break;
						}
				}
				return str
			},
			filterAnswer(value) {
				if (value == 'E' || value == 'true') {
					return '√'
				} else if (value == 'F' || value == 'false') {
					return '×'
				} else {
					return value
				}
			}
		},
		
	}
</script>

<style scoped="scoped" lang="less">
	.footer {
		text-align: left;
		font-size: 14px;
	}

	.footer span {
		color: #125fc9;
		margin-right: 40px;
	}

	.echartbar {
		width: 100%;
	}

	.echartpie {
		width: 50%;
	}
</style>
