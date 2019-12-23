<template>
	<sub-page-view>
		<div class="viewlist">
			<!--筛选条件-->
			<div class="flex topbar">
				<filterbar @handlerSearch="handlerSearch" @handlerReset="handlerSearch" :field-list="superQueryFieldList" class="flex-1"></filterbar>
				<div class="handlerbtn" style="width: auto;">
					<a-button class="ant-btn-success" v-has="'sys:user:add'" @click="addUser()">添加</a-button>
					<a-button type="danger" v-has="'sys:user:batchRemove'" @click="showDeleteConfirm(0)" :disabled="selectedRowKeys.length <= 0">删除</a-button>
					<a-button icon='bar-chart' :class="ant-btn-success">图表</a-button>
				</div>
			</div>
			<!--表格-->
			<s-table class="mt20" bordered :columns="columns" :data="loadData" rowKey="userId" ref="table" :scroll="{ x: 1300 }"
			 size="small" :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}">
				<a-tag :color="status==1?'#00a095':'#d43030'" slot="status" slot-scope="status">{{ status==1?'启用':'停用'}}</a-tag>
				<span slot="operation" slot-scope="text,record" class="operation">
					<a href="javascript:;" title="编辑" class="edit" v-has="'sys:user:edit'" @click="editUser(record)"><i class="material-icons icon iconfont">border_color</i></a>
					<a href="javascript:;" title="重置密码" class="add" v-has="'sys:user:resetPwd'" @click="adminResetPwd(record)"><i
						 class="material-icons icon iconfont">enhanced_encryption</i></a>
					<a href="javascript:;" title="删除" class="del" v-has="'sys:user:remove'" @click="showDeleteConfirm(1,record.userId)"><i
						 class="material-icons icon iconfont">delete</i></a>
				</span>
				<span slot="roleNames" slot-scope="text,record">{{text.join(',')}}</span>
			</s-table>
		</div>
		<!-- 添加，编辑 -->
		<user-list-modal ref="userListModal" @ok="handlerRefresh"></user-list-modal>
		<!-- 重置密码  -->
		<rest-password-modal ref="restPasswordModal" @ok="handlerRefresh"></rest-password-modal>
		<!-- 统计图表 -->
		<div class="rateChart">
			<div class="flex flex-pack-justify"><span></span><a href="javascript:;" class="list"></a></div>
			<div class="flex flex-pack-justify">
				<div class="title"><span>平台账户数量</span> · 平台用户数量：<span>152</span>人</div>
				<span class="time">2019-11-28 15:08:25 星期四</span>
			</div>
			<div class="rateNumbar flex mt10">
				<a-card :bordered="false" class="cardbox orgnum">
					<div class="modbox-title">机构数量</div>
					<div class="flex flex-pack-center">
						<div>
							<p>15</p>
							<div>现有机构数</div>
						</div>
						<div>
							<p>15</p>
							<div>现有账号数</div>
						</div>
					</div>
				</a-card>
				<a-card :bordered="false" class="cardbox flex-1 ">
					<div class="flex">
						<div class="flex-1 accountnum">
							<div class="modbox-title">新增账户数</div>
							<div class="flex flex-align-center">
								<div>本月</div>
								<div class="num">
									<span>1</span>
									<span>2</span>
									<span>3</span>
								</div>
							</div>
						</div>
						<div class="flex-1 accountnum">
							<div class="modbox-title">即将过期机构</div>
							<div class="flex flex-align-center">
								<div>本月</div>
								<div class="num rednum">
									<span>1</span>
									<span>2</span>
									<span>3</span>
								</div>
							</div>
						</div>
						<div class="flex-1 accountnum">
							<div class="modbox-title">登陆人次 /次</div>
							<div class="flex flex-align-center">
								<div>今日</div>
								<div class="num">
									<span>1</span>
									<span>2</span>
									<span>3</span>
								</div>
							</div>
						</div>
						<div class="flex-1 accountnum">
							<div class="notitle"></div>
							<div class="flex flex-align-center">
								<div>本周</div>
								<div class="num">
									<span>1</span>
									<span>2</span>
									<span>3</span>
								</div>
							</div>
						</div>
					</div>
				</a-card>

			</div>
			<div class="mt20 flex">
				<div class="flex-1">
					<a-card :bordered="false" class="cardbox">
						<div class="modbox-title flex flex-pack-justify flex-align-center"><span>每日登陆人次统计</span>
							<div class="searchbar">
								<a-select class="search">
									<a-option>12</a-option>
								</a-select>
								<a href="javascript:;" class="searchbtn"></a>
							</div>
						</div>
						<v-chart :options="polar3"  class="echart" autoresize style="height: 400px;" />

					</a-card>
					<a-card :bordered="false" class="cardbox" style="margin-top: 20px;">
						<div class="modbox-title flex flex-pack-justify flex-align-center"><span>每日登陆人次统计</span>
							<div class="searchbar">
								<a-select class="search">
									<a-option>12</a-option>
								</a-select>
								<a href="javascript:;" class="searchbtn"></a>
							</div>
						</div>
						<v-chart :options="polar4"  class="echart" autoresize style="height: 200px;" />

					</a-card>
				</div>
				<div class="accountstate">
					<a-card :bordered="false" class="cardbox">
						<div class="modbox-title flex flex-pack-justify flex-align-center"><span>账户状态统计</span>
							<div class="searchbar">
								<a-select class="search">
									<a-option>12</a-option>
								</a-select>
								<a href="javascript:;" class="searchbtn"></a>
							</div>
						</div>
						<v-chart :options="polar2" class="echart" autoresize style="height: 300px;" />
					</a-card>
					<a-card :bordered="false" class="cardbox" style="margin-top: 20px;">
						<div class="modbox-title flex flex-pack-justify flex-align-center">
							<span>账户渠道统计</span>
							<div class="searchbar">
								<a-select class="search">
									<a-option>12</a-option>
								</a-select>
								<a href="javascript:;" class="searchbtn"></a>
							</div>
						</div>
						<v-chart :options="polar" class="echart" autoresize style="height: 300px;" />
					</a-card>
				</div>
				<div>
					<a-card :bordered="false" class="cardbox rankbox" style="height: 780px;">
						<div class="modbox-title flex flex-pack-justify flex-align-center">
							<span>登陆次数排行榜</span>
							<div class="sort">
								<a href="javascript:;" class="active">正序</a>
								<span>|</span>
								<a href="javascript:;" class="searchbtn">倒序</a>
							</div>
						</div>
						<div>
							<table class="table">
								<tr>
									<th>排名</th>
									<th>姓名</th>
									<th>登录次数</th>
									<th>角色</th>
								</tr>
								<tr>
									<td>1</td>
									<td>张三</td>
									<td>112</td>
									<td>管理员</td>
								</tr>
								<tr>
									<td>2</td>
									<td>张三</td>
									<td>112</td>
									<td>管理员</td>
								</tr>
								<tr>
									<td>3</td>
									<td>张三</td>
									<td>112</td>
									<td>管理员</td>
								</tr>
								<tr>
									<td>4</td>
									<td>张三</td>
									<td>112</td>
									<td>管理员</td>
								</tr>
								<tr>
									<td>5</td>
									<td>张三</td>
									<td>112</td>
									<td>管理员</td>
								</tr>
							</table>
						</div>
					</a-card>
				</div>
			</div>
		</div>
	</sub-page-view>
