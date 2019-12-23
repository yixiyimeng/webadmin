<template>
	<a-card :bordered="false" class="cardbox" title="校区积分统计"><v-chart theme="ovilia-green" :options="polar" class="echart" autoresize /></a-card>
</template>

<script>
export default {
	name: 'score',
	data() {
		return {
			polar: {
				tooltip: {
					trigger: 'axis',
					axisPointer: {
						// 坐标轴指示器，坐标轴触发有效
						type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
					}
				},
				legend: {
					show: true,
					left: 'right',
					itemWidth: 14,
					data: ['直接访问', '直接访问1']
				},
				grid: {
					left: '3%',
					right: '4%',
					bottom: '3%',
					containLabel: true
				},
				xAxis: [
					{
						type: 'category',
						data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
						axisTick: {
							alignWithLabel: true
						}
					}
				],
				yAxis: [
					{
						type: 'value'
					}
				],
				series: [
					{
						name: '直接访问',
						type: 'bar',
						barGap: '1%',
						data: [10, 52, 200, 334, 390, 330, 220]
					},
					{
						name: '直接访问1',
						type: 'bar',
						data: [200, 10, 52, 200, 334, 390, 330]
					}
				]
			}
		};
	}
};
</script>

<style scoped="scoped" lang="less">
/deep/ .echarts {
	width: 100%;
	height: 400px;
}
/deep/ .ant-card-body {
	padding: 14px;
}
</style>
