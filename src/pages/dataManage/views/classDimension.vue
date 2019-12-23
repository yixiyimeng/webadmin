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
			<!-- v-show="isRate" -->
			<a-card :bordered="false" class="cardbox">
				<div slot="extra">
					<div class="extra-item">
						<a>今日</a>
						<a>本周</a>
						<a>本月</a>
						<a>本年</a>
					</div>
					<a-range-picker :style="{width: '256px'}" />
				</div>
				<div class="echartbox">
					<barchart title='班级综合正确率' :Xdata='countXdata' :countdata="countdata"></barchart>
					<barchart title='参与率对比' :Xdata='countXdata' :countdata="countdata"></barchart>

				</div>
			</a-card>
			<a-card :bordered="false" class="cardbox mt20" title="语文-科目排名统计">
				<div class="flex">
					<div class="flex-1">
						<div class="userlist">
							<div class="item flex" v-for="(item,index) in highscorelist" :key="index">
								<i>{{item.rank}}</i>
								<div class="flex-1">
									<p>张三</p>
									<p>高三一班</p>
								</div>
								<span>90%</span>
							</div>
						</div>
					</div>
					<div class="flex-1">
						<div class="userlist">
							<div class="item flex" v-for="(item,index) in lowscorelist" :key="index">
								<i>{{item.rank}}</i>
								<div>
									<p>张三</p>
									<p>高三一班</p>
								</div>
								<span>90%</span>
							</div>
						</div>
					</div>
				</div>
			</a-card>
			<a-card :bordered="false" class="cardbox mt20" title="语文--班级排名统计">
				<div slot="extra">
					<div class="extra-item">
						<a>今日</a>
						<a>本周</a>
						<a>本月</a>
						<a>本年</a>
					</div>
					<a-range-picker :style="{width: '256px'}" />
				</div>
				<div class="tablink">
					<span>全年级</span>
					<span class="active">三1班</span>
					<span>三2班</span>
				</div>
				<numbarchart title='百分段分析' :Xdata='countXdata' :countdata="countdata"  unit="人"></numbarchart>
				<linechart title='综合正确率进步趋势' :Xdata='countXdata' :countdata="linecountdata"></linechart>
			</a-card>
			<a-card :bordered="false" class="cardbox mt20">
				<div class="tablink">
					<span>全年级</span>
					<span class="active">三1班</span>
					<span>三2班</span>
				</div>
				<div class="flex">
					<piechart class="flex-1" title='班级答题类型占比'  :countdata="questiontype"></piechart>
					<numbarchart class="flex-1" title='班级答题类型数量' :Xdata='countXdata' :countdata="countdata" unit="题"></numbarchart>
				</div>
			</a-card>
		</div>
		<!-- 学生详情 -->
		<studetails ref="studetails"></studetails>
	</sub-page-view>
</template>

