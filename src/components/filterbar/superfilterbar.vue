<template>
	<a-form layout="inline" :form="form">
		<a-row :gutter="24" class="mb10">
			<a-col :md="12" :sm="24" :lg="8">
				<a-form-item label="时间" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18 }">
					<a-date-picker v-decorator="['startDateTime']" class="w100" @change="handleTime" />
				</a-form-item>
			</a-col>
			<a-col :md="12" :sm="24" :lg="8">
				<a-form-item label="主题" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18 }">
					<a-select placeholder="请选择主题" v-decorator="['topicCode']" class="w100">
						<a-select-option :value="sel.value" v-for="(sel, $subindex) in topiclist">{{ sel.text }}</a-select-option>
					</a-select>
				</a-form-item>
			</a-col>
			<!-- <a-col :md="12" :sm="24" :lg="8" v-for="(item, index) in fieldList.slice(0, 2)" :key="index">
				<a-form-item :label="item.text" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18 }">
					<a-input-number v-if="item.type == 'int' || item.type == 'number'" v-decorator="[item.value]" :min="1"  class="w100" />
					<a-date-picker v-else-if="item.type == 'date'" v-decorator="[item.value]" class="w100"  @change="handleTime"/>
					<a-month-picker v-else-if="item.type == 'month'" v-decorator="[item.value]"  class="w100"/>
					<a-range-picker v-else-if="item.type == 'rangeDate'" v-decorator="[item.value]"  class="w100"/>
					<a-select :placeholder="`请选择${item.text}`" v-else-if="item.type == 'select'"  v-decorator="[item.value]"  class="w100">
						<a-select-option :value="sel.value" v-for="(sel, $subindex) in item.optionlist">{{ sel.text }}</a-select-option>
					</a-select>
					<a-input :placeholder="`请输入${item.text}`" v-else v-decorator="[item.value]" autocomplete="off"  class="w100"/>
				</a-form-item>
			</a-col>
			<template v-if="fieldList.length>2">
				<a-col :md="12" :sm="24" :lg="8" v-for="(item, index) in fieldList.slice(2)" :key="item.value" v-show="advanced||fieldList.length<=2">
					<a-form-item :label="item.text" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18 }"  class="w100">
						<a-input-number v-if="item.type == 'int' || item.type == 'number'" v-decorator="[item.value]" :min="1"   class="w100"/>
						<a-date-picker v-else-if="item.type == 'date'" v-decorator="[item.value]"  class="w100"/>
						<a-month-picker v-else-if="item.type == 'month'" v-decorator="[item.value]"   class="w100"/>
						<a-range-picker v-else-if="item.type == 'rangeDate'" v-decorator="[item.value]"  class="w100"/>
						<a-select :placeholder="`请选择${item.text}`" v-else-if="item.type == 'select'"  v-decorator="[item.value]"  class="w100">
							<a-select-option :value="sel.value" v-for="(sel, $subindex) in item.optionlist">{{ sel.text }}</a-select-option>
						</a-select>
						<a-input :placeholder="`请输入${item.text}`" v-else v-decorator="[item.value]"  autocomplete="off"  class="w100"/>
					</a-form-item>
				</a-col> 
			</template> -->
			<a-col :md="12" :sm="24" :lg="8" style="margin-top: 3px;float: right;" >
				<span class="table-page-search-submitButtons" :style="(advanced && { float: 'right', overflow: 'hidden'}) || {}">
					<a-button type="primary" @click="search">查询</a-button>
					<a-button style="margin-left: 8px" @click="reset">重置</a-button>
					<a @click="toggleAdvanced" style="margin-left: 8px" v-if="fieldList.length>=3">
						{{ advanced ? '收起' : '展开' }}
						<a-icon :type="advanced ? 'up' : 'down'" />
					</a>
				</span>
			</a-col>
		</a-row>
	</a-form>
</template>

<script>
	import {
		postAction,
		getToplist
	} from '@/api';
	export default {
		name: 'filterbar',
		props: {
			fieldList: Array
		},
		data() {
			return {
				form: this.$form.createForm(this),
				filter: {},
				advanced: false,
				topiclist: []
			};
		},
		created() {
			/* vue 实例创建成功 */
			this.$nextTick(() => {
				this.getDefaultValue();
			});
		},
		watch: {
			fieldList: {
				handler(newName, oldName) {
					//this.getDefaultValue();
				},
				deep: true
				// 代表在wacth里声明了firstName这个方法之后立即先去执行handler方法
				//immediate: true
			}
		},
		methods: {
			search() {
				var keys = Object.keys(this.filter);
				var filterparam = this.form.getFieldsValue(keys);
				for(var key in filterparam){
					console.log(typeof filterparam[key])
					if( typeof filterparam[key] =='string'){
						filterparam[key]=filterparam[key].trim()
					}
					
				}
				this.$emit('handlerSearch', Object.assign({}, this.filter, filterparam));
			},
			reset() {
				this.getDefaultValue();
				var keys = Object.keys(this.filter);
				var filterparam = this.form.getFieldsValue(keys);
				this.topiclist = [];
				this.$emit('handlerReset', Object.assign({}, this.filter, filterparam));
			},
			toggleAdvanced() {
				this.advanced = !this.advanced;
			},
			getDefaultValue() {
				this.filter = {};
				if (this.fieldList && this.fieldList.length > 0) {
					this.fieldList.forEach(item => {
						this.filter[item.value] = item.defaultValue;
					});
				}
				this.form.setFieldsValue({
					...this.filter
				});
			},
			/* 获取主题 */
			getToplist(startDatetime) {
				if (startDatetime) {
					getToplist({startDateTime:startDatetime}).then(da => {
						let toplist = da;
						if (toplist && toplist.length > 0) {
							this.topiclist = toplist.map(item => {
								return {
									value: item.topicCode,
									text: item.topicName
								}
							});
						} else {
							this.topiclist = [];
						}
					});
				} else {
					this.topiclist = [];
				}
				this.form.setFieldsValue({
					topicCode:null
				});

			},
			handleTime(data, datastr) {
				this.getToplist(datastr)

			}
		}
	};
</script>

<style scoped="scoped" lang="less">
	.ant-input-number,
	.ant-form-inline .ant-form-item {
		width: 100%;
	}

	.w100 {
		width: 100%
	}
</style>
