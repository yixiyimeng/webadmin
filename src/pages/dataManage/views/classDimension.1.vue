<template>
	<sub-page-view>
		<div class="viewlist">
			<!--筛选条件-->
			<div class="flex topbar">
				<classfilterbar @handlerSearch="handlerSearch" @handlerReset="handlerRefresh" class="flex-1"></classfilterbar>
				<div class="handlerbtn">
					<a-button type="primary" @click="exportExcel">导出</a-button>
					<a-button icon='bars' :class="isRate?'':'ant-btn-success'" @click="isRate=false">列表</a-button>
					<a-button icon='bar-chart' :class="isRate?'ant-btn-success':''" @click="isRate=true">图表</a-button>
				</div>
			</div>

			<div class="tip">主题: <span>{{topicName}}</span>讲师: <span>{{teacherName}}</span>创建时间: <span>{{createDate}}</span>班级名称:
				<span>{{className}}</span>答题人数: <span>{{totalStu}}</span></div>
			<!--表格-->
			<!-- <s-table class="mt20" bordered :columns="columns" :data="loadData" rowKey="id" ref="table" :scroll="{ x: 1300 }"
			 size="small" :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}">
				<span slot="operation" slot-scope="text, record" class="operation">
					<a href="javascript:;" title="删除" class="del" v-has="'common:dict:remove'" @click="showDeleteConfirm(1,record.id)"><i
						 class="material-icons icon iconfont">delete</i></a>
				</span>
			</s-table> -->

			<a-table bordered :columns="columns" :dataSource="dataSource" rowKey="stuCode" ref="table" :scroll="{ x: 1300 }"
			 size="small" :pagination="false" v-show="!isRate" class="table-wrapper" :loading="loading">
				<a href="javascript:;" slot="stuName" slot-scope="text, record, index" @click="showStuDetail(record)">{{text}}</a>
				<span slot="serial" slot-scope="text, record, index" v-if="index<dataSource.length-1">
					{{ index + 1 }}
				</span>
				<span :slot="item.key" v-for="(item,index) in titleNames" :key="index" slot-scope="text, record" :style="{color:text.split('|')[1]=='true'?'#00a095':'#d43030'}">{{text.split('|')[0]}}</span>
			</a-table>
			<div class="echartbox" v-show="isRate">
				<v-chart theme="ovilia-green" :options="ratepolar" class="echart" autoresize />
				<v-chart theme="ovilia-green" :options="countpolar" class="echart" autoresize />
			</div>
		</div>
		<!-- 学生详情 -->
		<studetails ref="studetails"></studetails>
	</sub-page-view>
</template>

