<template>
	<a-drawer :title="title" :maskClosable="true" width=650 placement="right" :closable="true" @close="close" :visible="visible"
	 style="height: calc(100% - 55px);overflow: auto;padding-bottom: 53px;">

		<a-form>
			<a-form-item label='所拥有的数据权限' style="margin-bottom: 0;" v-if="!isUserAdminRole">
				<dict-select-tag dictCode='permission' type="radio" v-model="permission"></dict-select-tag>
			</a-form-item>
			<a-form-item label='所拥有的菜单权限'>
				<!-- {{checkedKeys}} -->
				<a-tree checkable @check="onCheck" :checkedKeys="checkedKeys" :treeData="treeData" @expand="onExpand" @select="onTreeNodeSelect"
				 :expandedKeys="expandedKeysss" :checkStrictly="checkStrictly">
					<span slot="hasDatarule" slot-scope="{slotTitle,ruleFlag}">
						{{ slotTitle }}
						<a-icon v-if="ruleFlag" type="align-left" style="margin-left:5px;color: red;"></a-icon>
					</span>
				</a-tree>
			</a-form-item>
		</a-form>

		<div class="drawer-bootom-button">
			<a-dropdown style="float: left" :trigger="['click']" placement="topCenter">
				<a-menu slot="overlay">
				<!-- 	<a-menu-item key="1" @click="switchCheckStrictly(1)">父子关联</a-menu-item>
					<a-menu-item key="2" @click="switchCheckStrictly(2)">取消关联</a-menu-item> -->
					<a-menu-item key="3" @click="checkALL">全部勾选</a-menu-item>
					<a-menu-item key="4" @click="cancelCheckALL">取消全选</a-menu-item>
					<a-menu-item key="5" @click="expandAll">展开所有</a-menu-item>
					<a-menu-item key="6" @click="closeAll">合并所有</a-menu-item>
				</a-menu>
				<a-button>
					树操作
					<a-icon type="up" />
				</a-button>
			</a-dropdown>
			<a-popconfirm title="确定放弃编辑？" @confirm="close" okText="确定" cancelText="取消">
				<a-button style="margin-right: .8rem">取消</a-button>
			</a-popconfirm>
			<a-button @click="handleSubmit" type="primary" :loading="loading">提交</a-button>
		</div>
	</a-drawer>

</template>
<script>
	import DictSelectTag from '@/components/dict/DictSelectTag.vue'
	import {
		sysManageapi
	} from '../api'
	import {
		postAction
	} from '@/api'
	import pick from 'lodash.pick'

	export default {
		name: "RoleModal",
		components: {
			DictSelectTag
		},
		data() {
			return {
				roleId: "",
				treeData: [],
				defaultCheckedKeys: [],
				checkedKeys:[],
				expandedKeysss: [],
				allTreeKeys: [],
				autoExpandParent: true,
				checkStrictly: true,//默认父子关联
				title: "角色权限配置",
				visible: false,
				loading: false,
				permission: '',
				isUserAdminRole: false
			}
		},
		created() {
			/* 判断用户是否是管理员 */
			// try {
			// 
			// 	if (JSON.parse(localStorage.getItem('userInfo')).roleSign == 'admin' || JSON.parse(localStorage.getItem('userInfo')).roleSign == 'orgAdmin') {
			// 		this.isUserAdminRole = true;
			// 	}
			// } catch (e) {
			// 	//TODO handle the exception
			// }
			postAction(
				sysManageapi.getmenuTree
			).then(res => {
				if (res && res.data && res.data.length > 0) {
					this.treeData = this.dataSolve(res.data);
					this.allTreeKeys = JSON.stringify(this.treeData).match(/(?=\"key\":)([^,]*)(?=\,)/g).join(',').replace(
						/"key":/g, '').replace(/\"/g, '').split(',');
					this.expandedKeysss = this.allTreeKeys;
				}
			});
		},
		methods: {
			onTreeNodeSelect(id) {
				// this.$refs.datarule.show(id[0], this.roleId)
			},
			onCheck(o) {
				console.log(o)
				if (this.checkStrictly) {
					this.checkedKeys = o.checked;
				} else {
					this.checkedKeys = o
				}
			},
			show(roleId, roleSign) {
				this.roleId = roleId;
				if (roleSign == 'admin' || roleSign == 'orgAdmin') {
					this.isUserAdminRole = true;
				}else{
					this.isUserAdminRole = false;
				}
				this.visible = true;
			},
			close() {
				this.reset()
				this.visible = false;
			},
			onExpand(expandedKeys) {
				this.expandedKeysss = expandedKeys;
				this.autoExpandParent = false
			},
			reset() {
				this.expandedKeysss = []
				this.checkedKeys = []
				this.defaultCheckedKeys = []
				this.loading = false
			},
			expandAll() {
				this.expandedKeysss = this.allTreeKeys
			},
			closeAll() {
				this.expandedKeysss = []
			},
			checkALL() {
				this.checkedKeys = this.allTreeKeys
			},
			cancelCheckALL() {
				//this.checkedKeys = this.defaultCheckedKeys
				this.checkedKeys = []
			},
			switchCheckStrictly(v) {
				if (v == 1) {
					this.checkStrictly = false
				} else if (v == 2) {
					this.checkStrictly = true
				}
			},
			handleCancel() {
				this.close()
			},
			handleSubmit() {
				let that = this;
				if (that.isUserAdminRole) {
					that.permission = ''
				} else if (!that.permission) {
					that.$message.error('请选择数据权限');
					return false;
				}
				let params = {
					roleId: that.roleId,
					menuIds: that.checkedKeys,
					permission: that.permission
				};
				that.loading = true;
				postAction(
					sysManageapi.updateroleList,
					params
				).then(res => {
					if (res.code == 0) {
						that.$message.success(res.msg);
					} else {
						that.$message.error(res.msg);
					}
					that.loading = false;
					that.close();
					that.$emit('close');

				});
			},
			/* 格式化部门树 */
			dataSolve(data) {
				var memberData = data;
				var zTreeNode = [];

				function fillNode(zNode, dataNode) {
					dataNode.forEach(function(aDate) {
						var thisNode = {
							key: aDate.id,
							title: aDate.text,
							children: [],
						};
						zNode.push(thisNode);
						if (aDate.children && aDate.children.length > 0) {
							fillNode(thisNode.children, aDate.children);
						}
					});
				};
				fillNode(zTreeNode, memberData);
				return zTreeNode;
			},
		},
		watch: {
			visible() {
				if (this.visible) {
					postAction(
						sysManageapi.getmenuTreeById, {
							roleId: this.roleId
						}
					).then(res => {
						// console.log(res)
						if (res.menuIds && res.menuIds.length > 0) {
							this.checkedKeys = res.menuIds.map(item => isNaN(item) ? item : JSON.stringify(item));
						}
						this.permission = res.permission
					});

				}
			}
		}
	}
</script>
<style lang="scss" scoped>
	.drawer-bootom-button {
		position: absolute;
		bottom: 0;
		width: 100%;
		border-top: 1px solid #e8e8e8;
		padding: 10px 16px;
		text-align: right;
		left: 0;
		background: #fff;
		border-radius: 0 0 2px 2px;
	}
</style>
