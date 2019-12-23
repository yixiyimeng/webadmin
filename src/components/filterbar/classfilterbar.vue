<template>
	<a-form layout="inline" :form="form">
		<a-row :gutter="24" class="mb10">
			<a-col :md="12" :sm="24" :lg="8">
				<a-form-item label="时间" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18 }">
					<a-date-picker v-decorator="['startDateTime']" class="w100" @change="handleTime" />
				</a-form-item>
			</a-col>
			<a-col :md="12" :sm="24" :lg="8">
				<a-form-item label="校区" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18 }">
					<a-select placeholder="请选择校区" v-decorator="['schoolCode']" class="w100" @change="handleSchool">
						<a-select-option :value="sel.schoolCode" v-for="(sel, $subindex) in schoollist">{{ sel.schoolName }}</a-select-option>
					</a-select>
				</a-form-item>
			</a-col>
			<template>
				<a-col :md="12" :sm="24" :lg="8" v-show="advanced">
					<a-form-item label="班级" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18 }">
						<a-select placeholder="请选择班级" v-decorator="['classCode']" class="w100" @change="handleClass">
							<a-select-option :value="sel.classCode" v-for="(sel, $subindex) in classlist">{{ sel.className }}</a-select-option>
						</a-select>
					</a-form-item>
				</a-col>
				<a-col :md="12" :sm="24" :lg="8" v-show="advanced">
					<a-form-item label="主题" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18 }">
						<a-select placeholder="请选择主题" v-decorator="['topicCode']" class="w100">
							<a-select-option :value="sel.topicCode" v-for="(sel, $subindex) in topiclist">{{ sel.topicName }}</a-select-option>
						</a-select>
					</a-form-item>
				</a-col>

			</template>

			<a-col :md="12" :sm="24" :lg="8" style="margin-top: 3px;float: right;">
				<span class="table-page-search-submitButtons" :style="(advanced && { float: 'right', overflow: 'hidden'}) || {}">
					<a-button type="primary" @click="search">查询</a-button>
					<a-button style="margin-left: 8px" @click="reset">重置</a-button>
					<a @click="toggleAdvanced" style="margin-left: 8px">
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
		getToplist,
		api
	} from '@/api';
	export default {
		name: 'filterbar',
		props: {
			fieldList: Array
		},
		data() {
			return {
				form: this.$form.createForm(this),
				filter: {
					topicCode: '',
					classCode: ''
				},
				advanced: false,
				topiclist: [],
				schoollist: [],
				classlist: [],
				startDateTime: ''
			};
		},
		created() {
			/* vue 实例创建成功 */
			this.$nextTick(() => {
				this.getDefaultValue();
			});
		},
		methods: {
			search() {
				var keys = Object.keys(this.filter);
				var filterparam = this.form.getFieldsValue(keys);
				console.log(filterparam);
				for (var key in filterparam) {
					//console.log(typeof filterparam[key])
					if (typeof filterparam[key] == 'string') {
						filterparam[key] = filterparam[key].trim()
					}

				}
				this.$emit('handlerSearch', Object.assign({}, this.filter, filterparam));
			},
			reset() {
				this.getDefaultValue();
				var keys = Object.keys(this.filter);
				var filterparam = this.form.getFieldsValue(keys);
				this.topiclist = [];
				this.classlist = [];
				this.$emit('handlerReset');
			},
			toggleAdvanced() {
				this.advanced = !this.advanced;
			},
			getDefaultValue() {
				this.getSchoollist(moment().format('YYYY-MM-DD'))
				this.form.setFieldsValue({
					startDateTime: moment(),
					schoolCode: null,
					classCode: null,
					topicCode: null
				});
			},
			/* 获取主题 */
			getToplist(paramer) {
				if (paramer.classCode) {
					/* getToplist(paramer).then(da => {
						let toplist = da;
						if (toplist && toplist.length > 0) {
							this.topiclist = toplist;
						} else {
							this.topiclist = [];
						}
					}); */
					postAction(api.getCountToplist, paramer).then(da => {
						if (da.code == 0 && da.data.length > 0) {
							this.topiclist = da.data;
						} else {
							this.topiclist = [];
						}
					});
				} else {
					this.topiclist = [];
				}
				this.form.setFieldsValue({
					topicCode: null
				});

			},
			/* 获取校区 */
			getSchoollist(startDatetime) {
				this.startDateTime = startDatetime;
				this.schoollist = [];
				if (startDatetime) {
					postAction(api.getCountSchoollist, {
						startDateTime: startDatetime
					}).then(da => {
						if (da.code == 0) {
							let schoollist = da.data;
							this.schoollist = schoollist || []
						}

					});
				}
				this.classlist = [];
				this.topiclist = [];
				this.form.setFieldsValue({
					schoolCode: null,
					classCode: null,
					topicCode: null
				});

			},
			/* 获取班级 */
			getClasslist(paramer) {
				this.classlist = []
				if (paramer.schoolCode) {
					postAction(api.getCountClasslist, paramer).then(da => {
						if (da.code == 0) {
							let classlist = da.data;
							this.classlist = classlist || []
						}
					});
				}
				this.topiclist = [];
				this.form.setFieldsValue({
					classCode: null,
					topicCode: null

				});
			},
			handleTime(data, datastr) {
				this.getSchoollist(datastr)

			},
			handleSchool(schoolcode) {
				this.getClasslist({
					schoolCode: schoolcode,
					startDateTime: this.startDateTime
				})
			},
			handleClass(classcode) {
				this.getToplist({
					classCode: classcode,
					startDateTime: this.startDateTime
				})
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
