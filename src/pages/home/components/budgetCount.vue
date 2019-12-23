<template>
	<a-card :bordered="false" class="cardbox" title="预算 VS 开销">
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
export default {
	name: 'score',
	data() {
		return {
			polar: {
			title : {
            subtext: '纯属虚构'
        },
        tooltip : {
            trigger: 'axis'
        },
        legend: {
            orient : 'vertical',
            x : 'right',
            y : 'bottom',
            data:['预算分配','实际开销']
        },
        polar : [
            {
                indicator : [
                    { text: '销售', max: 6000},
                    { text: '管理', max: 16000},
                    { text: '信息技术', max: 30000},
                    { text: '客服', max: 38000},
                    { text: '研发', max: 52000},
                    { text: '市场', max: 25000}
                ]
            }
        ],
        calculable : true,
        series : [
            {
                name: '预算 vs 开销',
                type: 'radar',
                data : [
                    {
                        value : [4300, 10000, 28000, 35000, 50000, 19000],
                        name : '预算分配'
                    },
                    {
                        value : [5000, 14000, 28000, 31000, 42000, 21000],
                        name : '实际开销'
                    }
                ]
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
/deep/ .ant-card-extra {
	padding: 0;
}
.selectSchool {
	width: 130px;
}
</style>
