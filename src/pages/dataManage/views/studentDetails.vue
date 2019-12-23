<template>
	<sub-page-view>
		<div class="viewlist">
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
			<div>
				<v-chart theme="ovilia-green" :options="ringoption" class="echartpie" style="width: 100%;" autoresize />
			</div>
			<template v-if="isRate">

				<v-chart theme="ovilia-green" :options="ratepolar" class="echartbar" autoresize />
				<div class="flex flex-pack-justify">
					<v-chart theme="ovilia-green" :options="answerNumpolar" class="echartpie" autoresize />
					<v-chart theme="ovilia-green" :options="countpolar" class="echartpie" autoresize />
				</div>
			</template>
		</div>
	</sub-page-view>
</template>

<script>
	import subPageView from '@/layouts/subPageView';
	import {
		getAnnulusOption
	} from '@/utils/charts.js'
	import ECharts from 'vue-echarts'
	import 'echarts/lib/chart/bar'
	import 'echarts/lib/chart/pie'
	import 'echarts/lib/chart/gauge'
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

	function formatValue(value, digits, returnStr = false) {
		if (digits < 0) {
			console.log('小数点后位数不能为负数')
			value = 0
		}
		if (!value) {
			value = 0
		}
		if (returnStr) {
			return parseFloat(value).toFixed(digits)
		}
		return parseFloat(parseFloat(value).toFixed(digits))
	}
	let ringoption = {
		backgroundColor: '#0E1327',
		tooltip: {
			formatter: "{a} <br/>{b} : {c}%"
		},

		series: [
			{
				type: 'gauge',
				radius: '70%',
				startAngle: '180',
				endAngle: '0',
				pointer: {
					show: false
				},
				detail: {
					formatter: function(value) {
						var num = Math.round(value);
						return '{bule|' + num + '}{white|分}' + '{size|' + '}\n{radius|综合健康评分}';
					},
					rich: {
						white: {
							fontSize: 30,
							color: '#fff',
							fontWeight: '500',
							padding: [20, 0, 0, 0]
						},
						bule: {
							fontSize: 40,
							fontFamily: 'DINBold',
							color: '#fff',
							fontWeight: '700',
							padding: [20, 0, 0, 0],
						},
						radius: {
							width: 300,
							height: 40,
							// lineHeight:80,
							borderWidth: 1,
							borderColor: '#0092F2',
							fontSize: 20,
							color: '#fff',
							backgroundColor: '#1B215B',
							borderRadius: 20,
							textAlign: 'center',
						},
						// size: {
						// 	height: 400,
						// 	padding: [100, 0, 0, 0]
						// }
					},
					"offsetCenter": ['0%', "0%"],
				},
				data: [{
					value: 91,
					name: '综合健康评分'
				}],
				title: {
					show: false,
				},
				axisLine: {
					show: true,
					lineStyle: {
						color: [
							[0.91, '#f00'],
							[1, '#15337C']
						],
						width: 10,
						// shadowBlur: 15,
						// shadowColor: '#B0C4DE',
						shadowOffsetX: 0,
						shadowOffsetY: 0,
						opacity: 1
					}
				},
				axisTick: {
					show: false
				},
				splitLine: {
					show: false,
					length: 25,
					lineStyle: {
						color: '#00377a',
						width: 2,
						type: 'solid',
					},
				},
				axisLabel: {
					show: false
				},
			},
			
			
		]
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
				countpolar: {},
				AnnulusOption: {},
				ringoption:ringoption
			}
		},
		components: {
			'vChart': ECharts,
			subPageView,
		},
		created() {
			var divisor = 1000;
			var dividend = 890;
			const data = [dividend, divisor - dividend]
			const colors = ['#4b7efe', '#beddff']
			const percentage = divisor === 0 ? 0 : dividend / divisor * 100
			const text = formatValue(percentage, 1) + '%'
			const subText = formatValue(percentage, 1) + '%'
			const textFontSize = 20
			const subTextFontSize = 0
			this.AnnulusOption = getAnnulusOption(data, colors, text, subText, textFontSize, subTextFontSize)

		},
		methods: {
			handleCancel() {
				this.visible = false;

			},
			show(record) {
				console.log(record)
				// 				this.dataSource = record.stuAnswerDetails;
				// 				this.title = record.stuName + '的答题详情';
				// 				this.record = record;
				// 				if (this.dataSource && this.dataSource.length > 0) {
				// 					this.barxAxis = this.dataSource.map(item => item.questionType);
				// 					this.barData = this.dataSource.map(item => item.score);
				// 					this.ratepolar = Object.assign({}, ratepolar);
				// 					this.ratepolar.xAxis[0].data = this.barxAxis;
				// 					this.ratepolar.series[0].data = this.barData;
				// 				}
				// 				let answerRate = [{
				// 					name: '答题数',
				// 					value: this.record.totalNum
				// 
				// 				}, {
				// 					name: '未答数',
				// 					value: this.record.stuAnswerDetails.length - this.record.totalNum
				// 				}];
				// 				this.answerNumpolar = Object.assign({}, answerNumpolar);
				// 				this.answerNumpolar.series[0].data = answerRate;
				// 				this.answerNumpolar.title.subtext = (this.record.totalNum / this.record.stuAnswerDetails.length * 100).toFixed(2) +
				// 					'%';
				// 				let trueAnswerRate = [{
				// 					name: '答对数',
				// 					value: this.record.totalTrueForQuNum
				// 
				// 				}, {
				// 					name: '错误数',
				// 					value: this.record.totalFlashForQuNum
				// 				}]
				// 				this.countpolar = Object.assign({}, countpolar);
				// 				this.countpolar.series[0].data = trueAnswerRate;
				// 				this.countpolar.title.subtext = (this.record.totalTrueForQuNum / this.record.totalNum * 100).toFixed(2) + '%';
				// 				this.visible = true;

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
