<template>
	<v-chart theme="ovilia-green" :options="rateOption" class="echart" autoresize />
</template>

<script>
	import ECharts from 'vue-echarts'
	import 'echarts/lib/chart/line'
	import 'echarts/lib/component/tooltip'
	import 'echarts/lib/component/polar'
	import 'echarts/lib/component/legend'
	import 'echarts/lib/component/title.js'
	import theme from '@/assets/theme.json'
	let option = {
		title: {
			text: ''
		},
		tooltip: {
			trigger: 'axis',
			formatter: function(value) {
				//console.log(value)
				return value[0].value + '%'
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
				formatter: '{value} %'
			}
		}],
		series: [{
			type: 'line',
			data: [],
			smooth: true,
			label: {
				normal: {
					show: true,
					position: 'top',
					color: '#000',
					formatter: function(param) {
						// return param.value + '%';
						return param.value > 0 ? param.value + '%' : '';
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
			}
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
						rateOption.series=this.countdata;
						console.log(this.countdata)
						this.rateOption = rateOption;
					}
				},
				deep:true,
				immediate: true
			},

		}
	}
</script>

<style scoped="scoped" lang="less">
	.echart {
		width: 100%;
		background: none;
	}
</style>
