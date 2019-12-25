<template>
	<div name="about" class="about">
		<h1>{{ title }}</h1>
		<ul>
			<li v-for="(item, index) in list" :key="index">{{ item }}</li>
		</ul>
		<!-- computed -->
		<div>列表长度{{ listlen }}</div>
		<a-button type="primary" @click="show">Primary</a-button>
		<a-button type="danger" disabled="disabled">Danger</a-button>
		<a-button disabled="disabled" class="ant-btn-success">success</a-button>
		<a-button class="ant-btn-warning" disabled="disabled">warning</a-button>
		<div>
			<!--筛选条件-->
			<filterbar @handlerSearch="handlerSearch" @handlerReset="handlerSearch" :field-list="superQueryFieldList"></filterbar>
			<!--表格-->
			<s-table class="mt5" bordered :columns="columns" :data="loadData" size="default" rowKey="id" ref="table" :scroll="{ x: 1300 }">
				<span slot="workState" slot-scope="workState" class="ant-badge ant-badge-status ant-badge-not-a-wrapper">
					<span
						class="ant-badge-status-dot"
						:class="{
							'ant-badge-status-processing': workState == 'shiyongqi',
							'ant-badge-status-success': workState == 'zaizhi',
							'ant-badge-status-error': workState == 'lizhi',
							'ant-badge-status-warning': workState == 'tuixiu'
						}"
					></span>
					<span class="ant-badge-status-text">
						<a-tag color="blue" :key="workState">{{ workState | filterstatus }}</a-tag>
					</span>
				</span>
				<span slot="status" slot-scope="status" class="ant-badge ant-badge-status ant-badge-not-a-wrapper">
					<span class="ant-badge-status-text">
						<a-tag color="blue" :key="status">{{ status }}</a-tag>
					</span>
				</span>
			</s-table>
		</div>
	</div>
</template>
<script>
const columns = [
	{
		title: '工号',
		dataIndex: 'userId',
		key: 'userId',
		width: 80,
		fixed: 'left'
	},
	{
		title: '姓名',
		dataIndex: 'userName',
		key: 'userName',
		width: 80,
		fixed: 'left'
	},
	{
		title: '部门',
		dataIndex: 'deptName',
		key: 'deptName',
		width: 180,
		fixed: 'left'
	},
	{
		title: '职位',
		key: 'position',
		dataIndex: 'position'
	},
	{
		title: '在职状态',
		key: 'workState',
		dataIndex: 'workState',
		scopedSlots: {
			customRender: 'workState'
		}
	},
	{
		title: '角色',
		key: 'roleName',
		dataIndex: 'roleName'
	},
	{
		title: '手机号',
		key: 'phone',
		dataIndex: 'phone'
	},
	{
		title: '邮箱',
		key: 'email',
		dataIndex: 'email',
		width: 120,
		fixed: 'right'
	},
	{
		title: '操作',
		key: 'status',
		dataIndex: 'status',
		scopedSlots: {
			customRender: 'status'
		},
		width: 100,
		fixed: 'right'
	}
];

export default {
	name: 'about',
	props: {
		/* 暴露参数 */
	},
	mixins: {
		/* 注册混合的代码 */
	},
	data() {
		/* 数据 */
		return {
			title: '这是一个测试页面',
			list: ['item1', 'item2'],
			filter: {},
			advanced: false,
			columns: columns,
			loadData: parameter => {
				// return this.$postAction(
				// 	api.getAddressList,
				// 	Object.assign(parameter, {
				// 		data: { ...this.filter }
				// 	})
				// ).then(res => {
				// 	return res.data;
				// });
			},
			superQueryFieldList: [
				{
					type: 'rangeDate',
					value: 'rangetime',
					text: '时间范围',
					defaultValue: [moment('2019-06-11'),moment('2019-07-11')]
				},
				{
					type: 'month',
					value: 'month',
					text: '月',
					defaultValue: moment('2015-06')
				},
				{
					type: 'date',
					value: 'birthday',
					text: '生日',
					defaultValue: moment('2019-08-13')
				},
				{
					type: 'string',
					value: 'name',
					text: '用户名',
					defaultValue: '123'
				},
				{
					type: 'int',
					value: 'age',
					text: '年龄',
					defaultValue: null
				},
				{
					type: 'select',
					value: 'sex',
					text: '性别',
					defaultValue: null,
					optionlist: [{ value: '', text: '全部' }, { value: 0, text: '男' }, { value: 1, text: '女' }]
				}
			]
		};
	},
	created() {
		/* vue 实例创建成功 */
	},
	mounted() {
		/* dom 结构渲染成功   */
		/* 主要用来调用需要demo接口的方法 */
	},
	computed: {
		/* 计算属性 */
		listlen: function() {
			return this.list.length;
		}
	},
	watch: {
		/* 监听 */
	},
	filters: {
		/* 筛选器 */
		filterstatus: function(value) {
			switch (value) {
				case 'zaizhi': {
					return '在职';
					break;
				}
				case 'shiyongqi': {
					return '试用期';
					break;
				}
				case 'dairuzhi': {
					return '待入职';
					break;
				}
				case 'lizhi': {
					return '离职';
					break;
				}
				case 'tuixiu': {
					return '退休';
					break;
				}
			}
		}
	},

	methods: {
		/* 方法 */
		show() {
			alert(1);
		},
		/* 查询条件的展开收起 */
		toggleAdvanced() {
			this.advanced = !this.advanced;
		},
		handlerSearch(filter) {
			/* 确认查询 */
			this.filter = filter;
			this.$refs.table.refresh();
		},
		search: function() {
			/* 查询 */
			this.$refs.table.refresh();
		},
		/* 重置查询参数 */
		reset: function() {
			this.filter = {
				deptId: '1',
				attendanceteamDate: []
			};
			this.queryType = '';
			this.filter.fullname = '';
			this.$refs.table.refresh();
		}
	}
};
</script>