<script>
	import subPageView from '@/layouts/subPageView';
	import classfilterbar from '@/components/filterbar/classfilterbar';
	import barchart from '../components/barchart'
	import numbarchart from '../components/numbarchart'
	import piechart from '../components/piechart'
	import linechart from '../components/linechart'
	import studetails from './module/studetails'
	import ECharts from 'vue-echarts'
	import 'echarts/lib/chart/bar'
	import 'echarts/lib/component/tooltip'
	import 'echarts/lib/component/polar'
	import 'echarts/lib/component/legend'
	import 'echarts/lib/component/title.js'
	import 'echarts/lib/component/markLine.js'
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
		},

		{
			title: '姓名',
			dataIndex: 'stuName7',
			key: 'stuName7',
			scopedSlots: {
				customRender: 'stuName'
			},

		}, {
			title: '校区',
			dataIndex: 'stuName6',
			key: 'stuName6',
			scopedSlots: {
				customRender: 'stuName'
			},

		},
		{
			title: '班级',
			dataIndex: 'stuName5',
			key: 'stuName5',
			// fixed: 'left',
			scopedSlots: {
				customRender: 'stuName'
			},

		},
		{
			title: '科目',
			dataIndex: 'stuName15',
			key: 'stuName15',


		},

		{
			title: '综合正确率排名',
			key: 'ranking',
			dataIndex: 'ranking',
			width: '100px'

		},
		{
			title: '主题',
			dataIndex: 'stuName4',
			key: 'stuName4',

		},
		{
			title: '发题数量',
			dataIndex: 'stuName3',
			key: 'stuName3',


		},
		{
			title: '绑定人数',
			dataIndex: 'stuName2',
			key: 'stuName2',

		},
		{
			title: '参与率',
			dataIndex: 'stuName1',
			key: 'stuName1',
			sorter: true,

		},
		{
			title: '综合正确率',
			key: 'compCorrRate1',
			dataIndex: 'compCorrRate1',
			width: '100px',
			sorter: true,

		},
		{
			title: '班级最高正确率',
			key: 'compCorrRate2',
			dataIndex: 'compCorrRate2',
			width: '100px'

		},
		{
			title: '班级最低正确率',
			key: 'compCorrRate3',
			dataIndex: 'compCorrRate3',
			width: '100px'
			// fixed: 'left',

		}
	];

	export default {
		mixins: [rowSelection],
		components: {
			subPageView,
			classfilterbar,
			'vChart': ECharts,
			studetails,
			barchart,
			numbarchart,
			linechart,
			piechart
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
				isRate: false,
				loading: false,
				countXdata: ['一般', '二部', '三班'],
				countdata: [10, 30],
				highscorelist: [{
					rank: 1,
					name: '张三'
				}, {
					rank: 2,
					name: '张三'
				}, {
					rank: 3,
					name: '张三'
				}, {
					rank: 4,
					name: '张三'
				}], //综合正确率前10
				lowscorelist: [{
					rank: 11,
					name: '张三'
				}, {
					rank: 12,
					name: '张三'
				}, {
					rank: 13,
					name: '张三'
				}, {
					rank: 14,
					name: '张三'
				}], //低分正确率前10
				linecountdata: [],
				questiontype:[{ value: 335, name: '微信访问' },
						{ value: 310, name: '公众号访问' },
						{ value: 234, name: '扫码进入' },
						{ value: 135, name: '分享进入' },
						{ value: 1548, name: '搜索访问' }]
			};
		},
		created() {
			let lineseries = {
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


			};
			var data = [
				[1, 10, 20],
				[20, 10, 23],
				[1, 5, 23]
			];
			let linecountdata = []
			for (var i = 0; i < data.length; i++) {
				let item = Object.assign({}, lineseries);
				item.data = data[i]
				linecountdata.push(item)
			}
			this.linecountdata = linecountdata;

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

	.cardbox {
		border-radius: 6px;
		box-shadow: 0 0 6px rgba(181, 181, 181, 0.5);
	}

	.echart {
		width: 100%;
		background: none;
	}

	.extra-item {
		display: inline-block;
		margin-right: 24px;

		a {
			margin-left: 24px;
		}
	}

	.echartbox {
		margin-top: 1px;
	}

	.userlist {
		padding: 0 10px;

		.item {
			float: left;
			width: 50%;
			position: relative;
			color: #999;
			font-size: 16px;
			padding: 10px 20px 10px 0;

			&:after {
				content: '';
				position: absolute;
				display: block;
				height: 1px;
				left: 10px;
				right: 10px;
				bottom: 0;
				background: #efefef;
			}

			p {
				margin-bottom: 0;

				&+p {
					margin-top: 10px;
				}
			}

			i {
				font-style: normal;
				font-size: 28px;
				border-radius: 100%;
				overflow: hidden;
				background: #125fc9;
				color: #fff;
				height: 40px;
				width: 40px;
				line-height: 40px;
				text-align: center;
				margin-right: 20px;
			}
		}
	}

	.tablink {
		text-align: center;

		span {
			display: inline-block;
			color: #125fc9;
			border: 1px solid #125fc9;
			border-radius: 50px;
			padding: 5px 10px;
			margin: 10px;
			cursor: pointer;

			&.active {
				background: #125fc9;
				color: #fff;
			}
		}
	}
</style>
