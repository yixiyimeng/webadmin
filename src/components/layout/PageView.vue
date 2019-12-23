<template>
	<a-layout-content :style="{ padding: '10px 10px 0', height: '100%' }" style="position: relative;">
		<div class="pagehd" :style="{ background: '#fff', padding: '0 24px', margin: '0 -10px 0',textAlign:'left' }">
			<a-breadcrumb class="breadcrumb">
				<a-breadcrumb-item v-for="(item, index) in breadList" :key="index">
					<router-link v-if="item.name != name" :to="{ path: item.path }">{{ item.meta.title }}</router-link>
					<span v-else>{{ item.meta.title }}</span>
				</a-breadcrumb-item>
			</a-breadcrumb>
			<!-- <h4 style="font-size: 20px; display: inline-block; line-height: 28px; margin-bottom: 16px;">{{ getTitle }}</h4> -->
			<slot name="hd-button"></slot>
			<slot name="hd-right"></slot>
		</div>
		<a-card :bordered="false" class="cardbox" style="position: absolute; top: 42px; left: 0; right: 0; bottom: 0;"><slot></slot></a-card>
	</a-layout-content>
</template>

<script>
// import '@/pages/index/components.js' //按需加载的ant-design 样式
//import Breadcrumb from '@/components/tools/Breadcrumb';
export default {
	name: 'PageContent',
	// components: {
	// 	's-breadcrumb': Breadcrumb
	// },
	data() {
		return {
			breadList: []
		};
	},
	computed: {
		getTitle() {
			return this.$route.meta.title;
		}
	},
	created() {
		this.getBreadcrumb();
	},
	methods: {
		getBreadcrumb() {
			this.breadList = [];
			/*this.breadList.push({
					name: 'index',
					path: '/dashboard/',
					meta: {
						title: '首页'
					}
				})*/

			this.name = this.$route.name;
			// console.log("是什么"+JSON.stringify(this.$route.name))
			// console.log("哈哈哈事实上"+JSON.stringify(this.$router.options.routes))
			// console.log("哈哈哈事实上11"+JSON.stringify(this.$route.matched))
			this.$route.matched.forEach(item => {
				// item.meta.name === 'dashboard' ? item.path = '/dashboard' : this.$route.path === item.path
				this.breadList.push(item);
			}); 
			//alert(JSON.stringify(this.breadList))
			
		}
	},
	watch: {
		$route() {
			this.getBreadcrumb();
		}
	}
};
</script>

<style lang="scss" scoped>
.breadcrumb {
	margin-bottom: 10px;
}
.pagehd {
	overflow: hidden;
	border-bottom: 1px solid #e8e8e8;
}

.hd-right {
	float: right;
}

.cardbox {
	// margin: 10px 0 10px;
	// padding-bottom: 30px;
}
/deep/ .ant-form-inline .ant-form-item {
	width: 100%;
	display: flex;
	/deep/ .ant-form-item-control-wrapper {
		flex: 1;
		/deep/ .ant-calendar-picker {
			width: 100%;
		}
	}
}
/deep/ .ant-card-body {
	padding:0 14px;
}
</style>
