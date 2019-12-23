<template>
	<sub-page-view>
		<div class="viewlist">
			<!--筛选条件-->
			<div class="flex topbar">
				<div class="flex-1"></div>
				<div class="handlerbtn">
					<a-button class="ant-btn-success" v-has="'sys:menu:add'" @click="addMenuList()">添加</a-button>
					<!-- <a-button type="danger" v-has="'sys:menu:batchRemove'"  @click="showDeleteConfirm(0)" :disabled="selectedRowKeys.length <= 0">删除</a-button> -->
				</div>
			</div>
			<!--表格-->
			<s-table class="mt20" bordered :columns="columns" :data="loadData" rowKey="id" ref="table" :scroll="{ x: 1300 }"
			 size="small" :showPagination="false">
				<a-tag :color=" type | filterB " slot="type" slot-scope="type">{{ type | filterA}}</a-tag>
				<span slot="operation" slot-scope="text,record" class="operation">
					<a href="javascript:;" title="编辑" class="edit" v-has="'sys:menu:edit'"   @click="editMenuList(record)"><i class="material-icons icon iconfont">border_color</i></a>
					<a href="javascript:;" title="添加下级" class="add" @click="handleAddSub(record.id,record.text)"><i class="material-icons icon iconfont">note_add</i></a>
					<a href="javascript:;" title="删除" class="del" v-has="'sys:menu:remove'"  @click="showDeleteConfirm(1,record.id)"><i class="material-icons icon iconfont">delete</i></a>
				</span>
			</s-table>
			<!-- <a-table :columns="columns" :dataSource="data" :rowSelection="rowSelection" /> -->
			<!-- <permission-modal ref="modalForm" @ok="modalFormOk"></permission-modal> -->
		</div>
		
		<!-- 添加，编辑  -->
		<menu-list-modal ref="menuListModal" @ok="handlerRefresh"></menu-list-modal>
	</sub-page-view>
</template>

<script>
	import subPageView from '@/layouts/subPageView';
	import MenuListModal from './module/MenuListModal';
	import PermissionModal from '../modules/PermissionModal'
	import {
		rowSelection
	} from '@/mixins'
	import {
		sysManageapi
	} from '../api';
	import {
		postAction
	} from '@/api';
	const columns = [{
			title: '编号',
			dataIndex: 'id',
			key: 'id',
		}, {
			title: '名称',
			dataIndex: 'text',
			key: 'text',
		}, {
			title: '图标',
			dataIndex: 'icon',
			key: 'icon',
			width: '12%',
		}, {
			title: '类型',
			dataIndex: 'type',
			width: '30%',
			key: 'type',
			scopedSlots: {
				customRender: 'type'
			}
		},
		{
			title: '权限标识',
			dataIndex: 'perms',
			width: '30%',
			key: 'perms',
		}, {
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

	import moment from 'moment';
	export default {
		mixins:[rowSelection],
		components: {
			subPageView,
			PermissionModal,
			MenuListModal
		},
		data() {
			return {
				columns: columns,
				loadData: parameter => {
					//做一些异步操作
					return postAction(sysManageapi.getmenuList).then(res => {
						return res;
					});

				},
				columns,
				rowSelection,

			};
		},
		created() {


		},
		filters: {
			filterA: function(value){
				console.log(value)
				if(value == 0){
					return "目录";
				} if(value == 1){
					return "菜单";
				} if(value == 2) {
					return "按钮";
				}
				
			},
			filterB: function(value){
				if(value == 0){
					return "#337ab7";
				}else if(value == 1){
					return "#5cb85c";
				} if(value == 2) {
					return "#f0ad4e";
				}
				
			}
		},
		methods: {
			/* 查询 */
			handlerSearch(obj) {
				this.filter = obj;
				this.$refs.table.refresh();
			},
			/* 刷新列表 */
			handlerRefresh() {
				this.$refs.table.refresh();
			},
			modalFormOk(){
				
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
							$me.removeMenuList(delId);
						} else {
							$me.batchRemoveMenuList();
						}
					},
					onCancel() {
					},
				});
			},
			addMenuList(){
				this.$refs.menuListModal.add();
			},
			editMenuList(record){
				this.$refs.menuListModal.edit(record);
			},
			/*删除*/
			removeMenuList(delId) {
				postAction(
					sysManageapi.removeMenuList, {
						menuId: delId
					}).then(res => {
					this.handlerRefresh();
				});
			},
			/*批量删除 */
			batchRemoveMenuList() {
				postAction(
					sysManageapi.removeMenuList, this.selectedRowKeys).then(res => {
					this.selectedRowKeys = [];
					this.handlerRefresh();
				});
			},
			handleAddSub(id,name) {
				this.$refs.menuListModal.add(id,name);
				    // this.$refs.modalForm.title = "添加子菜单";
			     //    this.$refs.modalForm.localMenuType = 1;
			     //    this.$refs.modalForm.disableSubmit = false;
			     //    this.$refs.modalForm.edit({status:'1',permsType:'1',route:true,'parentId':'1'});
			      }
		}
	};
</script>

<style scoped="scoped" lang="less">
// 	.table-wrapper .operation {
// 		a {
// 			font-size: 20px;
// 			margin: 0 10px;
// 
// 			&.del {
// 				color: #d43030;
// 			}
// 
// 			&.add {
// 				color: #00baad;
// 			}
// 		}
// 	}
</style>
