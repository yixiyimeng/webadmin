<template>
	<sub-page-view>
		<audio id="xsmusic" ref="xsmusic" crossOrigin="anonymous" preload ended></audio>
		<div class="viewlist">
			<!--筛选条件-->
			<div class="flex topbar">
				<answerfilterbar @handlerSearch="handlerSearch" @handlerReset="handlerSearch" :field-list="superQueryFieldList"
				 class="flex-1"></answerfilterbar>
				<div class="handlerbtn">
					<!--<a-button class="ant-btn-success">添加</a-button>-->
					<a-button type="danger" v-has="'inte:answerRec:batchRemove'" @click="showDeleteConfirm(0)" :disabled="selectedRowKeys.length <= 0">删除</a-button>
				</div>
			</div>
			<!--表格-->
			<s-table class="mt20" bordered :columns="columns" :data="loadData" rowKey="id" ref="table" :scroll="{ x: 1300 }"
			 size="small" :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}">
				<a-tag :color="answerResult=='true'?'#00a095':'#d43030'" slot="answerResult" slot-scope="answerResult" v-if="answerResult">{{ answerResult=='true'?'正确':'错误'}}</a-tag>
				<span slot="answer" slot-scope="text, record,index">{{text|filterAnswer}}</span>
				<span slot="trueAnswer" slot-scope="text, record,index">{{text|filterAnswer}}</span>
				<span slot="operation" slot-scope="text, record,index" class="operation">
					<a href="javascript:;" title="删除" class="del" v-has="'inte:answerRec:remove'" @click="showDeleteConfirm(1,record.id)"><i
						 class="material-icons icon iconfont">delete</i></a>
					<a href="javascript:;" title="播放" class="sound" :class="{active:record.isplay}" v-if="record.voiceFileUrl" @click="playAudio(record,index)"></a>

				</span>
			</s-table>
		</div>
	</sub-page-view>
</template>

