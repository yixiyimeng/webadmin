<template>
	<a-modal :title="title" width="80%" :visible="visible" :confirmLoading="confirmLoading" :destroyOnClose="true" @cancel="handleCancel"
	 :bodyStyle="{maxHeight:'400px',overflow:'auto'}" :footer="false" :maskClosable="false">
		<div class="flex flex-pack-justify">
			<div class="footer">
				作答题数：<span>{{record.totalNum}}</span>
				答对题数：<span>{{record.totalTrueForQuNum}}</span>
				正确率题数：<span>{{record.compCorrRate}}</span>
				排名：<span>{{record.ranking}}</span>
			</div>
			<div class="handlerbtn">
				<a-button icon='bars' :class="isRate?'':'ant-btn-success'" @click="isRate=false">列表</a-button>
				<a-button icon='bar-chart' :class="isRate?'ant-btn-success':''" class="ml10" @click="isRate=true">图表</a-button>
			</div>
		</div>
		<a-table class="mt20" :columns="columns" :dataSource="dataSource" rowKey="questionId" :pagination="false" bordered
		 size="small" v-if="!isRate">
			<span slot="answer" slot-scope="text, record" :style="{color:record.answerResult=='true'?'#00a095':'#d43030'}">{{text}}</span>
		</a-table>
		<template v-if="isRate">
			<v-chart theme="ovilia-green" :options="ratepolar" class="echartbar" autoresize />
			<div class="flex flex-pack-justify">
				<v-chart theme="ovilia-green" :options="answerNumpolar" class="echartpie" autoresize />
				<v-chart theme="ovilia-green" :options="countpolar" class="echartpie" autoresize />
			</div>
		</template>
	</a-modal>
</template>

<script>
	import ECharts from 'vue-echarts'
	import 'echarts/lib/chart/bar'
	import 'echarts/lib/chart/pie'
	import 'echarts/lib/component/tooltip'
	import 'echarts/lib/component/polar'
	import 'echarts/lib/component/legend'
	import 'echarts/lib/component/title.js'
	import theme from '@/assets/theme.json'
	ECharts.registerTheme('ovilia-green', theme);
	const columns = [{
			title: '答题题号',
			dataIndex: 'questionId',
			key: 'questionId',
		}, {
			title: '题目',
			dataIndex: 'questionType',
			key: 'questionType',

		},
		{
			title: '按键值',
			key: 'answer',
			dataIndex: 'answer',
			scopedSlots: {
				customRender: 'answer'
			},
		},
		{
			title: '积分',
			key: 'score',
			dataIndex: 'score',

		},
		{
			title: '作答速度',
			key: 'speed',
			dataIndex: 'speed',

		}
	];
	let ratepolar = {
		title: {
			text: '获取积分统计',

		},
		tooltip: {
			trigger: 'axis'
		},

		grid: {
			x: 60,
			x2: 40,
			y2: 54
		},
		calculable: true,
		xAxis: [{
			type: 'category',
			data: ['123', '234']
		}],
		yAxis: [{
			type: 'value',
			axisLabel: {
				formatter: '{value} 分'
			}
		}],
		series: [{
			type: 'bar',
			data: [1, 10],
			barMaxWidth: 100,
			label: {
				normal: {
					show: true,
					position: 'inside',
					color: '#fff',
					formatter: function(param) {
						return param.value > 0 ? param.value + '分' : '';
					},
					textStyle: {
						fontSize: 18
					}
				}
			}

		}]
	}
	let answerNumpolar = {
		title: {
			text: '答题率',
			subtext: '10%',
			x: 'center',
			top: 'middle'
		},
		tooltip: {
			trigger: 'item',
			formatter: "{b} :<br/> {c} ({d}%)"
		},
		calculable: true,
		series: [{
			type: 'pie',
			radius: ['60%', '80%'],
			center: ['50%', '50%'],
			data: [],
			label: {
				normal: {
					show: false,
					formatter: "{b} :\n {c}题 ({d}%)",
					textStyle: {
						fontSize: 18
					}
				}
			}
		}]
	}
	let countpolar = {
		title: {
			text: '正确率',
			subtext: '20%',
			x: 'center',
			top: 'middle'
		},
		tooltip: {
			trigger: 'item',
			formatter: "{b} :<br/> {c} ({d}%)"
		},
		calculable: true,
		series: [{
			type: 'pie',
			radius: ['60%', '80%'],
			center: ['50%', '50%'],
			data: [],
			label: {
				normal: {
					show: false,
					formatter: "{b} :\n {c}题 ({d}%)",
					textStyle: {
						fontSize: 18
					}
				}
			}
		}]
	}
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
				countpolar: {}
			}
		},
		components: {
			'vChart': ECharts,
		},
		created() {


		},
		methods: {
			handleCancel() {
				this.visible = false;

			},
			show(record) {
				console.log(record)
				this.dataSource = record.stuAnswerDetails;
				this.title = record.stuName + '的答题详情';
				this.record = record;
				if (this.dataSource && this.dataSource.length > 0) {
					this.barxAxis = this.dataSource.map(item => item.questionType);
					this.barData = this.dataSource.map(item => item.score);
					this.ratepolar = Object.assign({}, ratepolar);
					this.ratepolar.xAxis[0].data = this.barxAxis;
					this.ratepolar.series[0].data = this.barData;
				}
				let answerRate = [{
					name: '答题数',
					value: this.record.totalNum

				}, {
					name: '未答数',
					value: this.record.stuAnswerDetails.length - this.record.totalNum
				}];
				this.answerNumpolar = Object.assign({}, answerNumpolar);
				this.answerNumpolar.series[0].data = answerRate;
				this.answerNumpolar.title.subtext = (this.record.totalNum / this.record.stuAnswerDetails.length * 100).toFixed(2) +
					'%';
				let trueAnswerRate = [{
					name: '答对数',
					value: this.record.totalTrueForQuNum

				}, {
					name: '错误数',
					value: this.record.totalFlashForQuNum
				}]
				this.countpolar = Object.assign({}, countpolar);
				this.countpolar.series[0].data = trueAnswerRate;
				this.countpolar.title.subtext = (this.record.totalTrueForQuNum / this.record.totalNum * 100).toFixed(2) + '%';
				this.visible = true;

			}
		}
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
