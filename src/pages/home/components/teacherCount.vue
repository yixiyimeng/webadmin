<template>
	<a-card :bordered="false" class="cardbox" title="讲师职称统计">
		<div slot="extra">
			<a-select class="selectSchool">
				<a-select-option value="jack">Jack</a-select-option>
				<a-select-option value="lucy">Lucy</a-select-option>
				<a-select-option value="disabled" disabled>Disabled</a-select-option>
				<a-select-option value="Yiminghe">yiminghe</a-select-option>
			</a-select>
		</div>
		<v-chart theme="ovilia-green" :options="polar" class="echart" autoresize />
	</a-card>
</template>

<script>
var data = [
	{
		name: '初级讲师',
		value: 54
	},
	{
		name: '中级讲师',
		value: 44
	},
	{
		name: '高级讲师',
		value: 35
	},
	{
		name: '特级讲师',
		value: 30
	},
// 	{
// 		name: '商贸物流',
// 		value: 20
// 	}
];

var titleArr = [],
	seriesArr = [];
var colors = [['rgba(73, 157, 248, 1)', 'rgba(245, 245, 245, 1)'], ['rgba(172, 51, 193, 1)', 'rgba(245, 245, 245, 1)'], ['rgba(255, 141, 26, 1)', 'rgba(245, 245, 245, 1)'], ['rgba(212, 48, 48, 1)', 'rgba(245, 245, 245, 1)']];
data.forEach(function(item, index) {
	titleArr.push({
		text: item.name,
		left: index * 25 + 14 + '%',
		top: '40%',
		textAlign: 'center',
		textStyle: {
			fontWeight: 'normal',
			fontSize: '14',
			color: colors[index][0],
			textAlign: 'center'
		}
	});
	seriesArr.push({
		name: item.name,
		type: 'pie',
		clockWise: false,
		radius: [55, 70],
		itemStyle: {
			normal: {
				color: colors[index][0],
				shadowColor: colors[index][0],
				shadowBlur: 0,
				label: {
					show: false
				},
				labelLine: {
					show: false
				}
			}
		},
		hoverAnimation: false,
		center: [index * 25 + 15 + '%', '50%'],
		data: [
			{
				value: item.value,
				label: {
					normal: {
						formatter: function(params) {
							return params.value + '%';
						},
						position: 'center',
						distance:50,
						show: true,
						textStyle: {
							fontSize: '18',
							fontWeight: 'bold',
							color: colors[index][0]
						}
					}
				}
			},
			{
				value: 100 - item.value,
				name: 'invisible',
				itemStyle: {
					normal: {
						color: colors[index][1]
					},
					emphasis: {
						color: colors[index][1]
					}
				}
			}
		]
	});
});
export default {
	name: 'score',
	data() {
		return {
			polar: {
				title: titleArr,
				series: seriesArr
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
/deep/ .ant-card-extra {
	padding: 0;
}
.selectSchool {
	width: 130px;
}
</style>