<script>
	import subPageView from '@/layouts/subPageView';
	import answerfilterbar from '@/components/filterbar/answerfilterbar'
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
	} from '@/utils/base'
	const columns = [{
			title: '主题名称',
			dataIndex: 'topicName',
			key: 'topicName',
			// width: 180
		},
		{
			title: '所属机构',
			dataIndex: 'organizationName',
			key: 'organizationName',
			// width: 180
		},
		{
			title: '校区名称',
			key: 'schoolName',
			dataIndex: 'schoolName'
		},
		{
			title: '班级名称',
			key: 'className',
			dataIndex: 'className'
		},
		{
			title: '老师名称',
			key: 'teacAssistantName',
			dataIndex: 'teacAssistantName'
		},
		{
			title: '学生名称',
			key: 'stuName',
			dataIndex: 'stuName'
		},
		{
			title: '答题器编号',
			key: 'uid',
			dataIndex: 'uid'
		},
		{
			title: '题目类型',
			key: 'questionType',
			dataIndex: 'questionType'
		},
		{
			title: '答案',
			key: 'answer',
			dataIndex: 'answer',
			scopedSlots: {
				customRender: 'answer'
			},
		},
		{
			title: '正确答案',
			key: 'trueAnswer',
			dataIndex: 'trueAnswer',
			scopedSlots: {
				customRender: 'trueAnswer'
			},
		},
		{
			title: '作答结果',
			key: 'answerResult',
			dataIndex: 'answerResult',
			scopedSlots: {
				customRender: 'answerResult'
			},
		},
		{
			title: '得分',
			key: 'score',
			dataIndex: 'score'
		},
		{
			title: '作答时间',
			key: 'answerDatetime',
			dataIndex: 'answerDatetime'
		},
		{
			title: '操作',
			key: 'operation',
			dataIndex: 'operation',
			scopedSlots: {
				customRender: 'operation'
			},
			// align: 'center',
			width: 100,
			fixed: 'right'
		}
	];
	export default {
		mixins: [rowSelection],
		components: {
			subPageView,
			answerfilterbar
		},
		data() {
			return {
				columns: columns,
				loadData: parameter => {
					//做一些异步操作
					return postAction(
						dataManageapi.getNotify,
						Object.assign(parameter, this.filter)
					).then(res => {
						return res;
					});
				},
				superQueryFieldList: [{
						type: 'date',
						value: 'startDateTime',
						text: '时间',
						defaultValue: null
					},
					{
						type: 'string',
						value: 'schoolCode',
						text: '校区',
						defaultValue: ''
					},
					{
						type: 'string',
						value: 'classCode',
						text: '班级',
						defaultValue: ''
					},
					{
						type: 'string',
						value: 'topicCode',
						text: '主题',
						defaultValue: ''
					},
					{
						type: 'string',
						value: 'stuName',
						text: '姓名',
						defaultValue: ''
					}
				],
				selectedRowKeys: [],
				record: null
			};
		},
		created() {
			try {
				if (JSON.parse(localStorage.getItem('userInfo')).roleSign != 'admin') {
					this.columns = columns.filter(item => {
						if (item.dataIndex != 'organizationName') {
							return item
						}
					})
				}
			} catch (e) {
				//TODO handle the exception
			}
		},
		mounted() {
			const $me = this;
			this.$nextTick(() => {
				if (this.$refs.xsmusic) {
					this.$refs.xsmusic.loop = false;
					this.$refs.xsmusic.addEventListener('ended', function() {
						console.log('停止播放音乐');
						if ($me.record) {
							$me.$set($me.record, 'isplay', false);
						}
					}, false);
				}
			})

		},
		methods: {
			/*查询*/
			handlerSearch(obj) {
				//this.filter = obj;
				this.filter = pick(obj, 'schoolCode', 'classCode', 'topicCode', 'stuName')
				// this.filter['answerDatetime']=obj['answerDatetime'].format("YYYY-MM-DD");
				this.$refs.table.refresh();
			},
			/* 刷新列表 */
			handlerRefresh() {
				this.$refs.table.refresh();
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
							$me.removeDict(delId);
						} else {
							$me.batchRemoveDict();
						}
					},
					onCancel() {
						console.log('Cancel');
					},
				});
			},
			/*删除*/
			removeDict(delId) {
				postAction(
					dataManageapi.removeNotify, {
						id: delId
					}).then(res => {
					this.handlerRefresh();
				});
			},
			/*批量删除 */
			batchRemoveDict() {
				postAction(
					dataManageapi.batchRemoveNotify, this.selectedRowKeys).then(res => {
					this.selectedRowKeys = [];
					this.handlerRefresh();
				});
			},
			playAudio(item, index) {
				this.record = item;
				if (this.$refs.xsmusic) {
					this.$set(item, 'isplay', true);
					this.$refs.xsmusic.src = fileUrl + item.voiceFileUrl;
					this.$refs.xsmusic.load();
					console.log(this.$refs.xsmusic)
					this.$refs.xsmusic.play();
					this.$refs.xsmusic.loop = false;
					// const $me=this;
					// this.$refs.xsmusic.addEventListener('ended', function() {
					// 	console.log('停止播放音乐');
					// 	$me.$set(item, 'isplay', false);
					// }, false);
				}

			}
		},
		filters: {
			filterAnswer(value) {
				if (value == 'E' || value == 'true') {
					return '√'
				} else if (value == 'F' || value == 'false') {
					return '×'
				} else {
					return value
				}
			}
		}
	};
</script>

<style scoped="scoped" lang="less">
	.table-wrapper .operation {
		a {
			font-size: 20px;
			margin: 0 10px;
			vertical-align: middle;

			&.del {
				color: #d43030;
			}

			&.add {
				color: #00baad;
			}

			&.sound {
				display: inline-block;
				height: 20px;
				width: 20px;
				background: url(../../../assets/img/notice1.png) no-repeat center center;
				background-size: cover;

				&.active {
					background-image: url(../../../assets/img/notice.gif);
					background-image: url(../../../assets/img/notice2.gif)\9;
				}
			}
		}
	}
</style>
