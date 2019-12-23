<template>
	<v-chart theme="ovilia-green" :options="rateOption" class="echart" autoresize />
</template>

<script>
	import ECharts from 'vue-echarts'
	import 'echarts/lib/chart/bar'
	import 'echarts/lib/component/tooltip'
	import 'echarts/lib/component/polar'
	import 'echarts/lib/component/legend'
	import 'echarts/lib/component/title.js'
	// import 'echarts/lib/component/markLine.js'
	import theme from '@/assets/theme.json'
	let option = {
		title: {
			text: ''
		},
		tooltip: {
			trigger: 'axis',
			formatter: function(value) {
				//console.log(value)
				return value[0].value + '人'
			}

		},

		grid: {
			x: 60,
			x2: 40,
			y2: 54
		},
		calculable: true,
		xAxis: [{
			type: 'category',
			data: [],
			axisLabel: {
				interval: 0
			},
			axisLine: {
				show: false
			},

		}],
		yAxis: [{
			type: 'value',
			max: 100,
			axisLine: {
				show: false
			},
			axisLabel: {
				formatter: '{value} 人'
			}
		}],
		series: [{
			type: 'bar',
			data: [],
			barMaxWidth: 100,
			label: {
				normal: {
					show: true,
					position: 'top',
					color: '#000',
					formatter: function(param) {
						// return param.value + '%';
						return param.value > 0 ? param.value + '人' : '';
					},
					textStyle: {
						fontSize: 18
					}
				}
			}

		}]

	}
	export default {
		components: {
			'vChart': ECharts,
		},
		data() {
			return {
				rateOption: option
			}
		},
		props: {
			title: {
				type: String,
				default: ''
			},
			Xdata: {
				type: Array,
				default: []
			},
			countdata: {
				type: Array,
				default: []
			},
			unit: {
				type: String,
				default: '人'
			}
		},
		created() {
			console.log('哈哈哈');
			let unit = newval;
			option.tooltip = {
				trigger: 'axis',
				formatter: function(value) {
					return value[0].value + unit
				}
			}
			option.yAxis[0].axisLabel = {
				formatter: '{value}' + unit
			}
			console.log(unit)
			option.series[0].label.normal.formatter = function(param) {
					return param.value > 0 ? param.value + unit : '';
				},
				this.rateOption = option;

		},
		watch: {
			title: {
				handler(newval, oldval) {
					if (newval != oldval) {
						let rateOption = Object.assign({}, this.rateOption, {
							title: {
								text: this.title
							},
						})
						this.rateOption = rateOption;
					}
				},
				immediate: true
			},
			Xdata: {
				handler(newval, oldval) {
					if (newval != oldval) {
						let rateOption = Object.assign({}, this.rateOption, {
							xAxis: {
								data: this.Xdata
							},
						})
						this.rateOption = rateOption;
					}
				},
				immediate: true
			},
			countdata: {
				handler(newval, oldval) {
					if (newval != oldval) {
						let rateOption = Object.assign({}, this.rateOption);
						rateOption.series[0].data = this.countdata;
						this.rateOption = rateOption;
					}
				},
				immediate: true
			},
			// unit: {
			// 	handler(newval, oldval) {
			// 		if (newval != oldval) {
			// 			
			// 		}
			// 	},
			// 	immediate: true
			// },

		}
	}
</script>

<style scoped="scoped" lang="less">
	.echart {
		width: 100%;
		background: none;
	}
</style>