</template>

<script>
	var icon =
		'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAABDCAMAAABjnP3jAAAAilBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAQEAAAAAAAAAAAAAAAAAAAAAAAAAAADT09MAAAAAAAAAAAAAAAD////8/Pz5+fnr6+v8/Pzr6+vZ2dn09PTFxcX+/v719fX6+vrf39+5ubnDw8MSEhIrKytRUVF2dnZAQEDi4uLi4uLk5OTk5OT///+tdFIzAAAALXRSTlMABQgNFBwDNS4mCxEYIyAamisoMS364t9b57qWj3b0s6mec28rJhMNDKemZ2YvJtR9AAACMUlEQVRo3u2ZaW/iMBBAaTDdxI7tOCeF0vvaY/7/39sZJ2BgKyUrxNBKfh+RyHtMJkhJZl+Ja+LqzHjJ53rvTs5OX/Gp/n350DZwZu66h+X7vwmoT5YtMNEuE0w48n/cAiO3H0NB+P2cfioYZhDmD8yEs0ABydsNMHPzllDA4Jd/gJ3fEguGADm/B3bu5xIDhgGoFthpFY2gD5iLBthpxHwbIFUOFyBX8osE4ApYuAAWl4ACaAUuE0BLMAQs4AIsYkAMiAExIAbEgBgQA2JADIgB+wF3wE5zENABO+1+gF0BOytLAdt7ww2ws6F7w93d8Sv/M6LXg9tz8wzMPJsQQFuoH4GVR007uA2gEbz8AkZ+vtAAKMAXSBpB+dQBE91TSQOQ5N+NAAvSzapr4Mw03WqToj8MoN8CX+DSqvoxjQKOKCZ+sapS5/20AeFZsaQCozPn6jodpcLO4tiPH6aj1LVzmTbkl1d9QCgQmGC0zsYpHc6qOPDj73JlNo7WBvVi5w8FiU/IrV2MY2hWabHnT11GRx7H2tzrk+APBZiglJhATqerTIvgL2msuZiAUqgP/lBACYnEiAlgJu1sXQz+mrZK4JEnINFO+utT3prJfmczKiB/1m+V/I+3Zie+N8QGJazJ3Bpg7TJjhUL7ae8Np+Mr+wJdrtel7v3+2DMWqIGuGkG7SNsnaKtZ7McFIrc2F+z+UKAUXVfM/lDg/zr8Rc3tDwUefn9I8PDrQ4Jn9q35C4Ev35B0ZZBdAAAAAElFTkSuQmCC';

	import subPageView from '@/layouts/subPageView';
	import UserListModal from './module/UserListModal';
	import RestPasswordModal from './module/restPasswordModal';
	import {
		sysManageapi,
		getAllorgList
	} from '../api';
	import {
		rowSelection
	} from '@/mixins';
	import {
		postAction
	} from '@/api';
	const columns = [{
			title: '用户ID',
			dataIndex: 'userId',
			key: 'userId',
			width: 180
		}, {
			title: '用户名',
			key: 'username',
			dataIndex: 'username'
		}, {
			title: '姓名',
			dataIndex: 'name',
			key: 'name',
			width: 180
		},
		{
			title: '手机号码',
			dataIndex: 'mobile',
			key: 'mobile',
		},
		{
			title: '邮箱',
			dataIndex: 'email',
			key: 'email',
		},
		{
			title: '所属机构',
			dataIndex: 'organizationName',
			key: 'organizationName',
		},

		{
			title: '所属校区',
			key: 'schoolName',
			dataIndex: 'schoolName'
		},
		{
			title: '角色',
			key: 'roleNames',
			dataIndex: 'roleNames',
			scopedSlots: {
				customRender: 'roleNames'
			}
		},
		{
			title: '状态',
			dataIndex: 'status',
			key: 'status',
			align: 'center',
			width: 180,
			scopedSlots: {
				customRender: 'status'
			}
		},
		{
			title: '开户时间',
			key: 'roleNames',
			dataIndex: 'roleNames',
			scopedSlots: {
				customRender: 'roleNames'
			}
		},
		{
			title: '账户有效期',
			key: 'roleNames',
			dataIndex: 'roleNames',
			scopedSlots: {
				customRender: 'roleNames'
			}
		},
		{
			title: '获取渠道',
			key: 'roleNames',
			dataIndex: 'roleNames',
			scopedSlots: {
				customRender: 'roleNames'
			}
		},
		{
			title: '登录次数',
			key: 'roleNames',
			dataIndex: 'roleNames',
			scopedSlots: {
				customRender: 'roleNames'
			}
		},
		{
			title: '最近登录时间',
			key: 'roleNames',
			dataIndex: 'roleNames',
			scopedSlots: {
				customRender: 'roleNames'
			}
		},
		{
			title: '责任销售',
			key: 'roleNames',
			dataIndex: 'roleNames',
			scopedSlots: {
				customRender: 'roleNames'
			}
		},
		{
			title: '操作',
			key: 'operation',
			dataIndex: 'operation',
			scopedSlots: {
				customRender: 'operation'
			},
			align: 'center',
			width: 160,
			fixed: 'right'
		}
	];
	const superQueryFieldList = [{
			type: 'select',
			value: 'organization',
			text: '所属机构',
			defaultValue: null,
			optionlist: []
		},
		{
			type: 'string',
			value: 'name',
			text: '姓名',
			defaultValue: null
		},
		{
			type: 'select',
			value: 'name',
			text: '账户类型',
			defaultValue: null
		},
		{
			type: 'select',
			value: 'name',
			text: '账户渠道',
			defaultValue: null
		}
	];
	import moment from 'moment';
	export default {
		mixins: [rowSelection],
		data() {
			return {
				columns: columns,
				loadData: parameter => {
					//做一些异步操作
					return postAction(
						sysManageapi.getuserList,
						Object.assign(parameter, this.filter)
					).then(res => {
						return res;
					});

				},
				superQueryFieldList: superQueryFieldList,
				rowSelection: {},
				orgList: [],
				isUserAdminRole: false, //用户是否是超级管理员角色
				polar: {
					color: ['#1763ca', '#d901b8', '#0bcedf', '#ff8d1a', '#00baad'],
					tooltip: {
						trigger: 'item',
						formatter: '{a} <br/>{b} : {c} ({d}%)'
					},
					series: [{
						name: '访问来源',
						type: 'pie',
						radius: '80%',
						center: ['50%', '60%'],
						data: [{
								value: 335,
								name: '微信访问'
							},
							{
								value: 310,
								name: '公众号访问'
							},
							{
								value: 234,
								name: '扫码进入'
							},
							{
								value: 135,
								name: '分享进入'
							},
							{
								value: 1548,
								name: '搜索访问'
							}
						],
						itemStyle: {
							emphasis: {
								shadowBlur: 10,
								shadowOffsetX: 0,
								shadowColor: 'rgba(0, 0, 0, 0.5)'
							}
						},
						label: {
							normal: {
								show: true,
								position: 'inner',
								formatter: '{b}:({d}%)\n{c}'
							}
						},
						labelLine: {
							normal: {
								show: false
							}
						}
					}]
				},
				polar2: {
					color: ['#00baad', '#ff8d1a', '#d43030'],
					tooltip: {
						trigger: 'item',
						formatter: '{a} <br/>{b} : {c} ({d}%)'
					},
					legend: {
						show: true,
						orient: 'vertical',
						left: 'center',
						top: 'center',
						itemHeight: 8,
						itemWidth: 16,
						data: ['微信访问', '公众号访问', '扫码进入']
					},
					series: [{
						name: '访问来源',
						type: 'pie',
						radius: [55, 90],
						center: ['50%', '50%'],
						data: [{
								value: 335,
								name: '微信访问'
							},
							{
								value: 310,
								name: '公众号访问'
							},
							{
								value: 234,
								name: '扫码进入'
							},
						],
						itemStyle: {
							emphasis: {
								shadowBlur: 10,
								shadowOffsetX: 0,
								shadowColor: 'rgba(0, 0, 0, 0.5)'
							}
						},

					}]
				},
				polar3: {
					color: [{
						type: 'linear',
						x: 0,
						y: 0,
						x2: 0,
						y2: 1,
						colorStops: [{
								offset: 0, //颜色的开始位置
								color: '#c950e7' // 0% 处的颜色
							},
							{
								offset: 1, //颜色的结束位置
								color: '#6f0259' // 100% 处的颜色
							}
						]
					}, '#00baad'],
					tooltip: {
						trigger: 'axis',
						axisPointer: {
							// 坐标轴指示器，坐标轴触发有效
							type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
						}
					},
					grid: {
						left: '3%',
						right: '4%',
						bottom: '3%',
						containLabel: true
					},
					xAxis: [{
						type: 'category',
						data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
						axisTick: {
							alignWithLabel: true
						}
					}],
					yAxis: [{
						type: 'value'
					}],
					series: [{
							name: '直接访问',
							type: 'bar',
							barGap: '1%',
							data: [10, 52, 200, 334, 390, 330, 220]
						},
						{
							name: '直接访问1',
							type: 'line',
							data: [200, 10, 52, 200, 334, 390, 330]
						}
					]
				},
				polar4: {
					color: [{
						type: 'linear',
						x: 0,
						y: 0,
						x2: 0,
						y2: 1,
						colorStops: [{
								offset: 0, //颜色的开始位置
								color: '#ff9600' // 0% 处的颜色
							},
							{
								offset: 1, //颜色的结束位置
								color: '#e2046d' // 100% 处的颜色
							}
						]
					}],
					tooltip: {
						trigger: 'axis',
						axisPointer: {
							// 坐标轴指示器，坐标轴触发有效
							type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
						}
					},
					grid: {
						left: '3%',
						right: '4%',
						bottom: '3%',
						containLabel: true
					},
					xAxis: [{
						type: 'category',
						data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
						axisTick: {
							alignWithLabel: true
						}
					}],
					yAxis: [{
						type: 'value'
					}],
					series: [{
							name: '直接访问',
							type: 'bar',
							barGap: '1%',
							data: [10, 52, 200, 334, 390, 330, 220],
							itemStyle: {
								normal: {
									label: {
										show: true,
										position: 'top',
										distance: 0,
										color: '#434e79',
										fontSize: 16,
										backgroundColor: {
											image: icon,
										},
										padding: [10, 15, 20, 15],
										borderRadius: 100
									}
								}
							},
						}

					]
				}
			};
		},
		created() {
			/* 判断用户是否是管理员 */
			try {
				if (JSON.parse(localStorage.getItem('userInfo')).roleSign == 'admin') {
					this.isUserAdminRole = true;
					this.getAllorgList();
				} else {
					this.columns = columns.filter(item => {
						if (item.dataIndex != 'organizationName') {
							return item
						}
					})
					this.superQueryFieldList = superQueryFieldList.filter(item => {
						if (item.value != 'organization') {
							return item
						}
					})
				}
			} catch (e) {
				//TODO handle the exception
			}
		},
		components: {
			subPageView,
			UserListModal,
			RestPasswordModal
		},
		methods: {
			/*查询所有机构*/
			getAllorgList() {
				getAllorgList().then(da => {
					this.orgList = [];
					if (da.data && da.data.length > 0) {
						this.orgList = da.data.map(item => {
							return {
								value: item.code,
								text: item.name
							}
						});
					}
					this.orgList.unshift({
						value: '',
						text: '全部'
					});
					this.superQueryFieldList[0].optionlist = this.orgList;
				})

			},
			/*改变机构*/
			changeOrg() {
				getAllorgList()
			},
			/*查询*/
			handlerSearch(obj) {
				this.filter = obj;
				this.$refs.table.refresh();
			},
			/* 刷新列表 */
			handlerRefresh() {
				this.$refs.table.refresh();
			},
			/*重置密码*/
			adminResetPwd(record) {
				this.$refs.restPasswordModal.resetPwd(record);
			},
			/* 确认是否删除 */
			showDeleteConfirm(type, delId) {
				let $me = this;
				this.$confirm({
					title: type == 1 ? '你确定要删除这条吗?' : '你确定要删除这' + $me.selectedRowKeys.length + '条选中的数据吗？',
					content: '',
					okText: '确定',
					cancelText: '取消',
					class: 'confirmbox',
					okType: 'danger',
					onOk() {
						//console.log('OK');
						if (type == 1) {
							$me.removeUserList(delId);
						} else {
							$me.batchRemoveUserList();
						}
					},
					onCancel() {},
				});
			},
			/* 添加 */
			addUser() {
				this.$refs.userListModal.add();
				//this.visible=true;
			},
			/* 编辑 */
			editUser(record) {
				this.$refs.userListModal.edit(record);
			},
			/*删除*/
			removeUserList(delId) {
				postAction(
					sysManageapi.removeuserList, {
						userId: delId
					}).then(res => {
					this.handlerRefresh();
				});
			},
			/*批量删除 */
			batchRemoveUserList() {
				postAction(
					sysManageapi.batchRemoveuserList, this.selectedRowKeys).then(res => {
					this.selectedRowKeys = [];
					this.handlerRefresh();
				});
			},
		}
	};
