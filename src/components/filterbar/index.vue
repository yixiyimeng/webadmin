<template>
	<a-form layout="inline" :form="form">
		<a-row :gutter="24" class="mb10">
			<a-col :md="12" :sm="24" :lg="8" v-for="(item, index) in fieldList.slice(0, 2)" :key="index">
				<a-form-item :label="item.text" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18 }">
					<a-input-number v-if="item.type == 'int' || item.type == 'number'" v-decorator="[item.value]" :min="1"  class="w100" />
					<a-date-picker v-else-if="item.type == 'date'" v-decorator="[item.value]" class="w100" />
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
			</template>
			<a-col :md="12" :sm="24" :lg="8" style="margin-top: 3px;;" :style="fieldList.length<=1&&{float:'left'}||{float: 'right'} ">
				<span class="table-page-search-submitButtons" :style="(advanced&& { float: 'right', overflow: 'hidden'}) || {}">
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
				this.getDefaultValue();
			},
			deep:true
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
				if( typeof filterparam[key] =='number'&&filterparam[key]==-1){
					filterparam[key]=null
				}
				
			}
			this.$emit('handlerSearch', Object.assign({},this.filter,filterparam));
		},
		reset() {
			this.getDefaultValue();
			var keys = Object.keys(this.filter);
			var filterparam = this.form.getFieldsValue(keys);
			for(var key in filterparam){
				console.log(typeof filterparam[key])
				if( typeof filterparam[key] =='string'){
					filterparam[key]=filterparam[key].trim()
				}
				if( typeof filterparam[key] =='number'&&filterparam[key]==-1){
					filterparam[key]=null
				}
				
			}
			this.$emit('handlerReset', Object.assign({},this.filter,filterparam));
		},
		toggleAdvanced() {
			this.advanced = !this.advanced;
		},
		getDefaultValue() {
			this.filter={};
			if (this.fieldList && this.fieldList.length > 0) {
				this.fieldList.forEach(item => {
					this.filter[item.value] = item.defaultValue;
				});
			}
			console.log(this.filter);
			this.form.setFieldsValue({
				...this.filter
			});
		}
	}
};
</script>

<style scoped="scoped" lang="less">
.ant-input-number,.ant-form-inline .ant-form-item {
	width: 100%;
}
.w100{
	width: 100%
}
</style>
