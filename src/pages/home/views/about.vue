<template>
	<sub-page-view>
		<a-card :bordered="false" class="cardbox"><company :companyinfo="companyinfo"></company></a-card>
		<div class="chartbox clearfix">
			<temp type="pages/home/components/scoreCount"></temp>
			<temp type="pages/home/components/teacherCount"></temp>
			<temp type="pages/home/components/budgetCount"></temp>
			<temp type="pages/home/components/scatterCount"></temp>
			<a-card :bordered="false" class="cardbox"><v-chart :options="polar" class="echart" autoresize /></a-card>
		</div>
	</sub-page-view>
</template>

<script>
import subPageView from '@/layouts/subPageView';
import temp from '@/components/temp.vue';
import company from '@/pages/home/components/company.vue';
export default {
	components: {
		subPageView,
		company,
		temp
	},
	data() {
		return {
			companyinfo: {
				info:'深圳中科讯联科技股份有限公司 [1] 是由中科院深圳先进技术研究院“RFID国家重点实验室”和讯方控股共同出资成立的国有股份制企业。公司依托中科院在基础和应用领域的丰富科研成果，致力于物联网应用的研发和产业化，包括移动支付产品的研发和产业化，以及配套设备的研发和生产等。中科讯联是国内提供RF-SIM卡的厂商之一。中科讯联的产品也得到了国家科技部、广东省科技局重点关注，被列为重点发展项目，并获得科技研发资金支持。',
				companyname: '中科讯联官方网站',
				url: 'http://www.zkxltech.com/'
			},
			polar: {
				title: {
					text: '会员数据统计',
					subtext: '动态数据',
					x: 'center'
				},
				tooltip: {
					trigger: 'item',
					formatter: '{a} <br/>{b} : {c} ({d}%)'
				},
				legend: {
					show: true,
					orient: 'vertical',
					left: 'left',
					data: ['微信访问', '公众号访问', '扫码进入', '分享进入', '搜索访问']
				},
				series: [
					{
						name: '访问来源',
						type: 'pie',
						radius: '55%',
						center: ['50%', '60%'],
						data: [
							{ value: 335, name: '微信访问' },
							{ value: 310, name: '公众号访问' },
							{ value: 234, name: '扫码进入' },
							{ value: 135, name: '分享进入' },
							{ value: 1548, name: '搜索访问' }
						],
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
		};
	}
};
</script>

<style scoped="scoped" lang="less">
.cardbox {
	border-radius: 6px;
	box-shadow: 0 0 6px rgba(181, 181, 181, 0.5);
}
.chartbox {
	margin-top: 20px;
}
.chartbox .cardbox {
	width: -moz-calc(50% - 10px);
	width: -webkit-calc(50% - 10px);
	width: calc(50% - 10px);
	float: right;
	margin-bottom: 20px;
}
.chartbox .cardbox:nth-child(odd) {
	float: left;
	margin-right: 10px;
}
.chartbox .cardbox:nth-child(even) {
	margin-left: 10px;
}
/deep/ .echarts {
	width: 100%;
	height: 400px;
}
</style>
