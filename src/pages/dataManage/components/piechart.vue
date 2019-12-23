<template>
	<v-chart theme="ovilia-green" :options="rateOption" class="echart" autoresize />
</template>

<script>
	import ECharts from 'vue-echarts'
	import 'echarts/lib/chart/pie'
	import 'echarts/lib/component/tooltip'
	import 'echarts/lib/component/polar'
	import 'echarts/lib/component/legend'
	import 'echarts/lib/component/title.js'
	import theme from '@/assets/theme.json'
	let option = {
			title: {
				text: '',
				x: 'center'
			},
			tooltip: {
				trigger: 'item',
				formatter: '{a} <br/>{b} : {c} ({d}%)'
			},
			// legend: {
			// 	show: true,
			// 	orient: 'vertical',
			// 	left: 'left',
			// 	data: ['微信访问', '公众号访问', '扫码进入', '分享进入', '搜索访问']
			// },
			series: [
				{
					name: '访问来源',
					type: 'pie',
					radius: '55%',
					center: ['50%', '60%'],
					data: [],
					itemStyle: {
						emphasis: {
							shadowBlur: 10,
							shadowOffsetX: 0,
							shadowColor: 'rgba(0, 0, 0, 0.5)'
						}
					}
				}
			]

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
			
			countdata: {
				handler(newval, oldval) {
					if (newval != oldval) {
						let rateOption = Object.assign({}, this.rateOption);
						rateOption.series[0].data=this.countdata;
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
