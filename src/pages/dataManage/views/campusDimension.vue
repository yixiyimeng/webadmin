<template>
	<sub-page-view>
		<div class="viewlist">
			<!--筛选条件-->
			<div class="flex topbar">
				<!-- <filterbar @handlerSearch="handlerSearch" @handlerReset="handlerSearch" :field-list="superQueryFieldList" class="flex-1"></filterbar> -->
				<div class="handlerbtn">
					<!--<a-button class="ant-btn-success">添加</a-button>-->
					<a-button type="danger" v-has="'common:dict:batchRemove'" @click="showDeleteConfirm(0)" :disabled="selectedRowKeys.length <= 0">删除</a-button>
				</div>
			</div>
			<!--表格-->
			<s-table class="mt20" bordered :columns="columns" :data="loadData" rowKey="id" ref="table" :scroll="{ x: 1300 }"
					 size="small" :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}">
				<span slot="operation" slot-scope="text, record" class="operation">
					<a href="javascript:;" title="删除" class="del" v-has="'common:dict:remove'" @click="showDeleteConfirm(1,record.id)"><i
							class="material-icons icon iconfont">delete</i></a>
				</span>
			</s-table>
		</div>
	</sub-page-view>
</template>

<script>
    import subPageView from '@/layouts/subPageView';
    import {
        dataManageapi
    } from '../api';
    import {
        rowSelection
    } from '@/mixins';
    import {
        postAction
    } from '@/api';
    const columns = [
        {
            title: '科目',
            dataIndex: 'topicName',
            key: 'topicName',
            // width: 180
        },
        {
            title: '老师名称',
            key: 'teacherName',
            dataIndex: 'teacherName'
        },
        {
            title: '创建时间',
            key: 'createDate',
            dataIndex: 'createDate'
        },
        {
            title: '上课班级数',
            key: 'totalClass',
            dataIndex: 'totalClass'
        }
    ];
    export default {
        mixins:[rowSelection],
        components: {
            subPageView,
        },
        data() {
            return {
                columns: columns,
                loadData: parameter => {
                //做一些异步操作
                return postAction(
                    dataManageapi.getSchool,
                    Object.assign(parameter, this.filter)
                ).then(res => {
                    return res;
        });
        },
            superQueryFieldList: [
                {
                    type: 'date',
                    value: 'startDateTime',
                    text: '时间',
                    defaultValue: ''
                },
                {
                    type: 'string',
                    value: 'topicName',
                    text: '主题',
                    defaultValue: ''
                },
                {
                    type: 'string',
                    value: 'schoolName',
                    text: '校区',
                    defaultValue: ''
                }
            ],
        };
        },
        methods: {
            /*查询*/
            handlerSearch(obj) {
                this.filter = obj;
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
</style>
