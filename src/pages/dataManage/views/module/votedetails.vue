<template>
	<a-modal :title="title" :width="1200" :visible="visible" :confirmLoading="confirmLoading" :destroyOnClose="true"
	 @cancel="handleCancel" :bodyStyle="{maxHeight:'450px',overflow:'auto'}" :footer="false" :maskClosable="false">
		<v-chart theme="ovilia-green" :options="countpolar" class="echart" autoresize />
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
	import {
		dataManageapi
	} from '../../api';
	import {
		postAction
	} from '@/api';
	let countOption = {
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				// 坐标轴指示器，坐标轴触发有效
				type: '' // 默认为直线，可选为：'line' | 'shadow'
			}
		},
		legend: {
			show: true,
			left: 'right',
			itemWidth: 14,
			orient: 'vertical',
			data: []
		},
		grid: {
			left: '3%',
			right: '4%',
			bottom: '3%',
			containLabel: true
		},
		xAxis: {
			type: 'category',
			boundaryGap: true,
			show: true,
			axisTick: {
				show: false
			},
			axisLabel: {
				fontSize: 16,
				color: '#3f9be1',
				margin: 8,
				interval: 0
			},
			axisLine: {
				lineStyle: {
					type: 'solid',
					color: '#3f9be1',
					width: '2' //坐标线的宽度
				},
				symbol: ['none', 'arrow'],
				symbolSize: [12, 20],
				symbolOffset: [0, 10]
			},
			data: ['赞成', '反对', '弃权']
		},
		yAxis: {
			type: 'value',
			scale: true,
			name: '',
			axisLine: {
				show: false
			},
			splitNumber: 4,
			splitLine: {
				show: false
			},
			axisLabel: {
				fontSize: 16,
				color: '#3f9be1',
				margin: 12
			},
			axisLine: {
				lineStyle: {
					type: 'solid',
					color: '#3f9be1',
					width: '2' //坐标线的宽度
				},
				symbol: ['none', 'arrow'],
				symbolSize: [12, 20],
				symbolOffset: [0, 10]
			},
			min: 0,
			minInterval: 1,
		},

	}
	let scoreOption = {
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				// 坐标轴指示器，坐标轴触发有效
				type: '' // 默认为直线，可选为：'line' | 'shadow'
			}
		},
		legend: {
			show: true,
			left: 'right',
			itemWidth: 14,
			orient: 'vertical',
			data: []
		},
		grid: {
			left: '3%',
			right: '4%',
			bottom: '3%',
			containLabel: true
		},
		xAxis: {
			type: 'category',
			boundaryGap: true,
			show: true,
			axisTick: {
				show: false
			},
			axisLabel: {
				fontSize: 16,
				color: '#3f9be1',
				margin: 8,
				interval: 0
			},
			axisLine: {
				lineStyle: {
					type: 'solid',
					color: '#3f9be1',
					width: '2' //坐标线的宽度
				},
				symbol: ['none', 'arrow'],
				symbolSize: [12, 20],
				symbolOffset: [0, 10]
			},
			data: ['总分', '人数', '平均分']
		},
		yAxis: {
			type: 'value',
			scale: true,
			name: '',
			axisLine: {
				show: false
			},
			splitNumber: 4,
			splitLine: {
				show: false
			},
			axisLabel: {
				fontSize: 16,
				color: '#3f9be1',
				margin: 12
			},
			axisLine: {
				lineStyle: {
					type: 'solid',
					color: '#3f9be1',
					width: '2' //坐标线的宽度
				},
				symbol: ['none', 'arrow'],
				symbolSize: [12, 20],
				symbolOffset: [0, 10]
			},
			min: 0,
		},

	}
	export default {
		data() {
			return {
				visible: false,
				confirmLoading: false,
				title: '',
				record: {},
				isRate: false, //显示列表还是图表
				barxAxis: [],
				barData: [],
				dataSource: [],
				ratepolar: {},
				answerNumpolar: {},
				countpolar: {},
				questionType: 6,
				titleCode: '',
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
				/* 区别投票。还是评分 */
				this.visible = true;
				this.questionType = record.questionType;
				this.title = this.questionType == '6' ? '评分详情' : '投票详情';
				this.titleCode = record.titleCode;
				this.voteScoreTitleDetail();
			},
			voteScoreTitleDetail() {
				postAction(dataManageapi.voteScoreTitleDetail, {
					titleCode: this.titleCode
				}).then(da => {
					if (da && da.data.length > 0) {
						var list = da.data
						var title = [];
						var serieslist = [];
						for (var i = 0; i < list.length; i++) {
							var item = list[i];
							// voteAgreeCount.push(item.voteAgreeCount);
							// voteDisagreeCount.push(item.voteDisagreeCount);
							// voteAbstainCount.push(item.voteAbstainCount);
							title.push(item.questionName)
							var seriesitem = {
								name: item.questionName,
								type: 'bar',
								label: {
									normal: {
										show: true,
										position: 'top',
										textStyle: {
											color: '#3f9be1'
										},
										fontSize: 16
									}
								},
								itemStyle: {
									barBorderRadius: [2, 2, 0, 0]
								},
								barWidth: '30',

							}
							if (this.questionType == '6') {
								seriesitem.data = [item.scoreCount, item.stuCount, item.scoreAvg]
							} else {
								seriesitem.data = [item.voteAgreeCount, item.voteDisagreeCount, item.voteAbstainCount]
							}
							serieslist.push(seriesitem)
						}
						if (this.questionType == '6') {
							var Option = Object.assign({}, scoreOption);
						} else {
							var Option = Object.assign({}, countOption);
							
						}
						Option.legend.data = title;
						Option.series = serieslist;
						this.countpolar = Option;
					}
				})
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

	.echart {
		width: 100%;
	}
</style>
