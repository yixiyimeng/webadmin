<template>
	<a-form layout="inline" :form="form">
		<a-row :gutter="24" class="mb10">
			<a-col :md="12" :sm="24" :lg="8" v-if="isUserAdminRole">
				<a-form-item label="机构" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18 }" >
					<a-select placeholder="请选择结构" v-decorator="['organization']" class="w100" @change="handleOrg">
						<a-select-option :value="sel.code" v-for="(sel, $subindex) in orglist">{{ sel.name }}</a-select-option>
					</a-select>
				</a-form-item>
			</a-col>
			<a-col :md="12" :sm="24" :lg="8">
				<a-form-item label="时间" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18 }">
					<a-date-picker v-decorator="['startDate']" class="w100" @change="handleTime" :disabledDate="disabledDate"
					 dropdownClassName="datepicker" :showToday="false" @openChange="openChange" />
				</a-form-item>
			</a-col>
			<a-col :md="12" :sm="24" :lg="8" v-show="(advanced&&isUserAdminRole)||!isUserAdminRole">
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
					<a-form-item label="科目" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18 }">
						<a-select placeholder="请选择科目" v-decorator="['subjectCode']" class="w100"  @change="handleSubject">
							<a-select-option :value="sel.subjectCode" v-for="(sel, $subindex) in subjectlist">{{ sel.subjectName }}</a-select-option>
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
			fieldList: Array,
			
		},
		data() {
			return {
				form: this.$form.createForm(this),
				filter: {
					schoolCode: '',
					topicCode: '',
					classCode: ''
				},
				advanced: false,
				topiclist: [],
				schoollist: [],
				classlist: [],
				subjectlist:[],
				startDateTime: '',
				isUserAdminRole: false, //是否是超级管理员
				isorgAdminRole: false, //是否是结构管理员
				orglist: [], //机构列表
				orgCode: '',
				abledTime: [],
				startDate: ''
			};
		},
		created() {
			try {
				if (JSON.parse(localStorage.getItem('userInfo')).roleSign == 'admin') {
					this.isUserAdminRole = true;
				} else if (JSON.parse(localStorage.getItem('userInfo')).roleSign == 'orgAdmin') {
					this.isorgAdminRole = true;
				}
			} catch (e) {
				//TODO handle the exception
			}
			/* vue 实例创建成功 */
			this.$nextTick(() => {
				this.getDefaultValue();
			});

		},
		methods: {
			search() {
				var filterparam = this.form.getFieldsValue();
				for (var key in filterparam) {
					if (typeof filterparam[key] == 'string') {
						filterparam[key] = filterparam[key].trim()
					}
					if (key == 'startDate' && filterparam[key]) {
						filterparam[key] = filterparam[key].format('YYYY-MM-DD')
					}

				}
				
				this.$emit('handlerSearch', Object.assign({}, this.filter, filterparam));
			},
			reset() {
				this.getDefaultValue();
				this.schoollist = [];
				this.topiclist = [];
				this.classlist = [];
				this.abledTime =[];
				this.subjectlist=[];
				this.$emit('handlerReset');
			},
			toggleAdvanced() {
				this.advanced = !this.advanced;
			},
			getDefaultValue() {
				this.form.setFieldsValue({
					organization: null,
					startDate: null,
					schoolCode: null,
					classCode: null,
					topicCode: null,
					subjectCode: null,
					
				});
				if (this.isUserAdminRole) {
					this.getOrglist().then(da => {
						/* 根据 机构，月份过滤日期 */
						// this.getTopicDate({
						// 	startDate: moment().format('YYYY-MM'),
						// 	organization: this.form.getFieldValue('organization')
						// })
					})
				} else {
					this.getTopicDate({
						startDate: moment().format('YYYY-MM'),
					})
				}
				// this.getSchoollist(moment().format('YYYY-MM-DD'))
				
			},
			/* 查询机构 */
			getOrglist() {
				return postAction(api.getOrglist).then(da => {
					if (da && da.code == 0 && da.data.length > 0) {
						this.orglist = da.data;
						// if (this.orglist && this.orglist.length > 0) {
						// 	this.orgCode = da.data[0].code
						// 	this.form.setFieldsValue({
						// 		organization: da.data[0].code,
						// 	});
						// }


					} else {
						this.orglist = [];
					}
				})
			},
			/* 获取主题 */
			getToplist(paramer) {
				postAction(api.gettestTopiclistbyDate, paramer).then(da => {
					if (da.code == 0 && da.data.length > 0) {
						this.topiclist = da.data;
					} else {
						this.topiclist = [];
					}
				});
				this.form.setFieldsValue({
					topicCode: null
				});

			},
			/* 获取校区 */
			getSchoollist(startDatetime, ) {
				this.startDateTime = startDatetime;
				this.schoollist = [];
				if (startDatetime) {
					postAction(api.gettestSchoollistbyDate, {
						startDate: startDatetime,
						organization: this.form.getFieldValue('orgCode')
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
					postAction(api.gettestClasslistbyDate, paramer).then(da => {
						if (da.code == 0) {
							let classlist = da.data;
							this.classlist = classlist || []
						}
					});
				}
				this.subjectlist = [];
				this.topiclist = [];
				this.form.setFieldsValue({
					classCode: null,
					subjectCode: null,
					topicCode: null

				});
			},
			/* 获取科目 */
			getSubjectlist(paramer) {
				this.subjectlist = []
				postAction(api.gettestSubjectlist, paramer).then(da => {
					if (da.code == 0) {
						let subjectlist = da.data;
						this.subjectlist = subjectlist || []
					}
				});
				this.topiclist = [];
				this.form.setFieldsValue({
					subjectCode: null,
					topicCode: null
			
				});
			},
			
			handleTime(data, datastr) {
				this.getSchoollist(datastr)
			},
			handleSchool(schoolcode) {
				this.getClasslist({
					schoolCode: schoolcode,
					startDate: this.form.getFieldValue('startDate').format('YYYY-MM-DD')
				})
			},
			handleClass(classcode) {
				
				this.getSubjectlist({
					classCode: classcode,
					startDate: this.form.getFieldValue('startDate').format('YYYY-MM-DD')
				})
			
			},
			handleSubject(subjectCode){
				this.getToplist({
					classCode: this.form.getFieldValue('classCode'),
					subjectCode: subjectCode,
					startDate: this.form.getFieldValue('startDate').format('YYYY-MM-DD')
				})
			},
			handleOrg(orgCode) {
				/* 切换机构，查询时间 */
				this.getTopicDate({
					organization: orgCode
				})
			},
			getTopicDate(paramer) {
				var param = Object.assign({
					startDate: moment().format('YYYY-MM'),
					organization: this.form.getFieldValue('orgCode')
				}, paramer)
				/* 查询有主题的日期 */
				postAction(api.gettestTopicDate, param).then(da => {
					/* 设置有效日期 */
					console.log(da.data);
					if (da && da.data.length > 0) {
						this.abledTime = da.data.map(item => {
							return parseInt(item.split('-')[2])
						});
						this.startDate = param.startDate;

					}else{
						this.abledTime =[]
					}
				})
			},
			disabledDate(current) {
				var day = parseInt(current.format('D'));
				return !(this.abledTime && this.abledTime.length > 0 && (this.abledTime.indexOf(day) > -1) && current.format(
					'YYYY-MM') == this.startDate)
				// return current && current < moment().endOf('day');
			},
			openChange(isShow) {
				if (isShow) {
					setTimeout(() => {
						const dateDom = document.querySelector('.ant-calendar-ym-select')
						dateDom.addEventListener('DOMCharacterDataModified', () => {
							//this.getDatePanelStyle()
							//this.dateSpinning = true
							const year = document.querySelector('.ant-calendar-year-select').innerText.replace('年', '')
							let month = document.querySelector('.ant-calendar-month-select').innerText.replace('月', '')
							month = month < 10 ? '0' + month : month;
							console.log(year + '-' + month);
							/* 监听月份变化，查询可用日期 */
							this.getTopicDate({
								startDate: year + '-' + month
							})
						})
					}, 0)
				}

			},

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
<style lang="less">
	.datepicker /deep/ :not(.ant-calendar-selected-date):not(.ant-calendar-selected-day).ant-calendar-today .ant-calendar-date {
		border-color: transparent;
		color: #bcbcbc;
	}
</style>
