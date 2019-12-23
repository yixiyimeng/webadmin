<template>
	<sub-page-view>
		<div class="filterbar">
			<div class="subjectlist flex flex-align-center">
				<label>科目</label>
				<div class="flex-1">
					<span v-for="(item,index) in subjectlist" :key="index">{{item}}</span>
				</div>
			</div>
			<div class="flex flex-align-center input-group">
				<a-form layout="inline" :form="form" class="flex-1">
					<a-row :gutter="24" class="mb10">
						<a-col :md="12" :sm="24" :lg="6">
							<a-form-item label="时间">
								<a-date-picker v-decorator="['startDateTime']" class="w100" />
							</a-form-item>
						</a-col>
						<a-col :md="12" :sm="24" :lg="6">
							<a-form-item label="主题">
								<a-select placeholder="请选择主题" v-decorator="['topicCode']" class="w100">
									<a-select-option :value="sel.value" v-for="(sel, $subindex) in topiclist">{{ sel.text }}</a-select-option>
								</a-select>
							</a-form-item>
						</a-col>
						<a-col :md="12" :sm="24" :lg="6">
							<a-form-item label="题目类型">
								<a-select placeholder="请选择题目类型" v-decorator="['topicCode']" class="w100">
									<a-select-option :value="sel.value" v-for="(sel, $subindex) in topiclist">{{ sel.text }}</a-select-option>
								</a-select>
							</a-form-item>
						</a-col>
						<a-col :md="12" :sm="24" :lg="6">
							<a-form-item label="错题状态">
								<a-select placeholder="请选择错题状态" v-decorator="['topicCode']" class="w100">
									<a-select-option :value="sel.value" v-for="(sel, $subindex) in topiclist">{{ sel.text }}</a-select-option>
								</a-select>
							</a-form-item>
						</a-col>
					</a-row>
				</a-form>
				<span class="ml20">
					<a-button type="primary">查询</a-button>
					<a-button style="margin-left: 8px">重置</a-button>
				</span>
			</div>
		</div>
		<div class="flex">
			<div class="leftpart flex-1">
				<div class="title flex flex-pack-justify flex-align-center">
					<div>
						一数学的魅力 <span class="time">2019-08-09 ~ 2019-08-10</span>
					</div>
					<div>
						<span class="num">共<em>9</em>题</span>
						<a href="javascript:;">完成做题</a>
					</div>
				</div>
				<div class="list">
					<div class="problems">
						<div class="tip"></div>
						<div class="seal"></div>
						<div class="title">1.单题单选</div>
						<img src="" alt="">
						<div class="time">答题时间：2019-08-09 11:35:45</div>
						<div class="analysis">
							<div>
								<span>【答题记录】</span>
								<span><em>A;</em><em>B;</em><em>C;</em>D</span>
							</div>
							<div>
								<span>【正确答案】</span>
								<span>D</span>
							</div>
						</div>
					</div>
					<div class="problems">
						<div class="tip err"></div>
						<!-- <div class="seal"></div> -->
						<div class="title">1.单题单选</div>
						<img src="" alt="">
						<div class="time">答题时间：2019-08-09 11:35:45</div>
						<div class="answer">
							<span>A</span>
							<span>B</span>
							<span>C</span>
							<span>D</span>
						</div>
					</div>
				</div>
			</div>
			<div class="topiclist">
				<div class="topic-item flex flex-pack-justify flex-align-center">
					<div>
						一数学的魅力 <span class="time">2019-08-09 ~ 2019-08-10</span>
					</div>
					<div>
						<span class="num">共<em>9</em>题</span>
						<a href="javascript:;" class="show">查看详情</a>
					</div>
				</div>
			</div>
		</div>
	</sub-page-view>
</template>

<script>
	import subPageView from '@/layouts/subPageView';
	export default {
		data() {
			return {
				subjectlist: ['语文', '数学', '英语'],
				form: this.$form.createForm(this),
				filter: {},
				advanced: false,
				topiclist: []
			}
		},
		components: {
			subPageView
		}
	}
</script>

<style scoped="scoped" lang="less">
	.filterbar {
		background: #fff;
		border-radius: 6px;
		box-shadow: 0 0 10px rgba(0, 0, 0, .1);
		padding: 25px 50px;
		font-size: 20px;
		color: #666;

		.subjectlist {
			border-bottom: 1px dashed #ccc;
			padding-bottom: 23px;

			span {
				display: inline-block;
				width: 100px;
				height: 35px;
				line-height: 35px;
				text-align: center;
				border-radius: 5px;
				margin-left: 40px;

				&.active {
					background: #125fc9;
					color: #fff;

				}
			}
		}

		.input-group {
			padding-top: 20px;
		}

		label {
			font-weight: bold;
		}


	}

	/deep/ .ant-form-item-label {
		width: 5em;
		text-align: right;
		font-size: 16px;

		label {
			font-size: 16px;
		}
	}

	.leftpart {
		margin-right: 15px;
	}

	.leftpart>.title,
	.leftpart .problems,
	.topiclist .topic-item {
		border-radius: 6px;
		box-shadow: 0 0 10px rgba(0, 0, 0, .1);
		background: #fff;
		padding: 30px 40px 30px 50px;
		margin-top: 15px;
	}

	.leftpart>.title,
	.topiclist .topic-item {
		color: #666;
		font-size: 24px;

		.time {
			color: #999;
			font-size: 14px;
			margin-left: 8px;
		}

		.num {
			font-size: 16px;
			color: #333;

			em {
				font-style: normal;
				color: #b30000;
			}
		}

		a {
			display: inline-block;
			width: 100px;
			line-height: 35px;
			background: #8400ff;
			color: #fff;
			margin-left: 15px;
			text-align: center;
			border-radius: 2px;
			font-size: 15px;

			&.show {
				background: #125fc9;
			}
		}
	}

	.topiclist .topic-item {
		padding-right: 30px;
	}

	.leftpart .problems {
		position: relative;

		.tip {
			position: absolute;
			height: 64px;
			width: 64px;
			top: 0;
			left: 0;
			background: url(../assets/tip.png) no-repeat center center;

			&.err {
				background-image: url(../assets/tip2.png)
			}
		}

		.seal {
			position: absolute;
			height: 85px;
			width: 93px;
			top: 15px;
			right: 40px;
			background: url(../assets/tip3.png) no-repeat center center;
		}

		.title {
			color: #2459a0;
			font-size: 24px;
		}

		.time {
			color: #666;
			font-size: 14px;
			line-height: 40px;
			background: #efefef;
			padding-left: 25px;
		}

		.answer {
			font-size: 20px;
			color: #666;
			margin-top: 10px;

			span {
				display: inline-block;
				margin-right: 60px;
			}
		}
		.analysis{
			color: #2459a0;
			font-size: 18px;
			padding-left:30px;
			&>div{
				margin-top: 10px;
			}
			em{
				font-style: normal;
				color:#d23654;
			}
		}
	}
</style>