</script>

<style scoped="scoped" lang="less">
	.flex-1 {
		overflow: visible;
	}

	.table-wrapper .operation {
		a {
			font-size: 20px;
			margin: 0 10px;
			line-height: 1;

			&.del {
				color: #d43030;
			}

			&.add {
				color: #00baad;
			}
		}
	}

	.rateChart {
		padding-bottom: 20px;

		& .list {
			width: 32px;
			height: 24px;
			display: block;
			margin-bottom: 38px;
			background: url(../../../assets/img/list.png) no-repeat center center;
		}

		.title {
			background: url(../../../assets/img/title.png) no-repeat left center;
			color: #666;
			padding-left: 30px;

			&>span:first-child {
				font-size: 18px;
			}

			&>span:last-child {
				color: #ff8a2c;
			}
		}

		.time {
			color: #125fc9;
			font-size: 20px;
		}


	}

	.cardbox {
		border-radius: 6px;
		-webkit-box-shadow: 0 0 6px rgba(181, 181, 181, 0.5);
		box-shadow: 0 0 6px rgba(181, 181, 181, 0.5);

		/deep/ .ant-card-body {
			padding: 24px 25px;
		}

		.modbox-title {
			text-align: left;
			background: url(../../../assets/img/title2.png) no-repeat left center;
			padding-left: 30px;

			.searchbar {
				.search {
					width: 110px;
				}

				.searchbtn {
					margin-left: 5px;
					display: inline-block;
					height: 14px;
					width: 14px;
					background: url(../../../assets/img/search.png) no-repeat center center;

				}
			}
		}

		.notitle {
			height: 21px;
		}

		&.orgnum {
			width: 280px;
			color: #fff;
			text-align: center;
			background: linear-gradient(top left, #5a5efd, #67b6fd);
			margin-right: 20px;

			/*渐变从左上角到右下角*/
			.modbox-title {
				background: url(../../../assets/img/title1.png) no-repeat left center;
			}

			.flex>div {
				&+div {
					margin-left: 50px;
				}


				p {
					font-size: 35px;
					font-weight: bold;
					margin-bottom: 0;
				}
			}
		}

		.accountnum {
			.flex {
				font-size: 18px;
				color: #666;
				margin-top: 27px;
				margin-right: 10px;

				.num span {
					font-size: 45px;
					font-weight: bold;
					color: #fff;
					background: url(../../../assets/img/num.png) no-repeat center center;
					width: 39px;
					height: 46px;
					text-align: center;
					line-height: 46px;
					display: inline-block;
					margin-left: 3px;
				}

				.rednum.num span {
					background-image: url(../../../assets/img/num1.png);
				}
			}
		}
	}

	.accountstate {
		margin-left: 15px;
		margin-right: 15px;
		width: 318px;
	}

	.rankbox {
		width: 318px;

		.sort {
			color: #333;

			span {
				margin-left: 2px;
				margin-right: 2px;
			}

			a {
				color: #999;

				&.active {
					color: #125fc9;
				}
			}
		}
	}

	.echart {
		width: 100%;
		height: auto;
	}

	.table {
		width: 100%;
		line-height: 45px;
		color: #666;
		text-align: center;

		td:first-child,
		th:first-child {
			text-align: left;
		}

		tr {
			td {
				border-bottom: 1px solid #ccc;

				&:nth-child(3) {
					color: #125fc9;
					font-size: 16px;

				}
			}

			&:nth-child(2) {
				color: #d901b8;

				td:nth-child(3) {
					color: #d901b8;

				}
			}

			&:nth-child(3) {
				color: #ff8d1a;

				td:nth-child(3) {
					color: #ff8d1a;

				}
			}

			&:nth-child(4) {
				color: #00baad;

				td:nth-child(3) {
					color: #ff8d1a;

				}
			}


		}
	}
</style>