<script>
	import subPageView from '@/layouts/subPageView';
	import classfilterbar from '@/components/filterbar/classfilterbar'
	import studetails from './module/studetails'
	import ECharts from 'vue-echarts'
	import 'echarts/lib/chart/bar'
	import 'echarts/lib/component/tooltip'
	import 'echarts/lib/component/polar'
	import 'echarts/lib/component/legend'
	import 'echarts/lib/component/title.js'
	import theme from '@/assets/theme.json'
	ECharts.registerTheme('ovilia-green', theme);
	import pick from 'lodash.pick'
	import {
		dataManageapi
	} from '../api';
	import {
		rowSelection
	} from '@/mixins';
	import {
		postAction
	} from '@/api';
	import {
		fileUrl
	} from '@/utils/base.js';
	const columns = [{
			title: '#',
			scopedSlots: {
				customRender: 'serial'
			},
			align: 'center'
		}, {
			title: '姓名',
			dataIndex: 'stuName',
			key: 'stuName',
			// fixed: 'left',
			width: '32%',
			scopedSlots: {
				customRender: 'stuName'
			},

		},
		{
			title: '排名',
			key: 'ranking',
			dataIndex: 'ranking',
			// fixed: 'left',
			width: '32%'
		},
		{
			title: '综合正确率',
			key: 'compCorrRate',
			dataIndex: 'compCorrRate',
			// fixed: 'left',
			width: '32%'
		}
	];
	let rateOption = {
		title: {
			text: '班级正确率统计'
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
			}
		}],
		yAxis: [{
			type: 'value',
			max: 100,
			axisLabel: {
				formatter: '{value} %'
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
						return param.value > 0 ? param.value + '%' : '';
					},
					textStyle: {
						fontSize: 18
					}
				}
			}

		}]
	};
	let countOption = {
		title: {
			text: '班级答题数统计'
		},
		tooltip: {
			trigger: 'axis'
		},
		legend: {
			x: 'center',
			y: 'top',
			textStyle: {
				fontSize: 20
			},
			data: ['答对', '答错', '未答']
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
			}
		}],
		yAxis: [{
			type: 'value',
			axisLabel: {
				formatter: '{value} 人'
			},
			minInterval: 1
		}],
		series: [{
			type: 'bar',
			name: '答对',
			data: [],
			stack: '参与人数',
			barMaxWidth: 100,
			label: {
				normal: {
					show: true,
					position: 'inside',
					color: '#fff',
					formatter: function(param) {
						return param.value > 0 ? param.value + '人' : '';
					},
					textStyle: {
						fontSize: 18
					}
				}
			}

		}, {
			type: 'bar',
			name: '答错',
			data: [],
			stack: '参与人数',
			barMaxWidth: 100,
			label: {
				normal: {
					show: true,
					position: 'inside',
					color: '#fff',
					formatter: function(param) {
						return param.value > 0 ? param.value + '人' : '';
					},
					textStyle: {
						fontSize: 18
					}
				}
			}

		}, {
			type: 'bar',
			data: [],
			name: '未答',
			stack: '参与人数',
			barMaxWidth: 100,
			label: {
				normal: {
					show: true,
					position: 'inside',
					color: '#fff',
					formatter: function(param) {
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
		mixins: [rowSelection],
		components: {
			subPageView,
			classfilterbar,
			'vChart': ECharts,
			studetails
		},
		data() {
			return {
				columns: columns,
				topicName: '',
				teacherName: '',
				createDate: '',
				className: '',
				totalStu: '',
				dataSource: [],
				filter: {},
				titleNames: [],
				ratepolar: {},
				countpolar: {},
				isRate: false,
				loading: false
			};
		},
		methods: {
			loadData(param) {
				//做一些异步操作
				this.loading = true;
				postAction(
					dataManageapi.getClass,
					param
				).then(res => {
					if (res.code == 0) {
						this.topicName = res.data.topicName;
						this.teacherName = res.data.teacherName;
						this.createDate = res.data.createDate;
						this.className = res.data.className;
						this.totalStu = res.data.totalStu;
						this.titleNames = [];
						let ratexAxis = [];
						let rateData = [];
						let totalTrueStulist = [];
						let totalFalseStulist = [];
						let totalNoneStulist = [];
						if (res.data.stuDetailDos && res.data.stuDetailDos.length > 0) {
							this.dataSource = res.data.stuDetailDos.map(item => {
								let param = pick(item, 'stuName', 'ranking', 'compCorrRate', 'stuCode', 'stuAnswerDetails', 'compCorrRate',
									'ranking');
								let stuAnswerDetails = item.stuAnswerDetails;
								for (var i = 0; i < stuAnswerDetails.length; i++) {
									param[stuAnswerDetails[i].questionId] = stuAnswerDetails[i].answer + '|' + stuAnswerDetails[i].answerResult
								}
								param.totalTrueForQuNum = item.totalTrueForQue.length;
								param.totalNum = item.totalFalseForQue.length + item.totalTrueForQue.length;
								param.totalFlashForQuNum = item.totalFalseForQue.length;
								return param;
							});
							let lastdata = {
								stuName: '合计',
							}
							for (var i = 0; i < res.data.queAvCorrRateList.length; i++) {
								lastdata[res.data.queAvCorrRateList[i].questionId] = res.data.queAvCorrRateList[i].corrRate;
								var num = parseFloat(res.data.queAvCorrRateList[i].corrRate.slice(0, res.data.queAvCorrRateList[i].corrRate.length -
									1));
								rateData.push(num);
								totalFalseStulist.push(res.data.queAvCorrRateList[i].totalFalseStu);
								totalNoneStulist.push(res.data.queAvCorrRateList[i].totalNoneStu);
								totalTrueStulist.push(res.data.queAvCorrRateList[i].totalTrueStu);
							}
							console.log(lastdata);
							this.dataSource.push(lastdata)
						} else {
							this.dataSource = [];
						}


						if (res.data.titleNames && res.data.titleNames.length > 0) {
							for (var i = 0; i < res.data.titleNames.length; i++) {
								var item = res.data.titleNames[i];
								var obj = {
									title: item.titleName,
									key: item.questionId,
									dataIndex: item.questionId,
									scopedSlots: {
										customRender: item.questionId
									}
								}
								this.titleNames.push(obj);
								ratexAxis.push(item.titleName)
							}

							let normalcolumns = JSON.parse(JSON.stringify(columns));
							this.columns = [...normalcolumns.map(item => {
								if (item.title == '#') {
									item.width = 100;
								} else {
									item.width = 180;
								}

								item.fixed = 'left';
								return item
							}), ...this.titleNames];

						} else {
							this.columns = [...columns]
						}
						let ratepolar = Object.assign({}, rateOption);
						ratepolar.xAxis[0].data = ratexAxis;
						ratepolar.series[0].data = rateData;
						let countpolar = Object.assign({}, countOption);
						countpolar.xAxis[0].data = ratexAxis;
						countpolar.series[0].data = totalTrueStulist;
						countpolar.series[1].data = totalFalseStulist;
						countpolar.series[2].data = totalNoneStulist;
						if (ratexAxis.length > 10) {
							let dataZoom = [{
								show: true,
								start: 70,
								end: 100
							}, {
								type: 'inside',
								start: 70,
								end: 100
							}]
							countpolar.dataZoom = dataZoom;
							ratepolar.dataZoom = dataZoom;
						}
						this.ratepolar = ratepolar;
						this.countpolar = countOption;
					}
				}).finally(() => {
					this.loading = false
				});
			},
			/*查询*/
			handlerSearch(obj) {
				this.filter = obj;
				console.log(this.filter);
				if (obj && obj.topicCode && obj.classCode) {
					this.loadData(obj);
				} else {
					this.$message.info('请选择主题和班级')
				}

				// this.$refs.table.refresh();
			},
			/* 刷新列表 */
			handlerRefresh() {
				this.columns = [...columns];
				this.dataSource = [];
				this.ratepolar = {};
				this.countpolar = {};
				this.topicName = '';
				this.teacherName = '';
				this.createDate = '';
				this.className = '';
				this.totalStu = '';
			},
			exportExcel() {
				if (this.dataSource.length <= 0) {
					this.$message.error('查询结果为空,请修改筛选条件，再次查询');
					return false;
				}
				postAction(
					dataManageapi.exportExcel,
					this.filter
				).then(res => {
					if (res.code == 0) {
						let link = document.createElement('a');
						let filename = res.data.split('/');
						link.download = filename[filename.length - 1];
						link.style.display = 'none'
						link.href = fileUrl + '/plat' + res.data;
						document.body.appendChild(link)
						link.click()
						document.body.removeChild(link)
					}
				})
			},
			/* 查看详情 */
			showStuDetail(record) {
				this.$refs.studetails.show(record)
			}
		}
	};
</script>

<style scoped="scoped" lang="less">
	.table-wrapper .operation {
		a {
			font-size: 20px;
			margin: 0 10px;

			&.del {
				color: #d43030;
			}

			&.add {
				color: #00baad;
			}
		}
	}

	.tip {
		color: #676a6c;
		font-size: 14px;
		line-height: 30px;
		margin: 10px 10px 0;
	}

	.tip span {
		color: #125fc9;
		margin-right: 40px;
	}

	.echart {
		width: 100%;
		background: none;
	}
</style>
